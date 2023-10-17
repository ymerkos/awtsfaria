/** 
B"H

This file contains the implementation
of a file indexing system, designed to
efficiently manage and retrieve file metadata
within a specified directory. 

Classes:
- @class
  TreeNode:
   @description
   A node in the binary search
   tree used for indexing. Holds file or
   directory metadata and references to left
   and right child nodes.


   @class
- AwtsmoosIndexManager: @description
 Manages the creation,
  loading, updating, and listing of indexed files
  and directories. Enables operations like initializing
  the index, ensuring all files are indexed,
  getting sorted indexes, and others.

Functions in AwtsmoosIndexManager:
- init(): Ensures the root directory exists
  and initializes the index.
  
- getSortedIndexes(): Retrieves sorted file
  indexes based on given criteria and pagination.
  
- ensureAllFilesIndexed(): Ensures that all
  files are included in the index.
  
  @public
- deleteAllIndexes(): Deletes all index files
  in specified directories.
  
  @public
- loadIndex(): Loads the index from
  a specified directory path.
  
  @public
- updateIndex(): Updates the index with new
  or modified file details.
  
- inOrderTraversal(): Traverses the binary search
  tree in an in-order fashion.
  
- getSortedIndex(): Retrieves a sorted index
  from the binary search tree.
  
- listFilesWithPagination(): Lists files with
  optional pagination and custom sorting.
  
  @private
- insert(): Inserts file or directory data
  into the binary search tree.
  
  @private
- treeSize(): Calculates the size of
  the binary search tree.
  
- saveSubTree(): Saves a subtree to
  a file.
  
- search(): Searches the binary search
  tree for a file or directory.
  
- loadSubTree(): Loads a subtree from
  a file.
  
- createBinaryTreeIndex(): Creates a binary search
  tree from the index and saves it.

This system utilizes binary search trees
to facilitate efficient file indexing and retrieval
based on different properties such as filename,
creation, and modification dates.

*/

const fs = require("fs").promises;
const path = require("path");


class TreeNode {
	constructor(key, value, fileRef = null) {
		this.key = key; // This will hold the property we are indexing by (filename, creation, modification)
		this.value = value; // This will hold the entire file or directory data
		this.left = null;
		this.right = null;
		this.fileRef = fileRef; // A reference to the file where the sub-tree is saved
	}
}
//







