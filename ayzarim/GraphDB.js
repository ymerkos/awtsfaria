/**
 * B"H
 * @file GraphDB.js
 * @desc A GraphDB implementation that extends DosDB. It represents a graph database with Nodes and Relationships.
 * Nodes can have properties and can be connected with Relationships. The GraphDB class provides methods for CRUD operations on Nodes and Relationships,
 * as well as performing complex operations described in a JSON structure.
 */


var DosDB = requre("./DosDB.js");
var fs = require("fs").promises;
const path = require("path");

const {v4:uuidv4} = require("uuid");

/**
 * @class Node
 * @desc Represents a node in the graph.
 * @param {string} id - The unique identifier for the node.
 * @param {Object} data - The properties of the node.
 * @example
 * const node = new Node("1234", { name: "Mendel", age: 22 });
 */

class Node {
    constructor(id, data) {
        this.id = id;
        this.data = data;
        this.relationships = {};

        if(data.type != "string") {
            data.type = "ETSEM";
        } else {
            data.type = data.type.toUpperCase();
        }
    }
}


/**
 * @class Relationship
 * @desc Represents a relationship in the graph.
 * @param {string} srcId - The id of the source node.
 * @param {string} destId - The id of the destination node.
 * @param {string} type - The type of the relationship.
 * @param {Object} data - The properties of the relationship.
 * @example
 * const relationship = new Relationship("1234", "5678", "STUDIES", { startDate: "2023-01-01" });
 */

class Relationship {
    constructor(srcId, destId, type, data) {
        this.srcId = srcId;
        this.destId = destId;
        this.type = type;
        this.data = data;
    }
}



