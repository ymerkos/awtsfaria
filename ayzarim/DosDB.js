//B"H
const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

class DosDB {
    constructor(filename) {
        this.filename = filename;
    }

    async load() {
        try {
            const data = await readFile(this.filename);
            return JSON.parse(data);
        } catch (error) {
            if (error.code === 'ENOENT') {
                return {};
            } else {
                throw error;
            }
        }
    }

    async save(data) {
        const jsonData = JSON.stringify(data, null, 2);
        await writeFile(this.filename, jsonData);
    }

    async get(id) {
        const data = await this.load();
        return data[id];
    }

    async create(id, record) {
        const data = await this.load();
        data[id] = record;
        await this.save(data);
    }

    async update(id, record) {
        const data = await this.load();
        if (!data[id]) throw new Error(`Record with id ${id} does not exist.`);
        data[id] = record;
        await this.save(data);
    }

    async delete(id) {
        const data = await this.load();
        if (!data[id]) throw new Error(`Record with id ${id} does not exist.`);
        delete data[id];
        await this.save(data);
    }
}
