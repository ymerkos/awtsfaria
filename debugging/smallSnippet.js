//B"H
var fs = require("fs").promises;
var path = require("path");

class TreeNode {
	constructor(key, value, fileRef = null) {
		this.key = key; 
		this.value = value; 
		this.left = null;
		this.right = null;
		this.fileRef = fileRef; 
	}
    //maybe modify this
}

async function saveTree(root, folder) {
    //not sure what this is
    //implement
}

async function loadTree(folder) {
    //not sure if keepign this or not
    //imlpement
}


async function ensureDirectoriesExist(directory, indicesFolder) {
	try {
		if(!directory || !indecesFolder) return;
		console.log("Trying",directory, indicesFolder)
		await fs.mkdir(directory, { recursive: true });
		await fs.mkdir(indicesFolder, { recursive: true });
	} catch(e) {
		console.log(999,e)
	}
}

class AwtsmoosIndexManager {

	constructor({
		directory,
		oldIndexPattern = 'index.json',
		newIndexPattern = '_awtsmoos.index.json',
		indicesName = '_awtsmoos.indices',
		maxNodes=100
	} = {}) {
		this.directory = directory || "../";
		this.indicesName = indicesName
		this.indicesFolder =
			 path.join(this.directory, indicesName);

		this.maxNodes = maxNodes;
		this.oldIndexPattern = oldIndexPattern;
		this.newIndexPattern = newIndexPattern;

	}

	async init() {
		try {
			await ensureDirectoriesExist.bind(this)(this.directory, this.indicesFolder);
			await this.ensureAllFilesIndexed(this.directory);
		} catch (error) {
			console.error("Initialization failed:", error);
		}
	}


	async ensureAllFilesIndexed(directoryPath) {
		//implement
	}

	

	async listFilesWithPagination(directoryPath, page = 1, pageSize = 10, sortBy = 'alphabetical', order = 'asc') {
		//implement this please
	}

}

	

async function exists(filePath) {
	try {
		await fs.access(filePath);
		return true;
	} catch {
		return false;
	}
};

module.exports = AwtsmoosIndexManager;