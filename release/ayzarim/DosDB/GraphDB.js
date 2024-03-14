/**
 * B"H
 * @file GraphDB.js
 * @desc A GraphDB implementation that extends DosDB. It represents a graph database with Nodes and Relationships.
 * Nodes can have properties and can be connected with Relationships. The GraphDB class provides methods for CRUD operations on Nodes and Relationships,
 * as well as performing complex operations described in a JSON structure.
 * 
 * /**
 * This JavaScript code snippet is an implementation of a graph database (GraphDB) that extends another database (DosDB).
 * The system is divided into several key components: Nodes, Relationships, and the GraphDB itself.
 *
 * 1. Dependencies:
 *    - DosDB: The code relies on another module named DosDB, but there's a typo 'requre' that needs to be corrected.
 *    - fs: It uses the file system (fs) promises API for handling asynchronous file operations.
 *    - path: The 'path' module is used for managing file and directory paths.
 *    - uuid: The 'uuid' module is used for generating unique identifiers for nodes and relationships.
 *
 * 2. Node Class:
 *    - Represents a node in the graph, each having a unique ID, data (properties), and relationships.
 *    - If a node data doesn't have a type or it's not a string, it assigns a default type "ETSEM".
 *
 * 3. Relationship Class:
 *    - Represents a relationship between two nodes in the graph.
 *    - Each relationship has source and destination IDs, a type, and additional properties (data).
 *    - It also checks and defaults the type value to "ETSEM" if it's not a string.
 *
 * 4. GraphDB Class:
 *    - This class extends DosDB and is the main class responsible for managing the graph database.
 *    - It has several key functionalities including:
 *      - CRUD operations on nodes and relationships.
 *      - Creating UUIDs: Unique identifiers are created for nodes and relationships.
 *      - Loading indices: Loading existing indices during initialization.
 *      - Handling relationships: Adding, updating, and deleting relationships in the database.
 *      - Matching Filters: Filters data based on provided criteria like EQ (equal), GT (greater than), etc.
 *      - Sorting and Paginating: Sorts and paginates nodes based on provided criteria and pagination settings.
 *      - Performing Mathematical Operations: Can perform mathematical operations like increment, decrement, etc., on data.
 *
 * 5. Detailed Operations:
 *    - performOperation: A method that performs CRUD operations based on JSON input. It’s a versatile method that handles creating, reading, updating, and deleting nodes.
 *    - createNode, updateNodes, deleteNodes: Specific methods for managing nodes.
 *    - addRelationship, updateRelationship, deleteRelationship, createRelationship: Specific methods for managing relationships.
 *    - getNodesOfType, getRelationshipsOfType, getRelationshipsBetweenTypes: Retrieval methods to fetch nodes and relationships based on types and criteria.
 * 
 * 6. Error Handling:
 *    - The code contains error handling mechanisms, especially in CRUD operations and mathematical operations.
 *
 * 7. Documentation:
 *    - The code is well-documented using multi-line comments that describe the functionality, parameters, and usage of classes and methods.
 *
 * Conclusion:
 * The GraphDB is a feature-rich, well-organized graph database implementation with robust functionalities, error handling, and documentation. It is designed to handle nodes and relationships effectively, providing a foundation for complex graph database operations.
 * 
 * 
 * 
 * 
 * 
 * /**
 * Creating a New Node:
 * 1. Instantiate the GraphDB by providing the directory where
 *    the database is located. Example: var db = new GraphDB('./db');
 *
 * 2. Use the `createNode` method to create a new node.
 *    This method requires the type of the node, the properties of the node,
 *    and optionally, the relationships of the node.
 *
 * 3. The `createNode` method will automatically generate a unique ID
 *    for the node, create the node object and store it in the database,
 *    and also update the necessary indices.
 *
 * Example of Creating a New Node:
 * db.createNode('Person', {name: 'John Doe', age: 30});
 *
 * Creating a New Relationship:
 * 1. After creating nodes, you can create relationships between them.
 *    Use the `createRelationship` method for this purpose.
 *
 * 2. The `createRelationship` method requires the source node ID,
 *    destination node ID, type of the relationship, and properties of the relationship.
 *
 * 3. This method will generate a unique ID for the relationship, create
 *    the relationship object, and store it in the database.
 *
 * Example of Creating a New Relationship:
 * db.createRelationship(sourceNodeId, destNodeId, 'FRIENDS', {since: '2022-01-01'});
 */