/**
 * @class GraphDB
 * @desc Extends DosDB to provide a graph database functionality.
 * @example
 * const db = new GraphDB("./db");
 */

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

    
    /**
     * @method performOperation
     * @desc Performs a CRUD operation on the graph database based on the input JSON.
     * @param {Object} operation - The CRUD operation to perform, described in a JSON structure.
     * @returns {Object} The result of the operation.
     * @example
     * const operation = {
     *   type: "create",
     *   nodeType: "Talmid",
     *   properties: {
     *     name: "Mendel",
     *     age: 22
     *   },
     *   relationships: [
     *     {
     *       type: "STUDIES",
     *       direction: "out",
     *       nodeType: "Sefer",
     *       where: {
     *         name: "Tanya"
     *       },
     *       properties: {
     *         startDate: "2023-01-01"
     *       }
     *     }
     *   ],
     *   filter: {
     *     AND: [
     *       {
     *         name: {
     *           EQ: "Mendel"
     *         }
     *       },
     *       {
     *         age: {
     *           GTE: 20
     *         }
     *       }
     *     ]
     *   },
     *   sort: [
     *     {
     *       field: "name",
     *       order: "ASC"
     *     }
     *   ],
     *   pagination: {
     *     offset: 0,
     *     limit: 10
     *   },
     *   math: {
     *     field: "age",
     *     operation: "INCREMENT",
     *     value: 1
     *   }
     * };
     * const result = db.performOperation(operation);
     */

    async performOperation(operation) {
        const nodes = await this.readNodes(operation.nodeType, operation.filter);
        switch(operation.type) {
            case "create":
                return await this.createNode(operation.nodeType, operation.properties, operation.relationships);
            case "read":
                return await this.sortAndPaginate(nodes, operation.sort, operation.pagination);
            case "update":
                return await this.updateNodes(nodes, operation.properties, operation.math);
            case "delete":
                return await this.deleteNodes(nodes);
            default:
                throw new Error(`Unknown operation type: ${operation.type}`);
        }
    }


    /**
     * @method createNode
     * @desc Creates a new node in the database.
     * @param {Object} data - The properties of the node.
     * @returns {string} The id of the created node.
     * @example
     * const id = db.createNode({ name: "Mendel", age: 22 });
     */

    async createNode(nodeType, properties, relationships = []) {
        const id = await this.createUUID();
        const node = new Node(id, {type: nodeType, ...properties});
        await this.create(id, node);
        this.updateIndex('nodeType', nodeType, id);

        for (let relationship of relationships) {
            await this.createRelationship(id, relationship.nodeType, relationship.type, relationship.properties);
        }

        return id;
    }

    // Updated readNodes method to support relationships
    async readNodes(nodeType, filter) {
        const nodeIds = this.indices.nodeType.get(nodeType);
        if (!nodeIds) {
            return [];
        }
        const nodes = await Promise.all(nodeIds.map(id => this.get(id)));
        return nodes.filter(node => this.matchesFilter(node.data, filter));
    }

    // Updated updateNodes method to support mathematical operations
    async updateNodes(nodes, properties, math) {
        for (let node of nodes) {
            Object.assign(node.data, properties);
            this.performMathOperation(node.data, math);
            await this.update(node.id, node);
        }
    }

    async deleteNodes(nodes) {
        for (let node of nodes) {
            await this.delete(node.id);
        }
    }

    performMathOperation(data, math) {
        if (!math) {
            return;
        }

        switch(math.operation) {
            case "INCREMENT":
                data[math.field] += math.value;
                break;
            case "DECREMENT":
                data[math.field] -= math.value;
                break;
            case "MULTIPLY":
                data[math.field] *= math.value;
                break;
            case "DIVIDE":
                data[math.field] /= math.value;
                break;
            default:
                throw new Error(`Unknown math operation: ${math.operation}`);
        }
    }

    sortAndPaginate(nodes, sort, pagination) {
        nodes.sort((a, b) => {
            for (let criteria of sort) {
                const comparison = a.data[criteria.field] < b.data[criteria.field] ? -1 : 1;
                if (criteria.order === 'DESC') {
                    comparison *= -1;
                }
                if (comparison !== 0) {
                    return comparison;
                }
            }
            return 0;
        });

        return nodes.slice(pagination.offset, pagination.offset + pagination.limit);
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


    /**
     * @method getNodesOfType
     * @desc Retrieves all nodes of a certain type from the graph database.
     * @param {string} type - The type of node to retrieve.
     * @returns {Promise<Array>} An array of node objects.
     * @example
     * const nodes = await db.getNodesOfType("Talmid");
     */
    async getNodesOfType(type) {
        const nodeIds = this.indices.nodeType.get(type);
        if (!nodeIds) {
            return [];
        }
        return await Promise.all(nodeIds.map(id => this.get(id)));
    }


    /**
     * @method getRelationshipsOfType
     * @desc Retrieves all relationships of a certain type from the graph database.
     * @param {string} type - The type of relationship to retrieve.
     * @returns {Promise<Array>} An array of relationship objects.
     * @example
     * const relationships = await db.getRelationshipsOfType("STUDIES");
     */
    async getRelationshipsOfType(type) {
        const relationshipIds = this.indices.relationshipType.get(type);
        if (!relationshipIds) {
            return [];
        }
        return await Promise.all(relationshipIds.map(id => this.get(id)));
    }



    /**
     * @method getRelationshipsBetweenTypes
     * @desc Retrieves all relationships of a certain type between two types of nodes from the graph database.
     * @param {string} type1 - The type of the source node.
     * @param {string} type2 - The type of the destination node.
     * @param {string} relationshipType - The type of relationship to retrieve.
     * @returns {Promise<Array>} An array of relationship objects.
     * @example
     * const relationships = await db.getRelationshipsBetweenTypes("Talmid", "Sefer", "STUDIES");
     */
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

    matchesFilter(data, filter) {
        if (filter.AND) {
            return filter.AND.every(subFilter => this.matchesFilter(data, subFilter));
        }
        if (filter.OR) {
            return filter.OR.some(subFilter => this.matchesFilter(data, subFilter));
        }
        if (filter.NOT) {
            return !this.matchesFilter(data, filter.NOT);
        }
        for (let [key, value] of Object.entries(filter)) {
            if (value.EQ && data[key] !== value.EQ) {
                return false;
            }
            if (value.NEQ && data[key] === value.NEQ) {
                return false;
            }
            if (value.GT && data[key] <= value.GT) {
                return false;
            }
            if (value.GTE && data[key] < value.GTE) {
                return false;
            }
            if (value.LT && data[key] >= value.LT) {
                return false;
            }
            if (value.LTE && data[key] > value.LTE) {
                return false;
            }
            if (value.IN && !value.IN.includes(data[key])) {
                return false;
            }
            if (value.NIN && value.NIN.includes(data[key])) {
                return false;
            }
            if (value.CONTAINS && !data[key].includes(value.CONTAINS)) {
                return false;
            }
        }
        return true;
    }
}

