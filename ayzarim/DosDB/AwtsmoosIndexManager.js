/**
 * B"H
 */

const fs = require('fs').promises;
const path = require('path');

async function ensureDirectoriesExist(directory, indicesFolder) {
    await fs.mkdir(directory, { recursive: true });
    await fs.mkdir(indicesFolder, { recursive: true });
}

var CHUNK_SIZE;
class AwtsmoosIndexManager {
    constructor({
        directory = '../',
        oldIndexPattern = 'index.json',
        newIndexPattern = '_awtsmoos.index.json',
        indicesName = '_awtsmoos.indices',
        maxNodes = 1000,
    }) {
        this.directory = directory;
        this.indicesName = indicesName;
        this.indicesFolder = path.join(this.directory, indicesName);
        this.maxNodes = maxNodes;
		CHUNK_SIZE = maxNodes;
        this.oldIndexPattern = oldIndexPattern;
        this.newIndexPattern = newIndexPattern;
    }

    async init() {
        await ensureDirectoriesExist(this.directory, this.indicesFolder);
		await this.ensureAllFilesIndexed(this.directory)
    }

	
	
	

	/**
	 * @description if no indexing was done 
	 * before it goes through all files 
	 * currently in database and indexes only 
	 * the ones that need indexing by
	 * caling updateIndex
	 * @param {*} directoryPath 
	 */
    /**
	 * We strive to ensure all data's enshrined,
	 * In indices, not left behind.
	 * The raw data's form might make one giddy,
	 * But our goal's to make indexing nifty.
	 */
	async ensureAllFilesIndexed(directoryPath) {
		try {
			const allItems = await fs.readdir(directoryPath);
			for (const item of allItems) {
				// Skip if the item is the indices directory
				if (item === this.indicesName) {
					continue;
				}
	
				const itemPath = path.join(directoryPath, item);
				const stat = await fs.stat(itemPath);
				if (stat.isFile() && item.endsWith('.json')) {
					const postId = item.split('.json')[0];
					const numericPostId = isNaN(Number(postId)) ? this._hashStringToNumber(postId) : Number(postId);
					if (isNaN(numericPostId)) {
						console.error("Hashing went awry for postId:", postId);
						continue;
					}
					const chunkId = Math.floor(numericPostId / CHUNK_SIZE);
					const relativePathFromRoot = path.relative(this.directory, directoryPath);
					
					let sampleData;
					try {
						sampleData = JSON.parse(await fs.readFile(itemPath, 'utf8'));
					} catch (e) {
						console.warn("Reading failed for", item, e);
						continue;
					}
					const sampleProperty = Object.keys(sampleData)[0];
					const indexPath = path.join(this.indicesFolder, relativePathFromRoot, sampleProperty, `${chunkId}.json`);
					try {
						await fs.access(indexPath, fs.constants.F_OK);
					} catch (err) {
						try {
							await this.updateIndex(directoryPath, postId);
						} catch (e) {
							console.log("Problem with updateIndex", e);
						}
					}
				} else if (stat.isDirectory()) {
					await this.ensureAllFilesIndexed(itemPath);
				}
			}
		} catch (err) {
			console.error("Error surfaced:", err);
		}
	}
	

    _hashStringToNumber(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash);
    }
	
	

	/**
	 * TODO implement
	 */
	async updateIndex(directoryPath, postId) {
		const dataPath = path.join(directoryPath, `${postId}.json`);
		const data = JSON.parse(await fs.readFile(dataPath, 'utf8'));
		
		const relativePathFromRoot = path.relative(this.directory, directoryPath);
	
		for (let property in data) {
			const value = data[property];
			
			// Convert postId to a number
			const numericPostId = isNaN(Number(postId)) ? this._hashStringToNumber(postId) : Number(postId);
			const chunkId = Math.floor(numericPostId / CHUNK_SIZE);
	
			const indexPath = path.join(this.indicesFolder, relativePathFromRoot, property, `${chunkId}.json`);
			
			// Ensure directories exist before writing to the file
			await ensureDirectoriesExist(path.dirname(indexPath), path.dirname(indexPath));
	
			let indexData = {};
			try {
				await fs.access(indexPath, fs.constants.F_OK);
				indexData = JSON.parse(await fs.readFile(indexPath, 'utf8'));
			} catch (err) {}
	
			indexData[postId] = value;
			await fs.writeFile(indexPath, JSON.stringify(indexData), 'utf8');
	
			const metadataPath = path.join(this.indicesFolder, relativePathFromRoot, property, `metadata_${chunkId}.json`);
			
			// Ensure directories exist before writing to the metadata file
			await ensureDirectoriesExist(path.dirname(metadataPath), path.dirname(metadataPath));
	
			let metadata = {};
			try {
				await fs.access(metadataPath, fs.constants.F_OK);
				metadata = JSON.parse(await fs.readFile(metadataPath, 'utf8'));
			} catch (err) {}
	
			metadata.min = metadata.min ? (metadata.min.localeCompare(value) < 0 ? metadata.min : value) : value;
			metadata.max = metadata.max ? (metadata.max.localeCompare(value) > 0 ? metadata.max : value) : value;
	
			await fs.writeFile(metadataPath, JSON.stringify(metadata), 'utf8');
		}
	}
	
	
	
    async listFilesWithPagination(directoryPath, page = 1, pageSize = 10, sortBy = 'alphabetical', order = 'asc', search = {}) {
		const startIndex = (page - 1) * pageSize;
		const endIndex = startIndex + pageSize;
	
		const relativePathFromRoot = path.relative(this.directory, directoryPath);
	
		let allFolders = await fs.readdir(path.join(this.indicesFolder, relativePathFromRoot));
		console.log("All fo",allFolders)
		let allIndexedFiles = [];
		for (const folder of allFolders) {
			let propertyFolders = await fs.readdir(path.join(this.indicesFolder, relativePathFromRoot, folder));
			for (const propertyFolder of propertyFolders) {
				let chunkFiles = await fs.readdir(path.join(this.indicesFolder, relativePathFromRoot, folder, propertyFolder));

				console.log("egtting chunky",chunkFiles,propertyFolder)
				for (const chunkFile of chunkFiles) {
					console.log("doing  chank",chunkFile)
					if (chunkFile.endsWith('.json') && !chunkFile.startsWith('metadata_')) {
						const chunkData = JSON.parse(await fs.readFile(path.join(this.indicesFolder, relativePathFromRoot, folder, propertyFolder, chunkFile), 'utf8'));
						for (const postId in chunkData) {
							if (search[propertyFolder] && chunkData[postId] !== search[propertyFolder]) {
								continue;
							}
							allIndexedFiles.push({postId: postId, value: chunkData[postId]});
						}
					}
				}
			}
		}
	
		if (sortBy === 'alphabetical') {
			allIndexedFiles.sort((a, b) => a.postId.localeCompare(b.postId));
			if (order === 'desc') allIndexedFiles.reverse();
		}
	
		return allIndexedFiles.slice(startIndex, endIndex);
	}
	
	
	
}
	


// You can add a simple hash function to String's prototype
String.prototype.hashCode = function() {
	var hash = 0, i, chr;
	if (this.length === 0) return hash;
	for (i = 0; i < this.length; i++) {
	  chr = this.charCodeAt(i);
	  hash = ((hash << 5) - hash) + chr;
	  hash |= 0; // Convert to 32bit integer
	}
	return Math.abs(hash);
  };

  
  
  
  
  


module.exports = AwtsmoosIndexManager;