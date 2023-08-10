//B"H
const fs = require('fs').promises;
const path = require('path');
const util = require('util');
const readdir = util.promisify(fs.readdir);
const stat = util.promisify(fs.stat);


const {binaryMimeTypes, mimeTypes} = require("./mimes.js");

/**
 * The DosDB class represents a simple filesystem-based key-value store where each
 * record is stored as a separate JSON file in the provided directory.
 * @class
 *
 * @example
 * // Creates a new DosDB instance with the database directory at './db'
 * const db = new DosDB('./db');
 *
 * // Creates a new record with the id 'user1' and data { name: 'John Doe', age: 30 }
 * await db.create('user1', { name: 'John Doe', age: 30 });
 *
 * // Retrieves the record with the id 'user1'
 * const record = await db.get('user1');
 *
 * // Updates the record with the id 'user1' and sets the 'age' field to 31
 * await db.update('user1', 'age', 31);
 *
 * // Deletes the record with the id 'user1'
 * await db.delete('user1');
 */
class DosDB {
    /**
     * Create a DosDB.
     * @param {string} directory - The directory where the database will store its files.
     *
     * @example
     * const db = new DosDB('./db');
     */
    constructor(directory) {
        this.directory = directory || "../";
        this.init();
    }

    /**
     * Initialize the database by creating the root directory, if it does not already exist.
     * This method is called automatically when a new DosDB is created.
     * @returns {Promise<void>} - A Promise that resolves when the directory has been created (or if it already exists).
     */
    async init() {
        await fs.mkdir(this.directory, { recursive: true });
    }
/**
 * Get the path for a record file.
 * @param {string} id - The identifier for the record.
 * @returns {string} - The full path to the file where the record will be stored.
 *
 * @example
 * const filePath = await db.getFilePath('user1');
 */
 async getFilePath(id, isDir=false) {
    const fullPath = path.join(this.directory, id);
    const fullPathWithJson = path.join(this.directory, `${id}.json`);

    // Check if id already contains an extension
    if (path.extname(id) || isDir) {
        // If it does, use the id as is
        return fullPath;
    }

    // Try to get the status of the file/directory
    try {
        let statObj = await fs.stat(fullPath);

        // If it's a directory or file, return the path as is
        return fullPath;
    } catch (error) {
        // In case of error, try to get the stats assuming it's a file with .json extension
        try {
            let statObjJson = await fs.stat(fullPathWithJson);

            // If it's a file with .json extension
            return fullPathWithJson;
        } catch (error) {
            // If both checks fail, assume it's a new file entry
            return fullPathWithJson;
        }
    }
}

