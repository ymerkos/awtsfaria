/**
 * B"H
 */

const fs = require('fs').promises;
const path = require('path');

async function ensureDirectoriesExist(directory, indicesFolder) {
    await fs.mkdir(directory, { recursive: true });
    await fs.mkdir(indicesFolder, { recursive: true });
}

class AwtsmoosIndexManager {
    constructor({
        directory = '../',
        oldIndexPattern = 'index.json',
        newIndexPattern = '_awtsmoos.index.json',
        indicesName = '_awtsmoos.indices',
        maxNodes = 100,
    }) {
        this.directory = directory;
        this.indicesName = indicesName;
        this.indicesFolder = path.join(this.directory, indicesName);
        this.maxNodes = maxNodes;
        this.oldIndexPattern = oldIndexPattern;
        this.newIndexPattern = newIndexPattern;
    }

    async init() {
        await ensureDirectoriesExist(this.directory, this.indicesFolder);
		await this.ensureAllFilesIndexed(this.directory)
    }

	
	
	  async loadShard(shardName) {
        const shardPath = path.join(this.indicesFolder, shardName);
        try {
            const data = await fs.readFile(shardPath, 'utf8');
            return JSON.parse(data);
        } catch (err) {
            if (err.code === 'ENOENT') {
                return [];
            }
            throw err;
        }
    }

    async saveShard(shardName, data) {
        const shardPath = path.join(this.indicesFolder, shardName);
        await fs.writeFile(shardPath, JSON.stringify(data, null, 2), 'utf8');
    }

    async ensureAllFilesIndexed(directoryPath, parentShardName = null) {
        const files = await fs.readdir(directoryPath, { withFileTypes: true });
        const newEntries = [];
  
        // Determine shard name for the current directory
        const relativePathToBase = path.relative(this.directory, directoryPath);
        const shardName = this.getShardName(relativePathToBase, parentShardName);
		console.log("Made name",shardName,"For",relativePathToBase)
        let existingEntries = await this.loadShard(shardName);
		// If shard has reached maxNodes, create a new shard
        if(existingEntries.length + newEntries.length > this.maxNodes) {
            await this.saveShard(shardName, existingEntries); // Save what's already there.
            await this.ensureAllFilesIndexed
			(directoryPath, parentShardName, overflowCounter + 1); // Recursive call with incremented overflowCounter
            return;
        }
		
		for (const file of files) {
			const fullPath = path.join(directoryPath, file.name);
			if (fullPath === this.indicesFolder) continue;

			const stats = await fs.stat(fullPath);
			const relativePath = path.relative(this.directory, fullPath); 

			newEntries.push({
				name: file.name,
				path: relativePath,
				isDirectory: file.isDirectory(),
				mtime: stats.mtime.getTime(),
				ctime: stats.ctime.getTime(),
			});

			if (file.isDirectory()) {
				await this.ensureAllFilesIndexed(fullPath, shardName);
			}
		}
		// Combine and save entries back to shard
        const combinedEntries = [...existingEntries, ...newEntries];
        const uniqueEntries = Array.from(new Set(combinedEntries.map(JSON.stringify))).map(JSON.parse);
        await this.saveShard(shardName, uniqueEntries);
	}

	getShardName(
		relativePath, 
		parentShardName = null, 
		overflowCounter
	) {
		const normalizedPath = relativePath.replace(/\\/g, '/');
		const hash = normalizedPath.hashCode();
		return (parentShardName ? 
			`${parentShardName}_${hash % this.maxNodes}` :
			`${hash % this.maxNodes}${
				overflowCounter > 0 ? 
				`_overflow${overflowCounter}` : ""
			}`)
			
			.replaceAll(".json", "")
			+".json";
	}

    async listFilesWithPagination(
		directoryPath,
		page = 1,
		pageSize = 10,
		sortBy = 'alphabetical',
		order = 'asc',
		overflowCounter = 0
	) {
		
		try {
			page = parseInt(page);
			pageSize = parseInt(pageSize);
		} catch (e) {}
		// Variable to store paginated files and folders
		let paginatedFiles = [];
		let paginatedFolders = [];
	
		// Calculate offset based on page and pageSize
		const offset = (page - 1) * pageSize;
		
	
		// Find relative directory path to the base directory
		const relativeDirPath = path.relative(this.directory, directoryPath);
	
		// Split the relative path into parts
		const pathParts = relativeDirPath.split(path.sep);
	
		// Generate the parent shard name recursively
		let parentShardName = "0";
		for (let i = 0; i < pathParts.length; i++) {
			const currentPath = pathParts.slice(0, i + 1).join(path.sep);
			const currentShardName = this.getShardName(currentPath, parentShardName, overflowCounter);
			parentShardName = currentShardName;
		}
	
		var lastName = pathParts[pathParts.length - 1];
		// Determine shard name
		const shardName = parentShardName;
		
	
		// Try loading the shard file
		let shardData = [];
		try {
			shardData = await this.loadShard(shardName);
		} catch (err) {
			if (err.code !== 'ENOENT' || err.code != "EISDIR") {
				throw err; // Propagate other errors
			}
		}
		
		
		

	
		// Implement sorting based on 'order' and 'sortBy' parameters
		if (sortBy === 'alphabetical') {
			shardData.sort((a, b) => (order === 'asc' ? a
			.name.localeCompare(b.name) : b.name.localeCompare(a.name)));
			
		} else {
			if (order === 'asc') {
				shardData.sort((a, b) => (a[sortBy] > b[sortBy] ? 1 : -1));
			} else if (order === 'desc') {
				shardData.sort((a, b) => (a[sortBy] < b[sortBy] ? 1 : -1));
			}
		}
	
		// Calculate the start and end indices for the current page
		const startIndex = (page - 1) * pageSize;
		const endIndex = startIndex + pageSize;
		
		// Ensure endIndex doesn't exceed the length of shardData
		const slicedData = shardData.slice
		(startIndex, Math.min(endIndex, shardData.length));
	
		for (var entry of slicedData) {
			delete entry.path;
	
			if (entry.isDirectory) {
				paginatedFolders.push(entry);
			} else {
				paginatedFiles.push(entry);
			}
			delete entry.isDirectory;
		}
	
		// Check if there are no more items to load from the shard
		if (offset + pageSize >= shardData.length || shardData.length <= 0) {
			return {
				files: paginatedFiles,
				subdirectories: paginatedFolders,
			};
		}
	
		// If there are more items, check the overflow shard
		const remainingItems = Math.max(0, pageSize - paginatedFiles.length - paginatedFolders.length);

	
		// Break the recursion if there are no remaining items to load
		if (remainingItems <= 0 || slicedData.length < pageSize) {
			return {
				files: paginatedFiles,
				subdirectories: paginatedFolders,
			};
		}
		const nextPageData = await this.listFilesWithPagination(
			directoryPath,
			page + 1, // Increment page
			pageSize,
			sortBy,
			order,
			overflowCounter + 1
		);
		paginatedFiles.push(...nextPageData.files);
		paginatedFolders.push(...nextPageData.subdirectories);
	
		return {
			files: paginatedFiles,
			subdirectories: paginatedFolders,
		};
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