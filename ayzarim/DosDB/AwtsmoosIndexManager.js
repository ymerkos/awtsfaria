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
		maxNodes
	} = {}) {
		this.directory = directory || "../";

		this.maxNodes = maxNodes;
		this.oldIndexPattern = oldIndexPattern;
		this.newIndexPattern = newIndexPattern;

		this.init();
	}



	/**
	 * Initializes the index by ensuring the root directory exists.
	 *
	 * @returns {Promise<void>} Resolves when the initialization is complete.
	 */
	async init() {
		await fs.mkdir(this.directory, {
			recursive: true
		});

		//this.deleteAllIndexes(this.directory, "index.json")
		await this.ensureAllFilesIndexed(this.directory);
	}




	/**
	 * Get sorted indexes based on the given criteria, order, and pagination.
	 *
	 * @param {string} directoryPath - The directory path.
	 * @param {string} criteria - The sorting criteria ('alphabetical' or 'date').
	 * @param {string} order - The sorting order ('asc' or 'desc').
	 * @param {number} page - The page number.
	 * @param {number} pageSize - The number of items per page.
	 * @returns {Promise<Array<string>>} Resolves with an array of sorted and paginated file identifiers.
	 */
	async getSortedIndexes(
		directoryPath,
		criteria = 'alphabetical',
		order = 'asc',
		page = 1,
		pageSize = 10
	) {
		const index = await this.loadIndex(directoryPath);

		// Separating and converting the files and directories objects to arrays
		const filesArray = Object.entries(index.files);
		const directoriesArray = Object.entries(index.subdirectories);

		// Creating a dynamic sort function based on criteria and order
		const sortFunction = (a, b) => {
			let valA = a[0]; // Default to filename or directory name
			let valB = b[0];

			if (criteria !== 'alphabetical') {
				valA = a[1][criteria];
				valB = b[1][criteria];
			}

			return order === 'asc' ? (valA > valB ? 1 : -1) : (valB > valA ? 1 : -1);
		};

		// Sort both arrays using the dynamic sortFunction
		filesArray.sort(sortFunction);
		directoriesArray.sort(sortFunction);

		// Applying pagination
		const paginatedFiles = filesArray.slice((page - 1) * pageSize, page * pageSize);
		const paginatedDirectories = directoriesArray.slice((page - 1) * pageSize, page * pageSize);

		// Creating paginatedIndex to hold the results
		const paginatedIndex = {
			files: Object.fromEntries(paginatedFiles),
			subdirectories: Object.fromEntries(paginatedDirectories)
		};

		return paginatedIndex;
	}
	/**
	 * Ensure all files are included in the index.
	 * @param {string} directoryPath - The path to start indexing from.
	 * @returns {Promise<void>}
	 */
	async ensureAllFilesIndexed(directoryPath) {
		
    const files = await fs.readdir(directoryPath);
		for (const file of files) {
			const filePath = path.join(directoryPath, file);
			const stat = await fs.stat(filePath);

      
			if (file.endsWith(this.oldIndexPattern) || file.endsWith(this.newIndexPattern)) {
				continue; // Skip the index files
			}

			if (stat.isDirectory()) {
				// Avoid reprocessing the directory
				const newIndexFilePath = path.join(filePath, this.newIndexPattern);
				if (!await exists(newIndexFilePath)) {
					await this.ensureAllFilesIndexed(filePath);
					await this.updateIndex(directoryPath, file, true);
				}
			} else {
				await this.updateIndex(directoryPath, file, false);
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
	 * Load the index from a specified directory path.
	 *
	 * @param {string} directoryPath - The relative path of the directory.
	 * @returns {Promise<object>} Resolves with the loaded index object.
	 */
	async loadIndex(directoryPath, updateInvalid = false) {
		const indexPath = path.join(directoryPath, this.newIndexPattern);
    var index = {
      files: {},
      subdirectories: {}
    };
		try {
			const indexData = await fs.readFile(indexPath, 'utf-8');
			index = JSON.parse(indexData);
    
      
		} catch (error) {


			if (updateInvalid) {
				// If updateInvalid is true, just writing the new (empty) index and return it.
				// The ensureAllFilesIndexed method will handle the actual indexing.
				await fs.writeFile(indexPath, JSON.stringify(newIndex), 'utf-8');
			}

		}

    await this.createBinaryTreeIndex(index); // Adding this line here

    return index;
	}

	/**
	 * Updates the index by adding or modifying a file's details.
	 *
	 * @param {string} directoryPath - The relative path of the directory.
	 * @param {string} fileId - The unique identifier of the file.
	 * @returns {Promise<void>} Resolves when the update is complete.
	 */
	async updateIndex(directoryPath, fileId, isDirectory = false) {
		const index = await this.loadIndex(directoryPath, true);

		if (isDirectory) {
			index.subdirectories[fileId] = {
				creation: Date.now(),
				modification: Date.now()
			};
		} else {
			index.files[fileId] = {
				creation: Date.now(),
				modification: Date.now()
			};
		}

		const indexPath = path.join(directoryPath, this.newIndexPattern);
		await fs.writeFile(indexPath, JSON.stringify(index), 'utf-8');
	}

	/**
	 * Traverses the binary search tree in an in-order fashion and applies the callback function.
	 * @param {TreeNode} node - The current tree node.
	 * @param {function} callback - The function to apply during the traversal.
	 */
	inOrderTraversal(node, callback) {
		if (node != null) {
			this.inOrderTraversal(node.left, callback);
			callback(node);
			this.inOrderTraversal(node.right, callback);
		}
	}

	/**
	 * Gets a sorted index from the binary search tree.
	 * @param {TreeNode} root - The root of the binary search tree.
	 * @param {string} order - The sorting order ('asc' or 'desc').
	 * @returns {Array<object>} An array of sorted files or directories.
	 */
	getSortedIndex(root, order = 'asc') {
		const results = [];
		this.inOrderTraversal(root, node => {
			results.push(node.value);
		});

		if (order === 'desc') {
			results.reverse();
		}

		return results;
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
		const index = await this.loadIndex(directoryPath);

		let root = null;

		// Inserting files into the binary tree
		for (const [filename, data] of Object.entries(index.files)) {
			let key;
			if (sortBy === 'alphabetical') {
				key = filename;
			} else {
				key = data[sortBy];
			}

			root = await this.insert(root, key, {
				filename,
				...data
			});
		}
		// Inserting directories into the binary tree
		for (const [dirname, data] of 
      Object.entries(index.subdirectories)) {
			let key;
			if (sortBy === 'alphabetical') {
				key = dirname;
			} else {
				key = data[sortBy];
			}
      
			root = await this.insert(root, key, {
				dirname,
				...data
			});
		}

		// Getting sorted index from the binary tree
		const sortedIndex = this.getSortedIndex(root, order);
    
		// Applying pagination
		const start = (page - 1) * pageSize;
		const end = start + pageSize;

		// Returning paginated results
		const paginatedResults = {
			files: {},
			subdirectories: {}
		};

		sortedIndex.slice(start, end).forEach(item => {
			if (item.filename) {
				paginatedResults.files[item.filename] = item;
			} else if (item.dirname) {
				paginatedResults.subdirectories[item.dirname] = item;
			}
		});

		return paginatedResults;
	}

	/**
	 * Inserts a file or directory data into the binary search tree.
	 * @param {TreeNode} node - The current tree node.
	 * @param {string} key - The property to index by.
	 * @param {object} value - The file or directory data.
	 */
	async insert(node, key, value) {
    
    if (node === null) return new TreeNode(key, value);

    if (this.treeSize(node) >= this.maxNodes) {
        const filename = await this.saveSubTree(node);
        return new TreeNode(key, value, filename);
    }

    if (key < node.key) {
        node.left = await this.insert(node.left, key, value);
    } else if (key > node.key) {
        node.right = await this.insert(node.right, key, value);
    } else { // When the key is equal to the node's key
        node.value = value; // Updating the value of the existing node
    }

    return node;
}


	treeSize(node) {
		if (node == null) return 0;
		return 1 + this.treeSize(node.left) + this.treeSize(node.right);
	}

	async saveSubTree(node) {
		const filename = `subtree_${Date.now()}.json`;
		const filepath = path.join(this.directory, filename);
		await fs.writeFile(filepath, JSON.stringify(node));
		return filename;
	}

	/**
	 * Searches the binary search tree for a file or directory.
	 * @param {TreeNode} node - The current tree node.
	 * @param {string} key - The property to search by.
	 */
	async search(node, key) {
		if (node === null) return null;

		if (node.fileRef) {
			node = await this.loadSubTree(node.fileRef);
		}

		if (key < node.key) return this.search(node.left, key);
		else if (key > node.key) return this.search(node.right, key);
		else return node.value;
	}

	async loadSubTree(filename) {
		const filepath = path.join(this.directory, filename);
		const data = await fs.readFile(filepath, 'utf-8');
		return JSON.parse(data);
	}

	/**
	 * Creates a binary search tree from the index and saves it.
	 * @param {object} index - The index object.
	 * @param {string} property - The property to index by ('filename', 'creation', 'modification').
	 */
	async createBinaryTreeIndex(index, property = 'filename') {
		let root = null;

		for (const [filename, data] of Object.entries(index.files)) {
      
			let key;
			if (property === 'filename') key = filename;
			else key = data[property];

			root = await this.insert(root, key, {
				filename,
				...data
			});
		}

		for (const [dirname, data] of Object.entries(index.subdirectories)) {
			let key;
			if (property === 'filename') key = dirname;
			else key = data[property];

			root = await this.insert(root, key, {
				dirname,
				...data
			});
		}

		// Now, you can save the root of the tree to a file if needed, or use it directly for searches
		// For saving to a file, you might need to serialize the tree structure into a format that can be stored and later reconstructed

		return root; // Returning the root of the BST for further operations like searching
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