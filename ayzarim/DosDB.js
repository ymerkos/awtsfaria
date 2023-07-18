//B"H
const fs = require('fs').promises;
const path = require('path');
const util = require('util');
const readdir = util.promisify(fs.readdir);
const stat = util.promisify(fs.stat);

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
    async getFilePath(id) {
        // Check if the id already has a .json extension
        const hasJsonExtension = path.extname(id) === '.json';
        const fullPath = path.join(this.directory, id);
    
        // Try to get the status of the file/directory
        try {
            let statObj = await fs.stat(fullPath);
    
            // If it's a directory, return the path as is
            if (statObj.isDirectory()) {
                return fullPath;
            }
    
            // If it's a file and doesn't have .json extension, append it
            return hasJsonExtension ? fullPath : fullPath + '.json';
        } catch (error) {
            // If file/directory doesn't exist, assume it's a file (for creating new entries)
            return hasJsonExtension ? fullPath : path.join(this.directory, `${id}.json`);
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

        // if it's a file, parse it as JSON and return the data
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data);
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
    async ensureDir(filePath) {
        const dirPath = path.dirname(filePath);
        await fs.mkdir(dirPath, { recursive: true });
    }

/**
     * Write a record to a file.
     * @param {string} id - The identifier for the record.
     * @param {object} record - The data to be stored.
     * @returns {Promise<void>} - A Promise that resolves when the data has been written to the file.
     *
     * @example
     * await db.write('user1', { name: 'John Doe', age: 30 });
     */
async write(id, record) {
    const filePath = await this.getFilePath(id);
    await this.ensureDir(filePath);
    await fs.writeFile(filePath, JSON.stringify(record));
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
 * Delete a record.
 * @param {string} id - The identifier for the record.
 * @returns {Promise<void>} - A Promise that resolves when the record has been deleted.
 *
 * @example
 * await db.delete('user1');
 */
async delete(id) {
    const filePath = await this.getFilePath(id);
    await fs.unlink(filePath);
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