    /**
 * Get a record by its identifier or list of files in a directory.
 * @param {string} id - The identifier for the record or directory.
 * @param {boolean} recursive - Whether to fetch all contents recursively.
 * @returns {Promise<object|Array<string>|null>} - A Promise that resolves to the record, a list of files, or null if the record or directory does not exist.
 *
 * @example
 * const record = await db.get('user1');
 * const files = await db.get('directory1', true);
 * 
 * 
 * const binaryData = await db.get('binaryFile');
 */
     async get(id, recursive = false) {
        let filePath = await this.getFilePath(id);
    
        try {
            const statObj = await fs.stat(filePath);
    
            // if it's a directory, return a list of files in it
            if (statObj.isDirectory()) {
                const files = await fs.readdir(filePath);
                if (recursive) {
                    let allContents = {};
                    for (let file of files) {
                        const res = await this.get(path.join(id, file), true);
                        if (res !== null) {
                            // Store the files in an array if the current item is a directory
                            if (!Array.isArray(allContents[file])) allContents[file] = [];
                            allContents[file].push(res);
                        }
                    }
                    return allContents;
                } else {
                    return files;
                }
            }
    
            var ext = path.extname(filePath)
            // if it's a file, check if it's a JSON file
            if (ext === '.json') {
                // if it's a JSON file, parse it as JSON and return the data
                const data = await fs.readFile(filePath, 'utf-8');
                return JSON.parse(data);
            } else {
                // if it's not a JSON file, return the data as a Buffer
                var content = await fs.readFile(filePath);
                if(!binaryMimeTypes.includes(ext)) {
                    return content+""
                }

                return content;
            }
        } catch (error) {
            if (error.code !== 'ENOENT') console.error(error);
            return null;
        }
    }
    
    
    /**
     * Ensure the directory for a file path exists.
     * @param {string} filePath - The path to the file.
     * @returns {Promise<void>} - A Promise that resolves when the directory has been created (or if it already exists).
     */
    async ensureDir(filePath, isDir=false) {
        
        const dirPath = !isDir ? path.dirname(filePath) : filePath;
        await fs.mkdir(dirPath, { recursive: true });
        
        return dirPath;
    }

/**
     * Write a record to a file.
     * @param {string} id - The identifier for the record.
     * @param {object|Buffer} record - The data to be stored.
     * @returns {Promise<void>} - A Promise that resolves when the data has been written to the file.
     *
     * @example
     * await db.write('user1', { name: 'John Doe', age: 30 });
     */
 async write(id, record) {
    var isDir = !record;
    const filePath = await this.getFilePath(id, isDir);
    await this.ensureDir(filePath, isDir);

    
    if(isDir) {
        return;
    }
    
    var isJSON = false
    // if it's a file, check if it's a JSON file
    if (path.extname(filePath) === '.json') {
        // if it's a JSON file, parse it as JSON and return the data
        isJSON = true;
    } 


    
    if (record instanceof Buffer) {
        // if the record is a Buffer, write it as binary data
        await fs.writeFile(filePath, record);
        return;
    }
    
    if(typeof(record) == "object" && isJSON) {
        // if the record is not a Buffer, stringify it as JSON
        await fs.writeFile(filePath, JSON.stringify(record));
        return;
    }

    if(typeof(record) == "string") {
        
        await fs.writeFile(filePath, record+"", "utf8");
        return;
    }
}

/**
 * Create a new record.
 * @param {string} id - The identifier for the new record.
 * @param {object} record - The data for the new record.
 * @returns {Promise<void>} - A Promise that resolves when the record has been created.
 *
 * @example
 * await db.create('user1', { name: 'John Doe', age: 30 });
 */
async create/*or update!*/(id, record) {
    /*const existing = await this.get(id);
    if (existing !== null) {
        throw new Error(`Record with id "${id}" already exists.`);
    }*/
    await this.write(id, record);
}

/**
 * Update a record.
 * @param {string} id - The identifier for the record.
 * @param {object} record - The updated data for the record.
 * @returns {Promise<void>} - A Promise that resolves when the record has been updated.
 *
 * @example
 * await db.update('user1', { age: 31 });
 */
async update(id, record) {
    const existing = await this.get(id);
    if (existing === null) {
        throw new Error(`Record with id "${id}" does not exist.`);
    }
    await this.write(id, { ...existing, ...record });
}

/**
 * Get the path for a file to be deleted.
 * @param {string} id - The identifier for the file.
 * @returns {string} - The full path to the file.
 *
 * @example
 * const filePath = await db.getDeleteFilePath('user1');
 */
async getDeleteFilePath(id) {
    const completePath = path.join(this.directory, id);
    var stat;
    try {
        stat = await fs.stat(completePath);
    } catch(e){}

    if(stat && stat.isDirectory()) {
        // If it's a directory, don't append .json

        return completePath;
    } else {
        var newPath = path.extname(id) === '.json' ? completePath : completePath + '.json';
        stat = await fs.stat(newPath);

        if(stat && stat.isFile()|| stat.isDirectory()) {
            return newPath;
        }
    }
}


/**
 * Delete a file or a directory.
 * @param {string} id - The identifier for the file or directory.
 * @returns {Promise<void>} - A Promise that resolves when the file or directory has been deleted.
 *
 * @example
 * await db.delete('user1');
 */
 async delete(id) {
    const filePath = await this.getDeleteFilePath(id);
    
    try {
        const stat = await fs.stat(filePath);

        // Remove the file or directory
        if (stat.isFile()) {
            await fs.unlink(filePath);
        } else if (stat.isDirectory()) {
            await fs.rm(filePath, { recursive: true });
        }
        return true;
    } catch (error) {
        if (error.code !== 'ENOENT') throw error;
        // If the file or directory does not exist, we do nothing
    }
}

/**
     * Get information about a file or directory.
     * @param {string} path - The path to the file or directory.
     * @param {string} order - The order of the results ('asc' or 'desc').
     * @returns {Promise<Array<string>>} - A Promise that resolves with the requested information.
     */
async info(path, order = 'asc') {
    const stats = await stat(path);

    if (stats.isDirectory()) {
        const files = await readdir(path);
        files.sort();

        if (order === 'desc') {
            files.reverse();
        }

        return files.slice(0, 10);
    } else if (stats.isFile()) {
        const parts = path.split('/');
        parts.pop(); // remove the file name

        if (order === 'desc') {
            parts.reverse();
        }

        return parts;
    }
}

/**
     * Recursive method to read all files from a directory and return an array of { path, data } objects.
     * @param {string} dir - The directory to read from.
     * @returns {Promise<Array<{ path: string, data: Buffer }>>}
     */
async readAllFiles(dir) {
    let results = [];
    const list = await fs.readdir(dir);

    for (let file of list) {
        file = path.resolve(dir, file);
        const stat = await fs.stat(file);

        if (stat && stat.isDirectory()) {
            results = results.concat(await this.readAllFiles(file));
        } else {
            results.push({
                path: file,
                data: await fs.readFile(file),
            });
        }
    }

    return results;
}

/**
 * Exports the database to a binary file.
 * @returns {Promise<void>}
 */
async exportDatabase() {
    const allFiles = await this.readAllFiles(this.directory);
    const fileData = Buffer.from(JSON.stringify(allFiles));
    await fs.writeFile(path.join(this.directory, 'db_export.bin'), fileData);
}

/**
 * Imports the database from a binary file.
 * @returns {Promise<void>}
 */
async importDatabase() {
    const fileData = await fs.readFile(path.join(this.directory, 'db_export.bin'));
    const allFiles = JSON.parse(fileData.toString());

    for (let file of allFiles) {
        await this.ensureDir(file.path);
        await fs.writeFile(file.path, file.data);
    }
}
}

module.exports = DosDB;