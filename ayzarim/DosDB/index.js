//B"H
const fs = require('fs').promises;
const path = require('path');
const util = require('util');
const readdir = util.promisify(fs.readdir);
const stat = util.promisify(fs.stat);
const gde=require("./getDirectoryEntries.js")
const awtsutils = require("../utils.js");
const AwtsmoosIndexManager = require ("./AwtsmoosIndexManager.js");

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
        
        this.indexManager = new AwtsmoosIndexManager({
            directory,
            db:this
        });

    }

    /**
     * Initialize the database by creating the root directory, if it does not already exist.
     * This method is called automatically when a new DosDB is created.
     * @returns {Promise<void>} - A Promise that resolves when the directory has been created (or if it already exists).
     */
    async init() {
        
        await fs.mkdir(this.directory, { recursive: true });
        
        try {
            
            
            await this.indexManager.init(this,777);
        } catch(e) {
            console.log(e,"Index issue")
        }
        
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
    if(typeof(id) != "string") 
        return id;
    id = awtsutils.sanitizePath(id);
    
    var mainDir = this.directory;

    // Remove mainDir from id if it is present, otherwise leave id as is
    var cleanedPath = id
    .startsWith(mainDir) 
    ? path.relative
    (mainDir, id) : id;

    
    var fullPath = path.join(this.directory, cleanedPath);
    var fullPathWithJson = path.join(this.directory, `${cleanedPath}.json`);

    fullPath = fullPath.replaceAll("\\","/")
    fullPathWithJson = fullPathWithJson.replaceAll("\\","/")
    // Check if id already contains an extension
    if (path.extname(id) || isDir) {
        // If it does, use the id as is
        return fullPath;
    }

    // Try to get the status of the file/directory
    try {
        await fs.stat(fullPath);

        
        // If it's a directory or file, return the path as is
        return fullPath;
    } catch (error) {
        // In case of error, try to get the stats assuming it's a file with .json extension
        try {
            await fs.stat(fullPathWithJson);

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

    async get(id, options = {
        recursive: false,
        pageSize: 10,
        page: 1,
        order: 'asc',
        sortBy: 'createdBy',
        showJson: true,
        propertyMap: ["entityid"],
        filters: {
            propertyToSearchIn: "content",
            searchTerms: ["hello", "there"]
        },
        mapToOne: true,
        full:false//to dispay full object info 
            //like metadata etc.
    }) {
        
        if(!options || typeof(options) != "object") {
            options = {};
        }
        var full = options.full || false;
        var filters = options.filters || {}
        var propertyMap = options.propertyMap || 
            ["entityId"];
        var mapToOne = options.mapToOne || true;
        const recursive = options.recursive ?? false;
        const showJson = options.showJson ?? false;

	var pageSize=options.pageSize||10
	var page=options.page||1
	var sortBy=options.sortBy||"createdBy";
	var orddr=options.order||"asc"
    
        let filePath = await this.getFilePath(id);
        var removeJSON = true;
        try {
            
            const statObj = await fs.stat(filePath);
            var created = statObj.atime;
            var modified = statObj.birthtime;

            // if it's a directory, return a list of files in it
            if (statObj.isDirectory()) {
                var checkIfItsSingleEntry = null
                try {
                    checkIfItsSingleEntry = 
                    await this.getDynamicRecord({
                        filePath,
                        properties:propertyMap,
                        stat:statObj,
                        full
                    });
                } catch(e) {
                    console.log("Prob",e)
                }
				
				

                if(checkIfItsSingleEntry) {
                    var res = full ? 
                        checkIfItsSingleEntry
                        : checkIfItsSingleEntry.data
                    return res
                }

                var fileIndexes
                try {
                    fileIndexes = await this.indexManager
			.listFilesWithPagination(
                    
                        filePath,
                        page,
                        pageSize,
                        sortBy,
                        order,
                        filters
                    );
                } catch(e) {
                    console.log("probme lsiting",e)
                }
                
                if (recursive) {
                    let allContents = {};
                    for (const fileName in fileIndexes.files) {
                        const res = await this.get(
                            path.join(id, fileName), options);
                        if (res !== null) {
							if(removeJSON) {
								removeJSONExtension(fileName)
							}
                            allContents[fileName] = res;
                        }
                    }
    
                    for (const dirName in fileIndexes.subdirectories) {
                        const res = await this.get(
                            path.join(id, dirName), options);
                        if (res !== null) {
							if(removeJSON) {
								removeJSONExtension(dirName)
							}
                            allContents[dirName] = res;
                        }
                    }
    
                    return allContents;
                } else {

                    

                    
                    var info = (fileIndexes||[]).map(
                        this.mapResults
                    ).map((fileName) => {
						if(removeJSON) {
							return removeJSONExtension(fileName)
						}
						return fileName;
					})
                      
					  
                    
                    return info;
                }
            }


            function removeJSONExtension(filePath) {
				var extention = path.extname(filePath);
				
				if(extention == ".json") {
					var ind = filePath.indexOf(".json")
					filePath = filePath.substring(0,ind)
				}
				return filePath;
			}
    
            // Handling the file case (non-directory)
            const ext = path.extname(filePath);

            
            if (ext === '.json') {
                const data = await fs.readFile(filePath, 'utf-8');
                var res = JSON.parse(data);
                if(full) {
                    res = {
                        entityId: id,
                        data: res,
                        created,
                        modified
                    }
                }
                return res;
            } else {
                const content = await fs.readFile(filePath);
                return content.toString(); // Assuming you want to convert binary data to string
            }
        } catch (error) {
            if (error.code !== 'ENOENT') 
                console.error(error);
            else {
                //console.error("Not found",filePath)
            }
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

    // Determine the directory path
    const directoryPath = path.dirname(filePath);

    var base = path.basename(directoryPath)
    var dir = path.dirname(directoryPath)
 

    
    if (record instanceof Buffer) {
        // if the record is a Buffer, write it as binary data
        await fs.writeFile(filePath, record);
        
    } else  if(typeof(record) == "object" && isJSON) {
        // if the record is not a Buffer, stringify it as JSON

        
        //await fs.writeFile(filePath, JSON.stringify(record));
        await this.writeRecordDynamic(filePath, record)
        try {
            await this.indexManager.updateIndex(
                directoryPath, 
                base,
                record//data
            );
        } catch(e) {
            console.log("Prolem with indexing",e)
         }
    } else  if(typeof(record) == "string") {
        
        await fs.writeFile(filePath, record+"", "utf8");
        
    }

     
}

/**
 * @description goes through each
 * key and writes it as a 
 * folder with the value as a value
 * file in it 
 * with different file extension
 * based on type string, number, bin etc.)
 * 
 * for nseted object repeats
 * 
 * also makes metadta file for retrieval
 * @param {string full path} rPath 
 * @param {JavaScript object} r 
 */
async writeRecordDynamic(rPath, r) {
	
    if(typeof(rPath) != "string") 
        return false;
    if(typeof(r) != "object" || !r) {
        return false
    }

    var keys = Object.keys(r)
    var entries = {}
    for(
        const k of keys
    ) {
        var pth = path.join(rPath,k)
        await this.ensureDir(pth, true);
        var isObj = false;
        var ext = ".awts"//for string values
        var dataToWrite = r[k];
        switch(typeof(keys[k])) {
            case "number":
                ext = ".awtsNum"
            break;
            case "object": 
                isObj = true;
            break;    
        }
        if(isObj) {
			var newPath = path.join(pth, keys[k])
            return this.writeRecordDynamic(
                newPath, keys[k]
            );
        }
        var val = "val"+ext;
        var joined = path.join(pth, val)
        
		var isStr = typeof(dataToWrite) == "string";
		if(!isStr) {
			dataToWrite+="";
		}
		
		console.log("Writing proeprty",pth,k,val,dataToWrite)
        await fs.writeFile(
            joined, dataToWrite
        );
        entries[k] = val;
    }

    var metaPath = path.join(
        rPath,
        "_awtsmoos.meta.entry.json"
    )
	
	var metaAlready = null;
	try {
		metaAlready = await fs.readFile(metaPath);
		metaAlready = JSON.parse(metaAlready);
	} catch(e) {
	
	}
	var dataToWrite = {
		entries,
		type: "record",
		lastModified: Date.now()
	}
	
	if(metaAlready) {
		dataToWrite.entries = {
			
			...metaAlready.entries,
			...dataToWrite.entries,
		}
	}
	
	
	
    await fs.writeFile(
        metaPath, 
        JSON.stringify(dataToWrite)
    );
}

/**
 * @description returns a JSON object
 * with mapped proeprties based
 * on input from @method writeRecordDynamic
 * @param {string} dynPath 
 * the dynamic full path to single "record".
 * this should be the directory that
 * has the _awtsmoos.meta.json file in it
 * @private record should be called with this.get
 * not directly
 */
async getDynamicRecord({
    filePath,
    properties=[],
    stat,
    full = false
}) {
	var dynPath = filePath;
    try {
        
        var bs = path.parse(dynPath).name;
        if(!stat.isDirectory()) {
            return null;
        }
    
        var modified = stat.mtime.toISOString()
        var made = stat.birthtime.toISOString()

        var metadata = await this.IsDirectoryDynamic(
            dynPath,
            stat
        )
        if(!metadata) return null;

        
        if(
            !Array.isArray(properties)
        ) {
            properties = [];
        }

        

        
        var ents = Array.from(properties);
        
        var propertyFiles = Object.entries(
            metadata.entries
        )

        var compiledData = {};
        for(
            const ent of propertyFiles
        ) {
            
           /* if(ents.length > 0) {
                if(
                    !ents.includes(ent[0])
                    && ents!="entity"
                ) {
                    continue;
                }
            }*/

            var propPath = path.join(
                dynPath,
                ent[0],
                ent[1]
            );
            
            compiledData[ent[0]] = await fs.readFile(
                propPath, "utf-8"
            );
            
        }


        var res = {
            entityId:bs,
            data: compiledData,
            modified,
            created: made
        };
        
     
        return res
    } catch(e) {
        console.log("Prob with index",e)
    }
    return null
}

/**
 * 
 * @param {string} filePath 
 * path to the directory to check
 * 
 * assuming u already called
 * fs.stat on the directory 
 * path to determine if 
 * its a directory.
 * @returns metadata
 * JAvaScript object
 * containg 
 * the properties 
 * of the "json" 
 * and relative paths
 * to find the values
 * along with indicator 
 * of the type
 * of json
 */
async IsDirectoryDynamic(
    filePath
) {
    
    
    var metaPath = path.join(
        filePath, 
        "_awtsmoos.meta.entry.json"
    );
    
    var hasM = null;

    try {
        
        hasM = await fs.readFile(
            metaPath
        );
    } catch(e) {
        
    }
    
    if(!hasM) return null;

    var js = null;
    try {
        js = JSON.parse(hasM)
    } catch(e) {
        return null;
    }

    if(
        !js.entries ||
        typeof(js.entries)
        != "object"
    ) {
        return null;
    }

    return js;
}

mapResults(w,propertyMap, mapToOne=true) {
    var p = propertyMap;
    if(!Array.isArray(propertyMap))
        return w;

    if(
        !p.length ||
        propertyMap.includes("entityId")
    ) return w;
    
    var ent = Object.entries(w)
    
    
    var fe = Object.fromEntries(
        ent.filter(q=> {
            return propertyMap.includes(q[0])
        })
    )

    
    if(mapToOne) {
        fe = Object.values(fe)[0]
    }
    return fe
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
async getDeleteFilePath(id,isRegularDir) {
	
	console.log("OK",isRegularDir,id)
    const completePath = await this.getFilePath(id, isRegularDir);

	return completePath;
    var stat;
    try {
        stat = await fs.stat(completePath);
    } catch(e){}
	var isDir = stat.isDirectory();
	var isFileOrDynamicDir = false;
    if(stat && isDir) {
        // If it's a directory, don't append .json
		console.log("Still trying")
		var checkIfItsSingleEntry = 
		await this.getDynamicRecord({
			completePath,
			stat
		});
		console.log("Is it?",checkIfItsSingleEntry)
        return completePath;
    } else {
		isFileOrDynamicDir = true;
	}
	
	if(isFileOrDynamicDir) {
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
 async delete(id, isRegularDir=false) {
    const filePath = await this.getDeleteFilePath(id,isRegularDir);
    console.log("Hi there",id,filePath);
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
        return false;
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
