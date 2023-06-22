//B"H
const fs = require('fs');
const util = require('util');
const path = require('path');

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const mkdir = util.promisify(fs.mkdir);

class DosDB {
    constructor(directory) {
        this.directory = directory;
        this.init();
    }

    // Make sure directory exists
    async init() {
        try {
            await mkdir(this.directory, { recursive: true });
        } catch (error) {
            if (error.code !== 'EEXIST') throw error;
        }
    }

    // Get path for a record file
    getFilePath(id) {
        return path.join(this.directory, `${id}.json`);
    }

    async get(id) {
        try {
            const filePath = this.getFilePath(id);
            const data = await readFile(filePath);
            return JSON.parse(data);
        } catch(error) {
            return null;
        }
        
    }

    async create(id, record) {
        try {
            const filePath = this.getFilePath(id);
            const jsonData = JSON.stringify(record, null, 2);
            await writeFile(filePath, jsonData);
            return true;
        }
        
    }

    async update(id, record) {
        try {
            const filePath = this.getFilePath(id);
            const jsonData = JSON.stringify(record, null, 2);
            await writeFile(filePath, jsonData);
            return true;
        } catch(e) {

        }
        
    }

    async delete(id) {
        try {
            const filePath = this.getFilePath(id);
            await fs.unlink(filePath);
            return true;
        } catch(e) {

        }
        
    }
}

module.exports = DosDB;
