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
        this.cache = new Map();
        this.cacheSize = cacheSize;
        this.indices = {
            nodeType: new Map(),
            relationshipType: new Map()
        };
        this.loadIndices().catch(console.error);
    }

    async createUUID() {
        let id = uuidv4();
        while (await this.exists(id)) {
            id = uuidv4();
        }
        return id;
    }

    async createNode(data) {
        const id = await this.createUUID();
        const node = new Node(id, data);
        await this.create(id, node);
        this.updateIndex('nodeType', data.type, id);
        return id;
    }

    async createRelationship(srcId, destId, type, data) {
        const id = await this.createUUID();
        const relationship = new Relationship(srcId, destId, type, data);
        await this.create(id, relationship);
        this.updateIndex('relationshipType', type, id);
        return id;
    }

    async updateIndex(indexType, type, id) {
        let indexList = this.indices[indexType].get(type);
        if (!indexList) {
            indexList = [];
            this.indices[indexType].set(type, indexList);
        }
        indexList.push(id);
        await this.save(`index/${indexType}/${type}`, indexList);
    }

    async getNodesOfType(type) {
        const nodeIds = this.indices.nodeType.get(type);
        if (!nodeIds) {
            return [];
        }
        return await Promise.all(nodeIds.map(id => this.get(id)));
    }

    async getRelationshipsOfType(type) {
        const relationshipIds = this.indices.relationshipType.get(type);
        if (!relationshipIds) {
            return [];
        }
        return await Promise.all(relationshipIds.map(id => this.get(id)));
    }

    async getRelationshipsBetweenTypes(type1, type2, relationshipType) {
        const relationshipIds = this.indices.relationshipType.get(relationshipType);
        if (!relationshipIds) {
            return [];
        }
        let relationships = await Promise.all(relationshipIds.map(id => this.get(id)));
        return relationships.filter(rel => rel.srcId.data.type === type1 && rel.destId.data.type === type2);
    }

    async loadIndices() {
        const indexFiles = await fs.readdir(this.directory);
        const indexTypes = Object.keys(this.indices);
        for (let file of indexFiles) {
            const [indexType, type] = path.basename(file, '.json').split('/');
            if (indexTypes.includes(indexType)) {
                this.indices[indexType].set(type, await this.get(file));
            }
        }
    }
}