function sanitizePath(relativePath) {
    return relativePath.replace(/\//g, '_').replace(/\\/g, '_');
}


async function ensureDirectoriesExist(directory, indicesFolder) {
	try {
		if(!directory || !indicesFolder) return;
		console.log("Trying",directory, indicesFolder)
		await fs.mkdir(directory, { recursive: true });
		await fs.mkdir(indicesFolder, { recursive: true });
	} catch(e) {
		console.log(999,e)
	}
}


/**
 * The AwtsmoosIndexManager class is responsible for managing the indexing of files.
 * It allows for creating, loading, updating, and listing of indexed files in a specific directory.
 *
 * @class
 * @example
 * const indexManager = new AwtsmoosIndexManager('./db');
 */

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



	/**
	 * Initializes the index by ensuring the root directory exists.
	 *
	 * @returns {Promise<void>} Resolves when the initialization is complete.
	 */
	async init() {
		try {
			await ensureDirectoriesExist
			.bind(this)(this.directory, this.indicesFolder);
			await this.loadTree(this.indicesFolder);
			
			await this.ensureAllFilesIndexed(this.directory);
			
			await this.saveTree(this.root, this.indicesFolder);
		} catch (error) {
			console.error("Initialization failed:", error);
		}
	}
	




	
	
	/**
	 * Ensure all files are included in the index.
	 * @param {string} directoryPath - The path to start indexing from.
	 * @returns {Promise<void>}
	 */
	async ensureAllFilesIndexed(directoryPath) {
		const entries = await fs.readdir(directoryPath, { withFileTypes: true });
	
		for (const entry of entries) {
		  const fullPath = path.join(directoryPath, entry.name);
		  if (entry.isDirectory()) {
			await this.updateIndex(fullPath, true);
			await this.ensureAllFilesIndexed(fullPath);
		  } else if (entry.isFile()) {
			await this.updateIndex(fullPath, false);
		  }
		}
	  }
	
	
	
	/**
	 * Recursively delete all index files in the specified directory and its subdirectories.
	 *
	 * @param {string} directoryPath - The directory path to start deleting indexes from.
	 * @param {string} customIndexName - Custom index name pattern to be deleted.
	 * @returns {Promise<void>} Resolves when all index files are deleted.
	 */
	async deleteAllIndexes(directoryPath, customIndexName = this.newIndexPattern) {
		try {
			const filesAndDirs = await fs.readdir(directoryPath, {
				withFileTypes: true
			});

			// Iterate over all files and directories in the directoryPath
			for (const dirent of filesAndDirs) {
				const fullPath = path.join(directoryPath, dirent.name);

				if (dirent.isDirectory()) {
					// If it's a directory, recurse into this directory
					await this.deleteAllIndexes(fullPath, customIndexName);
				} else if (dirent.name.endsWith(customIndexName)) {
					// If it's a file and matches the index pattern, delete it
					await fs.unlink(fullPath);
				}
			}
		} catch (e) {

		}
	}
	

	/**
	 * Updates the index by adding or modifying a file's details.
	 *
	 * @param {string} directoryPath - The relative path of the directory.
	 * @param {string} fileId - The unique identifier of the file.
	 * @returns {Promise<void>} Resolves when the update is complete.
	 */
	async updateIndex(filePath, isDirectory) {
		const stats = await fs.stat(filePath);
		const key = filePath;
		const value = {
			creation: stats.birthtimeMs,
			modification: stats.mtimeMs,
			isDirectory: isDirectory
		};

		this.root = this.insertNodeIntoTree(this.root, key, value);
	}

	insertNodeIntoTree(node, key, value) {
		if (!node) {
		  return new TreeNode(key, value);
		}
	
		if (key < node.key) {
		  node.left = this.insertNodeIntoTree(node.left, key, value);
		} else if (key > node.key) {
		  node.right = this.insertNodeIntoTree(node.right, key, value);
		} else {
		  // Update existing node
		  node.value = value;
		}
	
		return node;
	  }

	// Save Tree Method
	async saveTree(node, relPath = '.', depth = 0) {
		if (!node) return;
	
		const safeKey = encodeURIComponent(node.key);
		const filePath = `${relPath}/${safeKey}.json`;
		await fs.mkdir(path.dirname(filePath), { recursive: true });
		await fs.writeFile(filePath, JSON.stringify(node.value));
	
		await this.saveTree(node.left, `${relPath}/left`, depth + 1);
		await this.saveTree(node.right, `${relPath}/right`, depth + 1);
	}


	  // Load Tree Method
		async loadTree(relPath = '.', node = null, depth = 0) {
		const exists = await fs.access(relPath).then(() => true).catch(() => false);
		if (!exists) return;

		const entries = await fs.readdir(relPath, { withFileTypes: true });

		for (const entry of entries) {
			const fullPath = `${relPath}/${entry.name}`;
			if (entry.isFile()) {
			const jsonData = await fs.readFile(fullPath, 'utf-8');
			const value = JSON.parse(jsonData);
			const key = path.basename(entry.name, '.json');
			const newNode = new TreeNode(key, value);
			if (!node) {
			  this.root = newNode;
			  node = this.root;
			} else {
			  if (key < node.key) {
				node.left = newNode;
			  } else {
				node.right = newNode;
			  }
			}
	
			await this.loadTree(path.join(folder, 'left'), newNode.left, depth + 1);
			await this.loadTree(path.join(folder, 'right'), newNode.right, depth + 1);
		  }
		}
	  }
	
	
	
	
	
	
	
	
	
	

	
	

	/**
	 * Lists the files with optional pagination and custom sorting.
	 *
	 * @param {string} directoryPath - The relative path of the directory.
	 * @param {number} [page=1] - The page number to retrieve.
	 * @param {number} [pageSize=10] - The number of items per page.
	 * @param {function} [sortFunction] - Custom function to sort the files.
	 * @returns {Promise<Array<object>>} Resolves with an array of files.
	 */
	async listFilesWithPagination(directoryPath, page = 1, pageSize = 10, sortBy = 'alphabetical', order = 'asc') {
		const allNodes = [];
		this.inOrderTraversal(this.treeRoot, allNodes);
	  
		const files = [];
		const folders = [];
	  
		// Sorting logic
		if (sortBy === 'creation') {
		  allNodes.sort((a, b) => a.value.creation - b.value.creation);
		} else if (sortBy === 'modification') {
		  allNodes.sort((a, b) => a.value.modification - b.value.modification);
		} else { // alphabetical
		  allNodes.sort((a, b) => a.key.localeCompare(b.key));
		}
	  
		// Reverse order if needed
		if (order === 'desc') {
		  allNodes.reverse();
		}
	  
		// Pagination logic
		const startIndex = (page - 1) * pageSize;
		const endIndex = startIndex + pageSize;
		const paginatedNodes = allNodes.slice(startIndex, endIndex);
	  
		// Separation of files and folders
		for (const node of paginatedNodes) {
		  if (node.value.isDirectory) {
			folders.push(node.key);
		  } else {
			files.push(node.key);
		  }
		}
	  
		return { files, folders };
	  }

	/**
	 * Inserts a file or directory data into the binary search tree.
	 * @param {TreeNode} node - The current tree node.
	 * @param {string} key - The property to index by.
	 * @param {object} value - The file or directory data.
	 */
	insert(root, key, value) {
		if (!root) return new TreeNode(key, value);
		
		if (key < root.key) {
			root.left = this.insert(root.left, key, value);
		} else if (key > root.key) {
			root.right = this.insert(root.right, key, value);
		}
		
		return root;
	}
		
	inOrderTraversal(root, result) {
		if (!root) return;
		
		this.inOrderTraversal(root.left, result);
		result.push(root);
		this.inOrderTraversal(root.right, result);
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