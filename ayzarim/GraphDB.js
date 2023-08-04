/**
 * B"H
 */

var DosDB = requre("./DosDB.js");
var fs = require("fs").promises;
const path = require("path");

const {v4:uuidv4} = require("uuid");
class Node {
    constructor(id, data) {
        this.id = id;
        this.data = data;
        this.relationships = {};
    }
}

class Relationship {
    constructor(srcId, destId, type, data) {
        this.srcId = srcId;
        this.destId = destId;
        this.type = type;
        this.data = data;
    }
}



class GraphDB extends DosDB {
    constructor(directory, cacheSize = 1000) {
        super(directory);
        this.indexes = {
            nodeType: {},
            relationshipType: {}
        };
        this.cache = new Map();
        this.cacheSize = cacheSize;
    }

    async get(id) {
        // Check the cache first
        if (this.cache.has(id)) {
          // Move the accessed item to the end of the map
          const value = this.cache.get(id);
          this.cache.delete(id);
          this.cache.set(id, value);
          return value;
        }
    
        const value = await super.get(id);
    
        // If the cache is full, remove the least recently used item
        if (this.cache.size >= this.cacheSize) {
          const firstKey = this.cache.keys().next().value;
          this.cache.delete(firstKey);
        }
    
        // Add the item to the cache
        this.cache.set(id, value);
    
        return value;
      }

    async loadAllDataAndBuildIndexes() {
        const files = await fs.readdir(this.directory);
        for (let file of files) {
            const id = path.basename(file, '.json');
            const data = await this.get(id);

            if (data instanceof Node) {
                // Update the nodeType index
                if (!this.indexes.nodeType[data.data.type]) {
                    this.indexes.nodeType[data.data.type] = [];
                }
                this.indexes.nodeType[data.data.type].push(id);
            } else if (data instanceof Relationship) {
                // Update the relationshipType index
                if (!this.indexes.relationshipType[data.type]) {
                    this.indexes.relationshipType[data.type] = [];
                }
                this.indexes.relationshipType[data.type].push({src: data.srcId, dest: data.destId});
            }
        }
    }


    
    async loadIndexes() {
        try {
            this.indexes.nodeType = await this.get('index/nodeType') || {};
            this.indexes.relationshipType = await this.get('index/relationshipType') || {};
        } catch (error) {
            console.error('Error loading indexes:', error);
        }
    }

    async saveIndexes() {
        try {
            await this.create('index/nodeType', this.indexes.nodeType);
            await this.create('index/relationshipType', this.indexes.relationshipType);
        } catch (error) {
            console.error('Error saving indexes:', error);
        }
    }

    async updateIndex(type, id, dir) {
        let index;
        try {
            index = await this.get(`index/${type}`);
        } catch (error) {
            index = [];
        }
        index.push(id);
        await this.create(`index/${type}`, index);
        await this.create(`${dir}/${id}`, index);
    }
    
    
    async createNode(data) {
        const id = uuidv4();
        const node = new Node(id, data);
        await this.create(`node/${id}`, node);

        // Update the nodeType index
        await this.updateIndex(data.type, id, 'node');
       

        return id;
    }

    async createRelationship(srcId, destId, type, data) {
        const relationship = new Relationship(srcId, destId, type, data);
        const key = `${srcId}/${destId}/${type}`;
        await this.create(key, relationship);

        // Update the relationshipType index
        await this.updateIndex(type, key, 'relationship');
    

        return key;
    }


    async getNodesOfType(type) {
        const nodeIds = this.indexes.nodeType[type] || [];
        return Promise.all(nodeIds.map(id => this.get(id)));
    }

    async getRelationshipsOfType(type) {
        const relationships = this.indexes.relationshipType[type] || [];
        return Promise.all(relationships.map(({src, dest}) => this.get(`${src}-${dest}-${type}`)));
    }

    async getRelationshipsBetweenTypes(type1, type2, relationshipType) {
        const relationships = this.indexes.relationshipType[relationshipType] || [];
        let filteredRelationships = [];

        for (let {src, dest} of relationships) {
            const srcNode = await this.get(src);
            const destNode = await this.get(dest);

            if (srcNode.data.type === type1 && destNode.data.type === type2) {
                filteredRelationships.push(await this.get(`${src}-${dest}-${relationshipType}`));
            }
        }

        return filteredRelationships;
    }

   
}
