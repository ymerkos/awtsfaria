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


var fs = require('fs').promises;
var path = require('path');

/**
 * Ensures that the necessary directories exist.
 * If they don't exist, it creates them.
 * 
 * @param {string} arguments 
 * infintie number of arguments / paths
 * ensures they exist
 */
async function ensureDirectoriesExist() {

	for(var a of arguments) {
		if(typeof(a) == "string")
		await fs.mkdir(a, { recursive: true });
	}
    	

}

function hashStringToNumber(str) {
	// Replace with your hashing function
	return Math.abs(str.split("").reduce((acc, char) => {
	  acc = ((acc << 5) - acc) + char.charCodeAt(0);
	  return acc & acc;
	}, 0));
  }
var CHUNK_SIZE;
class AwtsmoosIndexManager {
	 /**
     * constructor for the AwtsmoosIndexManager class.
     * 
     * @param {object} options - Configuration options for the index manager.
     */
    constructor({
        directory = '../',
		db,
        oldIndexPattern = 'index.json',
        newIndexPattern = '_awtsmoos.index.json',
        indicesName = '_awtsmoos.indices',
		milestonesName = indicesName+'.milestones',
        maxNodes = 1000,
    }) {
        this.directory = directory;
        this.indicesName = indicesName;
        this.indicesFolder = path.join(this.directory, indicesName);

		this.milestonesName = milestonesName;
		this.milestonesFolder = path.join(
			this.directory,
			milestonesName
		)

        this.maxNodes = maxNodes;
		CHUNK_SIZE = maxNodes;
        this.oldIndexPattern = oldIndexPattern;
        this.newIndexPattern = newIndexPattern;

		this.db = db;

		this.buffer = {};
    	this.levels = {};
    }

	 /**
     * Initializes the index manager.
     * Ensures the necessary directories exist and that all files are indexed.
     */
    async init(db,h) {
		
		this.db = db;
		
        await ensureDirectoriesExist(
			this.directory, 
			this.indicesFolder,
			this.milestonesFolder
		);
		await this.ensureAllIsIndexed(this.directory)
    }

	
	
	

	/**
	 * Ensures all sub directories in the specified 
	 * directory and its subdirectories are indexed.
	 * If a file hasn't been indexed, it will index it.
	 * 
	 * @param {string} directoryPath - The path to the directory to index.
	
    
	 * We strive to ensure all data's enshrined,
	 * In indices, not left behind.
	 * The raw data's form might make one giddy,
	 * But our goal's to make indexing nifty.
	 */
	async ensureAllIsIndexed(directoryPath) {
		try {
			var dirents = await fs.readdir(directoryPath, { withFileTypes: true });
	
			for (var dirent of dirents) {
				if(
					dirent
					.name
					.startsWith(this.milestonesName) ||
					dirent
					.name.startsWith(this.indicesName)
				) return;

				var fullPath = path.join(directoryPath, dirent.name);

				if (dirent.isDirectory()) {
					var isDynamicDir = await this.db.IsDirectoryDynamic(fullPath);
					if (isDynamicDir) {
						// Handle dynamic directories which act as 'files'
						var postId = dirent.name; // Assuming postId is the folder name, adjust as needed
						await this.updateIndex(directoryPath, postId);
					} else {
						// Recursively index its contents if it's a normal directory
						await this.ensureAllIsIndexed(fullPath);
					}
				} else if (dirent.isFile()) {
					// Update index for regular files
					var postId = path.basename(dirent.name);
					await this.updateIndex(directoryPath, postId);
				}
			}
		} catch (e) {
			console.error(`Problem with indexing directory: ${directoryPath}`, e);
		}
	}
	