var DosDB = require("./index.js");

var AwtsmoosIndexManager = require ("./AwtsmoosIndexManager.js");
var fs = require("fs").promises;
var path = require("path");

/**
 * @class Node
 * @desc Represents a node in the graph.
 * @param {string} id - The unique identifier for the node.
 * @param {Object} data - The properties of the node.
 * @example
 * var node = new Node("1234", { name: "Mendel", age: 22 });
 */

class Node {
    constructor(id, data) {
        this.id = id;
        this.data = data;
        this.relationships = {};

        if(typeof(data.type) != "string") {
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
 * var relationship = new Relationship("1234", "5678", "STUDIES", { startDate: "2023-01-01" });
 */

class Relationship {
    constructor(srcId, destId, type, data) {
        this.srcId = srcId;
        this.destId = destId;
        this.type = type;
        this.data = data;

        if(typeof(type) != "string") {
            type = "ETSEM";
        } else {
           type = type.toUpperCase();
        }
    }
}



/**
 * @class GraphDB
 * @desc Extends DosDB to provide a graph database functionality.
 * @example
 * var db = new GraphDB("./db");
 */

class GraphDB extends DosDB {
    constructor(directory, cacheSize = 1000) {
        super(directory);
        this.cache = new Map();
        this.cacheSize = cacheSize;
         // Initialize AwtsmoosIndexManager for indexing operations.
         this.indexManager = new AwtsmoosIndexManager({ directory: this.directory });

        this.indices = {
            nodeType: new Map(),
            relationshipType: new Map()
        };
        
    }

    async init() {
        super.init();
        this.loadIndices().catch(console.error);
    }

    async createUUID() {
        let id = this.uuidv4();
        while (await this.exists(id)) {
            id = this.uuidv4();
        }
        return id;
    }

    
    /**
     * @method performOperation
     * @desc Performs a CRUD operation on the graph database based on the input JSON.
     * @param {Object} operation - The CRUD operation to perform, described in a JSON structure.
     * @returns {Object} The result of the operation.
     * @example
     * var operation = {
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
     * var result = db.performOperation(operation);
     */

    async performOperation(operation) {
        
        var {nodeType, filter, sort, pagination} = operation;
        var nodes = await this.readNodes(operation.nodeType, operation.filter);
        switch(operation.type) {
            case "create":
                return await this.createNode(operation.nodeType, operation.properties, operation.relationships);
            case "read":
                return await this.get(nodeType, {
                    recursive: false, // or true based on use case
                    pageSize: pagination.pageSize,
                    page: pagination.page,
                    order: sort.order,
                    sortBy: sort.sortBy
                });
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
     * var id = db.createNode({ name: "Mendel", age: 22 });
     */

    async createNode(nodeType, properties, relationships = []) {
        var id = await this.createUUID();
        var node = new Node(id, {type: nodeType, ...properties});
        await this.create(id, node);
        this.updateIndex('nodeType', nodeType, id);

        for (let relationship of relationships) {
            await this.createRelationship(id, relationship.nodeType, relationship.type, relationship.properties);
        }

        return id;
    }

    // Updated readNodes method to support relationships
    async readNodes(nodeType, filter) {
        var nodeIds = this.indices.nodeType.get(nodeType);
        if (!nodeIds) {
            return [];
        }
        var nodes = await Promise.all(nodeIds.map(id => this.get(id)));
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


    
    async addRelationship(srcId, destId, type, properties) {
        var relationship = new Relationship(srcId, destId, type, properties);
        await this.indices.relationshipType.set(`${srcId}/${destId}/${type}`, relationship);
        return relationship;
    }
    

    async updateRelationship(id, properties) {
        let relationship = await this.get(id);
        if (relationship) {
            await this.indices.relationshipType.delete(`${relationship.srcId}/${relationship.destId}/${relationship.type}`);
            Object.assign(relationship.data, properties);
            await this.indices.relationshipType.set(`${relationship.srcId}/${relationship.destId}/${relationship.type}`, relationship);
        }
        return relationship;
    }

    async deleteRelationship(id) {
        let relationship = await this.get(id);
        if (relationship) {
            await this.indices.relationshipType.delete(`${relationship.srcId}/${relationship.destId}/${relationship.type}`);
            return true;
        }
        return false;
    }
    
    async createRelationship(srcId, destId, type, data) {
        var id = await this.createUUID();
        var relationship = new Relationship(srcId, destId, type, data);
        await this.create(id, relationship);
        this.updateIndex('relationshipType', type, id);
        return id;
    }

    async updateIndex(indexType, type, id) {
        let indexList = await this.indexManager.loadIndex(`index/${indexType}/${type}`);
        if (!indexList) {
            indexList = [];
        }
        indexList.push(id);

        // Using AwtsmoosIndexManager to update the index.
        await this.indexManager.updateIndex(`index/${indexType}/${type}`, id);
    }


    /**
     * @method getNodesOfType
     * @desc Retrieves all nodes of a certain type from the graph database.
     * @param {string} type - The type of node to retrieve.
     * @returns {Promise<Array>} An array of node objects.
     * @example
     * var nodes = await db.getNodesOfType("Talmid");
     */
    async getNodesOfType(type) {
        var nodeIds = this.indices.nodeType.get(type);
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
     * var relationships = await db.getRelationshipsOfType("STUDIES");
     */
    async getRelationshipsOfType(type) {
        var relationshipIds = this.indices.relationshipType.get(type);
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
     * var relationships = await db.getRelationshipsBetweenTypes("Talmid", "Sefer", "STUDIES");
     */
    async getRelationshipsBetweenTypes(type1, type2, relationshipType) {
        var relationshipIds = this.indices.relationshipType.get(relationshipType);
        if (!relationshipIds) {
            return [];
        }
        let relationships = await Promise.all(relationshipIds.map(id => this.get(id)));
        return relationships.filter(rel => rel.srcId.data.type === type1 && rel.destId.data.type === type2);
    }

    async loadIndices() {
        return
        var indexFiles = await fs.readdir(this.directory);
        var indexTypes = Object.keys(this.indices);
        for (let file of indexFiles) {
            var [indexType, type] = path.basename(file, '_awtsmoos.index.json').split('/');
            if (indexTypes.includes(indexType)) {

                // Using AwtsmoosIndexManager to load the index.
                this.indices[indexType].set(type, await this.indexManager.loadIndex(file));
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

    uuidv4() {
        var rand = (max) => Math.random() * max | 0;
        var hex = (num, len) => num.toString(16).padStart(len, '0');
        
        // Generate random values for each section of the UUID
        var part1 = hex(rand(0x100000000), 8); // 32 bits
        var part2 = hex(rand(0x10000), 4);     // 16 bits
        var part3 = 4 << 12 | rand(0x1000);    // 16 bits, the 13th character is '4'
        var part4 = 8 << 14 | rand(0x10000);   // 16 bits, the 17th character is one of '8', '9', 'a', or 'b'
        var part5 = hex(rand(0x1000000000000), 12); // 48 bits
        
        // Combine all parts into a UUID
        return `${part1}-${part2}-${hex(part3, 4)}-${hex(part4, 4)}-${part5}`;
    }
}



module.exports = GraphDB;