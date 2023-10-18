/**
 * B"H
 * AwtsmoosIndexManager
 * 
 * This module provides a comprehensive solution
 *  for indexing JSON data stored in files.
 * The indexing is done in a way that allows 
 * efficient querying of the data based on different properties.
 * The module ensures that all data is indexed 
 * properly and allows pagination of the indexed results.
 * 
 * Dependencies:
 * - fs: Filesystem module (promises API)
 * - path: Utility for handling and transforming file paths
 */


const fs = require('fs').promises;
const path = require('path');

/**
 * Ensures that the necessary directories exist.
 * If they don't exist, it creates them.
 * 
 * @param {string} directory - The main directory path.
 * @param {string} indicesFolder - The folder where indices will be stored.
 */
async function ensureDirectoriesExist(directory, indicesFolder) {
    await fs.mkdir(directory, { recursive: true });
    await fs.mkdir(indicesFolder, { recursive: true });
}

var CHUNK_SIZE;
class AwtsmoosIndexManager {
	 /**
     * Constructor for the AwtsmoosIndexManager class.
     * 
     * @param {object} options - Configuration options for the index manager.
     */
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

	 /**
     * Initializes the index manager.
     * Ensures the necessary directories exist and that all files are indexed.
     */
    async init() {
        await ensureDirectoriesExist(this.directory, this.indicesFolder);
		await this.ensureAllFilesIndexed(this.directory)
    }

	
	
	

	/**
	 * Ensures all files in the specified 
	 * directory and its subdirectories are indexed.
	 * If a file hasn't been indexed, it will index it.
	 * 
	 * @param {string} directoryPath - The path to the directory to index.
	
    
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
	 * Updates the index for a specific file.
	 * 
	 * @param {string} directoryPath - The path to the directory containing the file.
	 * @param {string} postId - The identifier for the file to index.
	 */
	async updateIndex(directoryPath, postId) {
		const dataPath = path.join(directoryPath, `${postId}.json`);
		const data = JSON.parse(await fs.readFile(dataPath, 'utf8'));
	
		const relativePathFromRoot = path.relative(this.directory, directoryPath);
		const fileStat = await fs.stat(dataPath); // Fetch file metadata
	
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
			indexData['modifiedBy'] = fileStat.mtime.toISOString(); // Add last modified time
			indexData['createdBy'] = fileStat.birthtime.toISOString(); // Add creation time
	
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
	
	
	
	/**
     * Retrieves a paginated list of indexed files.
     * 
     * @param {string} directoryPath - The path to the directory to retrieve indexed files from.
     * @param {number} page - The page number to retrieve.
     * @param {number} pageSize - The number of indexed files to retrieve per page.
     * @param {string} sortBy - The property to sort the indexed files by.
     * @param {string} order - The order to sort the indexed files in (asc or desc).
     * @param {object} filters - Filters to apply when retrieving indexed files.
     * @param {string} sortProperty - The property within the indexed file to sort by.
     * 
     * @returns {array} - A paginated list of indexed files.
     */
    async listFilesWithPagination(
		directoryPath, 
		page = 1, 
		pageSize = 10, 
		sortBy = 'alphabetical', 
		order = 'asc', 
		filters = {},
		sortProperty = 'entryId'
	) {
		try {
			page = parseInt(page);
			pageSize = parseInt(pageSize)
		} catch(e) {

		}
		const startIndex = (page - 1) * pageSize;
		const endIndex = startIndex + pageSize;
	
		
		const relativePathFromRoot = path.relative(this.directory, directoryPath);
		let allFolders = await fs.readdir(path.join(this.indicesFolder, relativePathFromRoot));
		
		let allIndexedFiles = [];
	
		for (const folder of allFolders) {
			let propertyFolders = await fs.readdir(path.join(this.indicesFolder, relativePathFromRoot, folder));
			
			let aggregatedData = {
				entryId: folder,
				data: {}
			};
	
			for (const propertyFolder of propertyFolders) {
				// If the propertyFolder is not in the filters, skip processing this chunk
				if (Object.keys(filters).length > 0 && !filters.hasOwnProperty(propertyFolder)) {
					continue;
				}
	
				let chunkFiles = await fs.readdir(path.join(this.indicesFolder, relativePathFromRoot, folder, propertyFolder));
	
				for (const chunkFile of chunkFiles) {
					if (chunkFile.endsWith('.json') && !chunkFile.startsWith('metadata_')) {
						const chunkData = JSON.parse(await fs.readFile(path.join(this.indicesFolder, relativePathFromRoot, folder, propertyFolder, chunkFile), 'utf8'));
						for (const key in chunkData) {
							if (key === 'modifiedBy' || key === 'createdBy') {
								aggregatedData[key] = chunkData[key];
							} else {
								aggregatedData.data[propertyFolder] = chunkData[key];
								if(!aggregatedData.hasOwnProperty("jsonId"))
									aggregatedData.jsonId = key;
							}
						}
					}
				}
			}

	
			allIndexedFiles.push(aggregatedData);
		}
	
		if (sortBy === 'alphabetical') {
			allIndexedFiles.sort((a, b) => a[sortProperty].localeCompare(b[sortProperty]));
		} else if (sortBy === 'modifiedBy' || sortBy === 'createdBy') {
			allIndexedFiles.sort((a, b) => new Date(a[sortBy]).getTime() - new Date(b[sortBy]).getTime());
		}
	
		if (order === 'desc') {
			allIndexedFiles.reverse();
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