    _hashStringToNumber(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            var char = str.charCodeAt(i);
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
	async updateIndex(directory, postId, dayuh = null) {
		return
		if (!this.db) {
		  console.log("No db!");
		  return;
		}
	  
		var relativePath = path.relative(
			
			this.directory ,
			directory
		)
		console.log(relativePath)
		var dataPath = path.join(directory, `${postId}`);
		var dataObj = dayuh || await this.db.get(dataPath, { full: true });
	  
		if (!dataObj) {
			console.log("no data")
		  return null;
		}
	  
		var numericPostId = isNaN(Number(postId)) ? hashStringToNumber(postId) : Number(postId);
		var chunkId = Math.floor(numericPostId / CHUNK_SIZE);
	  

		var indexPath = path.join(this.indicesFolder, relativePath, `index_chunk_${chunkId}.json`);
		var indexDir = path.dirname(indexPath)
		// Create directory if it doesn't exist
		await fs.mkdir(path.join(this.indicesFolder, relativePath), { recursive: true });
		let indexData = {};
		try {
		  await fs.access(indexPath, fs.constants.F_OK);
		  indexData = JSON.parse(await fs.readFile(indexPath, 'utf8'));
		} catch (err) {
		  console.log("Index file not found", err);
		}
	  
		indexData[postId] = {
		  data: dataObj.data,
		  modifiedBy: dataObj.modifiedBy,
		  created: dataObj.created
		};
	  
		await updateMilestone(indexDir, chunkId, postId);
		await fs.writeFile(indexPath, JSON.stringify(indexData), 'utf8');
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
	 * in format: 
	 * 
	 * [
		* {
		* 	entryId: the id of the field,
		(for example the name of the .json or 
			base record id we are getting)
			data: {
				the properties this json / record has
			},
			modifiedBy: date
			created: date
		* }
	 * ]
     */
		async  listFilesWithPagination(
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
			  pageSize = parseInt(pageSize);
			} catch (e) {
			  console.error("Failed to parse page or pageSize");
			  return [];
			}
			var fls =  fs.readdir(directoryPath)
			return fls
			var startIndex = (page - 1) * pageSize;
			var endIndex = startIndex + pageSize;
		  
			  for (let [entryId, entry] of Object.entries(indexData)) {
				if (currentCount >= startIndex && currentCount < endIndex) {
				  // Apply filters if needed
				  if (Object.keys(filters)
				  .every(key => entry.data[key] === filters[key])) {
					results.push({
					  entryId,
					  data: entry.data,
					  modifiedBy: entry.modifiedBy,
					  created: entry.created
					});
				  }
				}
		  }
		  
	
	
		}
	
	
	
}


async function updateMilestone(indexPath, chunkId, postId) {
	var milestonePath = path.join(indexPath, `milestone.json`);
	let milestoneData = {};
	
	try {
	  await fs.access(milestonePath, fs.constants.F_OK);
	  milestoneData = JSON.parse(await fs.readFile(milestonePath, 'utf8'));
	} catch (err) {
	  console.log("Milestone file not found", err);
	}
  
	if (!milestoneData[chunkId]) {
	  milestoneData[chunkId] = {
		start: postId,
		end: postId,
	  };
	} else {
	  if (postId < milestoneData[chunkId].start) {
		milestoneData[chunkId].start = postId;
	  }
	  if (postId > milestoneData[chunkId].end) {
		milestoneData[chunkId].end = postId;
	  }
	}
  
	await fs.writeFile(milestonePath, JSON.stringify(milestoneData), 'utf8');
  }
	
function shouldMoveToHigherLevel(currentLevel, postId, milestoneData) {
	var currentDate = new Date();
	var dataAgeThreshold = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
	var accessCountThreshold = 10; // Threshold for the number of times accessed
  
	// Get the milestone data for the current postId
	var currentMilestone = milestoneData[postId];
  
	if (currentMilestone) {
	  // Calculate data age
	  var createdDate = new Date(currentMilestone.createdBy);
	  var dataAge = currentDate - createdDate;
  
	  // Check the access count (this assumes you have such a field in your milestone data)
	  var accessCount = currentMilestone.accessCount || 0;
  
	  // Decide if the data should be moved to a higher level based on your criteria
	  if (dataAge > dataAgeThreshold || accessCount > accessCountThreshold) {
		return true;
	  }
	}
  
	return false;
  }

  
  async function findStartIndex(directory, targetIndex) {
	let low = 0, high = 1000; // Replace 1000 with the actual highest index number
	while (low <= high) {
	  var mid = Math.floor((low + high) / 2);
	  var indexPath = path.join(directory, `index_${mid}.json`);
	  try {
		var data = JSON.parse(await fs.readFile(indexPath, 'utf8'));
		var indices = Object.keys(data).map(Number).sort((a, b) => a - b);
		if (indices[0] <= targetIndex && indices[indices.length - 1] >= targetIndex) {
		  return mid;
		} else if (indices[0] > targetIndex) {
		  high = mid - 1;
		} else {
		  low = mid + 1;
		}
	  } catch (err) {
		high = mid - 1; // If file doesn't exist, adjust the range
	  }
	}
	return -1; // Replace with appropriate error handling
  }
  
  
  function getIndexFileByNumber(indexNumber) {
	return `index_${indexNumber}.json`;
  }


// Utility functions to read and write JSON files
async function readJsonFile(filePath) {
	try {
	  return JSON.parse(await fs.readFile(filePath, 'utf8'));
	} catch (e) {
	  return null;
	}
  }
  
  async function writeJsonFile(filePath, data) {
	await fs.writeFile(filePath, JSON.stringify(data), 'utf8');
  }

module.exports = AwtsmoosIndexManager;