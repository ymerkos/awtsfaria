//B"H
var fsRegular = require("fs")
var fs = fsRegular.promises;

var path = require('path');
var util = require('util');
var readdir = util.promisify(fs.readdir);
var stat = fs.stat;
var gde = require("./getDirectoryEntries.js")
var awtsutils = require("../tools/utils.js");
var AwtsmoosIndexManager = require("./AwtsmoosIndexManager.js");
/**
 * The DosDB class represents a simple filesystem-based key-value store where each
 * record is stored as a separate JSON file in the provided directory.
 * @class
 *
 * @example
 * // Creates a new DosDB instance with the database directory at './db'
 * var db = new DosDB('./db');
 *
 * // Creates a new record with the id 'user1' and data { name: 'John Doe', age: 30 }
 * await db.create('user1', { name: 'John Doe', age: 30 });
 *
 * // Retrieves the record with the id 'user1'
 * var record = await db.get('user1');
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
	 * var db = new DosDB('./db');
	 */
	constructor(directory) {
		this.directory = directory || "../";
		this.indexManager = new AwtsmoosIndexManager({
			directory,
			db: this
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
			await this.indexManager.init(this, 777);
		} catch (e) {
			console.log(e, "Index issue")
		}
	}
	/**
	 * Get the path for a record file.
	 * @param {string} id - The identifier for the record.
	 * @returns {string} - The full path to the file where the record will be stored.
	 *
	 * @example
	 * var filePath = await db.getFilePath('user1');
	 */
	async getFilePath(id, isDir = false) {
		if(typeof(id) != "string")
			return id;
		id = awtsutils.sanitizePath(id);
		var mainDir = this.directory;
		// Remove mainDir from id if it is present, otherwise leave id as is
		var cleanedPath = id
			.startsWith(mainDir) ?
			path.relative(mainDir, id) : id;
		var fullPath = path.join(this.directory, cleanedPath);
		var fullPathWithJson = path.join(this.directory, `${cleanedPath}.json`);
		fullPath = fullPath.replaceAll("\\", "/")
		fullPathWithJson = fullPathWithJson.replaceAll("\\", "/")
		// Check if id already contains an extension
		if(path.extname(id) || isDir) {
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
				return fullPath;
			}
		}
	}
	async readFileWithOffset(filePath, offset, length) {
		try {
			//console.log("READING offset",offset,filePath)
			const fileHandle = await fs.open(filePath, 'r');
			const buf = Buffer.alloc(length);
			const { bytesRead, buffer } = await fileHandle.read(buf, 0, length, offset);
			await fileHandle.close();
			return buffer.subarray(0, Math.min(bytesRead, length)); // Return only the portion of the buffer that was read
		} catch (error) {
			console.error('Error reading file:', error);
			return "didn't read it: " + error
		}
	}
	async access(filePath) {
		var myPath = await this.getFilePath(filePath);
		try {
			return await fs.stat(myPath)
		} catch (e) {
			return null;
		}
	}
	/**
	 * Get a record by its identifier or list of files in a directory.
	 * @param {string} id - The identifier for the record or directory.
	 * @param {boolean} recursive - Whether to fetch all contents recursively.
	 * @returns {Promise<object|Array<string>|null>} - A Promise that resolves to the record, a list of files, or null if the record or directory does not exist.
	 *
	 * @example
	 * var record = await db.get('user1');
	 * var files = await db.get('directory1', true);
	 * 
	 * 
	 * var binaryData = await db.get('binaryFile');
	 */
	async get(id, options = {
		access: false,
		recursive: false,
		pageSize: 10,
		page: 1,
		derech: null,
		filterBy: null,
		order: 'asc',
		sortBy: 'createdBy',
		showJson: true,
		propertyMap: null,
		filters: {
			propertyToSearchIn: "content",
			searchTerms: ["hello", "there"]
		},
		mapToOne: true,
		maxOrech: null,
		max: false,
		meta: false //to dispay meta info
		//like metadata etc.
	}) {
		if(!options || typeof(options) != "object") {
			options = {};
		}
		var filterBy = options.filterBy || null;
		var access = options.access;
		var meta = options.meta;
		var maxOrech = options.maxOrech
		var derech = options.derech;
		var full = options.full || false;
		var filters = options.filters || {}
		var propertyMap = options.propertyMap
		var mapToOne = options.mapToOne || true;
		var recursive = options.recursive ?? false;
		var showJson = options.showJson ?? false;
		var pageSize = options.pageSize || 10;
		if(options.max === true) {
			pageSize = 500;
		}
		var page = options.page || 1
		var sortBy = options.sortBy || "createdBy";
		var order = options.order || "asc"
		let filePath = await this.getFilePath(id);
		var removeJSON = true;
		try {
			var statObj = await fs.stat(filePath);
			if(access) {
				return statObj
			}
			var created = statObj.atime;
			var modified = statObj.birthtime;
			if(meta) {
				return modified

			}
			// if it's a directory, return a list of files in it
			if(statObj.isDirectory()) {
				var checkIfItsSingleEntry = null
				try {
					//var
					var ob = {
						filePath,
						properties: propertyMap,
						derech,
						stat: statObj,
						maxOrech,
						filterBy,
						meta
					}
					checkIfItsSingleEntry =
						await this.getDynamicRecord(ob);
					console.log("GOT?", checkIfItsSingleEntry, filePath)
				} catch (e) {
					console.log("Prob", e)
				}
				if(checkIfItsSingleEntry || checkIfItsSingleEntry === undefined) {
					return checkIfItsSingleEntry;
				}
				var fileIndexes
				try {
					fileIndexes = await
					/*this.indexManager
			.listFilesWithPagination
			*/
					gde(
						filePath,
						page,
						pageSize,
						maxOrech,
						filterBy,
						sortBy,
						order,
						filters,
						id,
						this
					);
				} catch (e) {
					console.log("probme lsiting", e)
				}
				if(recursive) {
					let allContents = {};
					for(var fileName in fileIndexes.files) {
						var res = await this.get(
							path.join(id, fileName), options);
						if(res !== null) {
							if(removeJSON) {
								removeJSONExtension(fileName)
							}
							allContents[fileName] = res;
						}
					}
					for(var dirName in fileIndexes.subdirectories) {
						var res = await this.get(
							path.join(id, dirName), options);
						if(res !== null) {
							if(removeJSON) {
								removeJSONExtension(dirName)
							}
							allContents[dirName] = res;
						}
					}
					return allContents;
				} else {
					var info = (fileIndexes || []).map(
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
					filePath = filePath.substring(0, ind)
				}
				return filePath;
			}
			// Handling the file case (non-directory)
			var ext = path.extname(filePath);
			if(ext === '.json') {
				var data = await fs.readFile(filePath, 'utf-8');
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
				var content = await fs.readFile(filePath);
				return content.toString(); // Assuming you want to convert binary data to string
			}
		} catch (error) {
			if(error.code !== 'ENOENT')
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
	async ensureDir(filePath, isDir = false) {
		var dirPath = !isDir ? path.dirname(filePath) : filePath;
		await fs.mkdir(dirPath, { recursive: true });
		/*
		var meta = await this.writeMetadata({
		    dataPath: dirPath,
		    
		    entries: null,
		    type: "directory"
		});
		if(!meta) {
		    console.log("DIDNT write!",meta)
		}*/
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
	async write(id, record, opts={}) {
		var isDir = !record;
		var filePath = await this.getFilePath(id, isDir);
		await this.ensureDir(filePath, isDir);
		if(isDir) {
			return;
		}
		// Determine the directory path
		var directoryPath = path.dirname(filePath);
		var base = path.basename(directoryPath)
		var dir = path.dirname(directoryPath)
		if(record instanceof Buffer) {
			// if the record is a Buffer, write it as binary data
			/*await fs.writeFile(filePath, record);
			var meta = await this.writeMetadata({
			    dataPath: filePath,
			 
			    entries: null,
			    type: "directory"
			});*/
		} else if(typeof(record) == "object") {
			// if the record is not a Buffer, stringify it as JSON
			//await fs.writeFile(filePath, JSON.stringify(record));
			return await this.writeRecordDynamic(filePath, record, opts)
			try {
				await this.indexManager.updateIndex(
					directoryPath,
					base,
					record //data
				);
			} catch (e) {
				console.log("Prolem with indexing", e)
			}
		} else if(typeof(record) == "string") {
			/*
			await fs.writeFile(filePath, record+"", "utf8");
			var meta = await this.writeMetadata({
			    dataPath: filePath,
			 
			    entries: null,
			    type: "file"
			});
			*/
		}
	}
	
	async log(prefix="info",text="Nothing to write!") {
		var pth = `~/logs/${prefix}/BH_${Date.now()}`
		try {
			await this.ensureDir(pth, isDir);
			await fs.writeFile(
				pth,
				text
			); 
		} catch(e) {
			console.log(e)
		}
	}

	removeDirectory(dirPath) {
	  return new Promise((resolve, reject) => {
		  console.log("WOW")
		
		  
	    fsRegular.rm(dirPath, { recursive: true }, (err) => {
	      if (err) {
	        reject(err);
	      } else {
	        resolve();
	      }
	    });
	  });
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
	async writeRecordDynamic(rPath, r, opts={}) {
		if(typeof(rPath) != "string" || !rPath)
			return false;
		if(typeof(r) != "object" || !r) {
			return false
		}
		var isArray = Array.isArray(r);
		var keys = Array.from(Object.keys(r));
		var originalKeys = keys;
		if(isArray) {
			keys = keys.concat("length")
		}
		var entries = {};
		/*
			have to check directory and delete 
   			ALMOST all directories that are not found
      			in it
  		*/
		var onlyUpdate = opts.onlyUpdate/*does not rewrite entire thing every time*/
		try {
			if(!onlyUpdate)
				await this.removeDirectory(rPath)
			
		} catch(e) {
			console.log("ISSUE writing",rPath,e)
			//return {error:e.stack, details: rPath}
		}
		var wrote =  []
		try {
			for(
				var k of keys
			) {
				var pth = path.join(rPath, k)
				await this.ensureDir(pth, true);
				var isObj = false;
				var isAr = false;
				var ext = ".awts" //for string values
				var dataToWrite = r[k];
				switch(typeof(r[k])) {
					case "number":
						ext = ".awtsNum";
						dataToWrite += "";
						
						break;
					case "undefined":
						dataToWrite += ""
						ext = ".awtsUndef"
						break;
					case "boolean":
						ext = ".awtsBool";
						dataToWrite += "";
						break;
					case "object":
						if(r[k] === null) {
							ext = ".awtsNull"
							dataToWrite += "";
						} else {
							if(Array.isArray(r[k])) {
								isAr = true;
							}
							isObj = true;
						}
						break;
				}
				if(isObj) {
					var newPath = path.join(pth)
					var wr = await this.writeRecordDynamic(
						newPath, r[k]
					);
					wrote.push({name: newPath, val: r[k], obj: wr})
					//console.log("Wrote dynamic?", k, keys[k], r[k])
					if(!isAr)
						ext = ".awtsObj";
					else ext = ".awtsAr";
					dataToWrite = null //JSON.stringify(r[k]);
				}
				var val = "val" + ext;
				var joined = path.join(pth, val)
				
				try {
					if(dataToWrite !== null)
						//   console.log("About to write it")
						await fs.writeFile(
							joined,
							dataToWrite
						);
						wrote.push(joined)
					//  console.log("Wrote it",joined,dataToWrite)
				} catch (e) {
					console.log("Didnt write it")
					return {error: "Issue of writing", details: e.stack, path: joined}
				}
				entries[k] = val;
			}
			var meta = await this.writeMetadata({
				dataPath: rPath,
				isArray,
				entries
			});
			if(!meta) {
				console.log("Didn't write meta", dataPath)
				return {error: "No metadata", details: dataPath}
			}
		} catch (e) {
			console.log("Error writing:", e)
			return {error: e.stack};
		}
		return wrote;
	}
	async writeMetadata({
		dataPath,
		isArray,
		entries,
		type
	}) {
		if(typeof(dataPath) != "string") {
			return false;
		}
		if(!type) {
			type = "record"
		}
		//  var dirName = path.dirname(dataPath)
		var metaPath = path.join(
			dataPath,
			"_awtsmoos.meta.entry.json"
		)
		var wasEmpty = !entries
		if(wasEmpty) {
			entries = {}
		}
		var dataToWrite = {
			entries,
			type,
			lastModified: Date.now()
		}
		if(isArray !== undefined) {
			dataToWrite.isArray = isArray;
		}
		var metaAlready = null;
		try {
			metaAlready = await fs.readFile(metaPath);
			metaAlready = JSON.parse(metaAlready);
		} catch (e) {}
		if(metaAlready) {
			dataToWrite.entries = {
				...metaAlready.entries,
				...dataToWrite.entries,
			}
		}
		if(wasEmpty) {
			/**
			 * check if file already exists in 
			 * entries. If not, add it.
			 
			var base = path.basename(dataPath)
			var myFileName = dataToWrite.entries[base];
			if(!myFileName) {
			    var fld = await fs.stat(dataPath);
			    if(type != "directory") {
			        var isDir = fld.isDirectory();
			        dataToWrite.entries[base] = {
			            type: isDir ? "directory" : "file"
			        }
			    }
			}
			*/
		}
		try {
			//   console.log("Tying",metaPath)
			await fs.writeFile(
				metaPath,
				JSON.stringify(dataToWrite)
			);
			//   console.log("Wrote the meta",metaPath,dataPath)
			return true;
			//  console.log("Wrote it all",dataToWrite)
		} catch (e) {
			console.log("Didnt write meta", e)
			return false;
		}
	}
	areAllKeysEqual(obj) {
		// Get the keys of the object
		const keys = Object.keys(obj);
		// If there are no keys or only one key, they are considered equal
		if(keys.length <= 1) {
			return true;
		}
		// Compare all keys with the first key
		const firstKey = keys[0];
		for(let i = 1; i < keys.length; i++) {
			if(keys[i] !== firstKey) {
				return false;
			}
		}
		// If all keys match the first key, return true
		return true;
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
		properties,
		stat,
		derech,
		maxOrech,
		shouldNullify = false,
		meta = false
	}) {
		// Initialize flag to track whether any property should be nullified
		let nullify = shouldNullify;
		if(typeof(filePath) != "string") {
			return false;
		}
		try {
			if(!stat.isDirectory()) {
				return null;
			}
			var dynPath = filePath;
			var bs = path.parse(dynPath).name;
			var mDerech = null;
			if(typeof(derech) == "string") {
				mDerech = derech.split("/")
			}
			var res = null;
			if(meta) {
				var modified = stat.mtime.toISOString()
				var made = stat.birthtime.toISOString()
				var size = stat.size
				res = {
					entityId: bs,
					size,
					modified,
					created: made
				};
				if(meta != "detailed")
					return res;
			}
			var metadata = await this.IsDirectoryDynamic(
				dynPath,
				stat
			);
			if(!metadata) return null;
			if(meta == "detailed") {
				res.details = metadata;
				return res;
			}
			var ents = null;
			var map = null;
			if(mDerech) {
				ents = [mDerech[0]];
			} else if(
				Array.isArray(properties)
			) {
				ents = Array.from(properties);
			} else if(typeof(properties) == "object") {
				map = properties;
				// Object.assign(map, properties)
			}
			var mappedKeys = null;
			if(map) {
				mappedKeys = Object.keys(map);
			}
			var propertyFiles = Object.entries(
				metadata.entries
			);
			//   console.log("PROPERTY",propertyFiles, "MAPT",mappedKeys)
			//   console.log("GETTING",map,mappedKeys)
			var compiledData = {};
			for(
				var ent of propertyFiles
			) {
				var equals = undefined;
				var includes = undefined;
				var raw=false
				var myMax = maxOrech;
				//  console.log("Checking prop",ent)
				if(mappedKeys) {
					if(!mappedKeys.includes(
							ent[0]
						)) {
						continue;
					}
					var val = map[ent[0]]
					if(typeof(val) == "number")
						myMax = val;
				}
				if(ents) {
					if(ent[0] != "length")
						if(!ents.includes(ent[0])) {
							continue;
						}
				}
				if(ent[1].includes(".awtsUndef")) {
					return undefined;
				}
				if(ent[1].includes(".awtsNull")) {
					return null;
				}
				var propPath = path.join(
					dynPath,
					ent[0],
					ent[1]
				);
				if(ent[1].includes(".awtsObj") || ent[1].includes(".awtsAr")) {
					var subDynamicPath = path.join(dynPath, ent[0]);
					//   console.log("Finding sub path", subDynamicPath);
					var ob = {
						filePath: subDynamicPath,
						stat,
						shouldNullify: nullify
					}
					if(mDerech) {
						ob.properties = mDerech.slice(1)
					} else if(ents) {
						ob.properties = ents.slice(1)
					} else if(map) {
						var next = map[ent[0]]
						if(next && typeof(next) == "object")
							ob.properties = next
					}
					var val = await this.getDynamicRecord(ob);
					if(val === undefined) {
						// return undefined;
					}
					if(mDerech) {
						var modifiedValue = null;
						
						function getFinalVal(obj, keys, start) {
							let value = obj;
							for(let i = start; i < keys.length; i++) {
								
								const key = keys[i];
								if(key == "_awtsmoosDeletify") {
									return undefined;
								}
								if(value[key] !== undefined) {
									value = value[key];
								} else {
									return undefined; // or handle error as needed
								}
							}
							//value.essents = 2
							return value;
						}
						var inp = {
                        				[ent[0]]: val
						}
						modifiedValue = getFinalVal(inp, mDerech, 0);
						/*function getValue(obj, arr) {
						    return arr
						    .reduce(
						        (acc, key) => 
						        (acc && acc[key] !== 'undefined')
						         ? acc[key] : undefined, obj
						    );
						}
						try {

						    var finalVal = getValue(modifiedValue, mDerech)
						
						    return finalVal//modifiedValue;
						} catch(e) { 
						    return null;
						}*/
						//console.log("FINLA", modifiedValue)
						//modifiedValue.wow = 123
						return modifiedValue;
						console.log("VALIUED", ent[0], inp, mDerech, modifiedValue)
					}
					if(val) {
						var nullif = false;
						for(var k in val) {
							if(val[k].not && val[k] != ob.properties[k]) {
								nullif = true;
							}
							
						}
						//compiledData.coby= 4
						compiledData[ent[0]] = val
						if(val._awtsmoosDeletify) {
							nullif  = true;
							val.wow=Date.now()
							return undefined;
						}
						if(nullif) {
							nullify = true;
							compiledData["awts_"] = "delete"
							//compiledData[ent[0]] = {not: "delete this"}
						}
					}
					if(val === undefined) {
						// compiledData[ent[0]] = "WHAT";
						//nullify = true;
						// return undefined;
					}
				} else {
					try {
						var maxAmount = myMax && typeof(myMax) == "number" ?
							myMax : null;
						if(map) {
							var settings = map[ent[0]];
							var max = null;
							var offset = 0;
							if(settings && typeof(settings) == "object") {
								max = settings.max;
								equals = settings.equals;
								includes = settings.includes;
								offset = settings.offset || 0;
								raw=settings.raw;
								//  console.log("MAYBE",max,settings)
							}
							if(max && typeof(max) == "number") {
								maxAmount = max;
							}
						}
						if(maxAmount) {
							var bytes = await this.readFileWithOffset(
								propPath, offset, maxAmount
							);
							compiledData[ent[0]] = bytes.toString("utf-8")
						} else {
							try {
								compiledData[ent[0]] = await fs.readFile(
									propPath, "utf-8"
								);
							} catch (e) {
								compiledData[ent[0]] = JSON.stringify({
									message: "COULDN'T READ it?",
									ent,
									propPath,
									stat
								})
							}
						}
						var res = compiledData[ent[0]];
						// console.log("ASDDSASD",res,equals,propPath,ent)
						// compiledData[ent[0]] = equals
					} catch (e) {
						compiledData[ent[0]] = "hi! issue: " + e + " " + JSON.stringify({
							keys: ent,
							map,
							propPath,
							filePath
						})
						console.log("NOPE!", propPath, ent)
					}
				}
				if(ent[1].includes(".awtsNum")) {
					var num = parseFloat(compiledData[ent[0]]);
					if(!isNaN(num)) {
						compiledData[ent[0]] = num
					}
					// console.log("NUMBER",num,compiledData[ent[0]])
				}
				if(ent[1].includes(".awtsBool")) {
					var bool = compiledData[ent[0]];
					if(bool == "false") {
						compiledData[ent[0]] = false;
					} else if(bool == "true") {
						compiledData[ent[0]] = true
					}
					// console.log("NUMBER",num,compiledData[ent[0]])
				}
				var res = compiledData[ent[0]]
				if(equals || equals === false || equals === 0 || equals === null) {
					if(res != equals) {
						compiledData[ent[0]] = {
							not: "delete this"
						}
						compiledData["_awtsmoosDeletify"] = true
					}
				}
				
				if(raw) {
					
					compiledData["_awtsmoosOnlyRaw"]=true
				}
				if(includes || includes === false || includes === 0) {
					if(!res.includes(includes)) {
						compiledData[ent[0]] = {
							not: "delete this"
						}
						compiledData["_awtsmoosDeletify"] = true
					}
				}
				//console.log(propPath,"Reading",ent,ent[1])
			}
			if(metadata.isArray) {
				compiledData = Array.from(compiledData)
				// console.log("Got array",compiledData)
			}
			console.log("DOING?!", compiledData)
			//if(compiledData[".awts_"] == "delete")
			if(nullify)
				return undefined;
			if (compiledData._awtsmoosDeletify) {
				return {_awtsmoosDeletify:true}
			}
			if(compiledData._awtsmoosOnlyRaw) {
				var key = Object.keys(compiledData)
					.find(w=>w!="_awtsmoosOnlyRaw")
				if(key) {
					return compiledData[key]
				}
			}
			//return {"awtsmoos":compiledData}
			if(Array.isArray(compiledData)) {
				compiledData = compiledData.filter(q => !q._awtsmoosDeletify)
			}
			
			return compiledData;
		} catch (e) {
			console.log("Prob with index", e)
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
		} catch (e) {}
		if(!hasM) return null;
		var js = null;
		try {
			js = JSON.parse(hasM)
		} catch (e) {
			return null;
		}
		if(
			!js.entries ||
			typeof(js.entries) !=
			"object"
		) {
			return null;
		}
		return js;
	}
	mapResults(w, propertyMap, mapToOne = true) {
		var p = propertyMap;
		if(!Array.isArray(propertyMap))
			return w;
		if(
			!p.length ||
			propertyMap.includes("entityId")
		) return w;
		var ent = Object.entries(w)
		var fe = Object.fromEntries(
			ent.filter(q => {
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
	async create /*or update!*/(id, record) {
		/*var existing = await this.get(id);
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
		var existing = await this.get(id);
		if(existing === null) {
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
	 * var filePath = await db.getDeleteFilePath('user1');
	 */
	async getDeleteFilePath(id, isRegularDir) {
		//console.log("OK",isRegularDir,id)
		var completePath = await this.getFilePath(id, isRegularDir);
		return completePath;
		var stat;
		try {
			stat = await fs.stat(completePath);
		} catch (e) {}
		var isDir = stat.isDirectory();
		var isFileOrDynamicDir = false;
		if(stat) {
			// If it's a directory, don't append .json
			//	console.log("Still trying")
			/*
  var checkIfItsSingleEntry = 
		await this.getDynamicRecord({
			completePath,
			stat
		});

  */
			//	console.log("Is it?",checkIfItsSingleEntry)
			return completePath;
		} else {
			//check for json extension
			var j = completePath + ".json";
			try {
				await fs.stat(j)
				return j
			} catch (e) {
				return null;
			}
		}
		/*else {
		isFileOrDynamicDir = true;
	}
	
	if(isFileOrDynamicDir) {
		var newPath =  completePath 
        stat = await fs.stat(newPath);

        if(stat && stat.isFile()|| stat.isDirectory()) {
            return newPath;
        }
	}

 */
	}
	/**
	 * Delete a file or a directory.
	 * @param {string} id - The identifier for the file or directory.
	 * @returns {Promise<void>} - A Promise that resolves when the file or directory has been deleted.
	 *
	 * @example
	 * await db.delete('user1');
	 */
	async delete(id, isRegularDir = false) {
		var filePath = await this.getDeleteFilePath(id, isRegularDir);
		// console.log("Hi there",id,filePath);
		try {
			var stat = await fs.stat(filePath);
			// Remove the file or directory
			if(stat.isFile()) {
				await fs.unlink(filePath);
			} else if(stat.isDirectory()) {
				await fs.rm(filePath, { recursive: true });
			}
			return {
				success: {
					message: "Deleted it",
					path: filePath,
					id
				}
			};
		} catch (error) {
			return {
				error: {
					message: "There was an error",
					stack: error.stack
				}
			}
			if(error.code !== 'ENOENT') throw error;
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
		var stats = await stat(path);
		if(stats.isDirectory()) {
			var files = await readdir(path);
			files.sort();
			if(order === 'desc') {
				files.reverse();
			}
			return files.slice(0, 10);
		} else if(stats.isFile()) {
			var parts = path.split('/');
			parts.pop(); // remove the file name
			if(order === 'desc') {
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
		var list = await fs.readdir(dir);
		for(let file of list) {
			file = path.resolve(dir, file);
			var stat = await fs.stat(file);
			if(stat && stat.isDirectory()) {
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
		var allFiles = await this.readAllFiles(this.directory);
		var fileData = Buffer.from(JSON.stringify(allFiles));
		await fs.writeFile(path.join(this.directory, 'db_export.bin'), fileData);
	}
	/**
	 * Imports the database from a binary file.
	 * @returns {Promise<void>}
	 */
	async importDatabase() {
		var fileData = await fs.readFile(path.join(this.directory, 'db_export.bin'));
		var allFiles = JSON.parse(fileData.toString());
		for(let file of allFiles) {
			await this.ensureDir(file.path);
			await fs.writeFile(file.path, file.data);
		}
	}
}
module.exports = DosDB;
