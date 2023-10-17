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

// Utility Functions
// Modified saveTree to save metadata for each node
async function saveTree(root, folder) {
    if (!root) return;

    const nodeFolder = path.join(folder, root.key);
    await fs.mkdir(nodeFolder, { recursive: true });

    if (root.left) {
        const leftMetadataFile = path.join(nodeFolder, 'left', 'metadata.json');
        await fs.writeFile(leftMetadataFile, JSON.stringify(root.left.metadata), 'utf-8');
        await saveTree(root.left, path.join(nodeFolder, 'left'));
    }

    if (root.right) {
        const rightMetadataFile = path.join(nodeFolder, 'right', 'metadata.json');
        await fs.writeFile(rightMetadataFile, JSON.stringify(root.right.metadata), 'utf-8');
        await saveTree(root.right, path.join(nodeFolder, 'right'));
    }
}



async function loadTree(folder) {
    try {
        if (!folder) {
            console.log("Folder path is not provided.");
            return null;
        }

        const metadataFile = path.join(folder, 'metadata.json');
        
        // Check if metadata file exists
        try {
            await fs.access(metadataFile);
        } catch {
            console.log(`Metadata file does not exist in folder: ${folder}`);
            return null;
        }

        // Read and parse metadata file
        const metadataContent = await fs.readFile(metadataFile, 'utf-8');
        var metadata;
		try {
			metadata = JSON.parse(metadataContent);
		} catch(e) {
			console.log(`Couldn't parse`,e,`for ${folder} at ${
				metadataFile
			}`)
		}
		
		

        // Create a new tree node from the metadata
        const node = new TreeNode(metadata.fileId, metadata);

        // Load left and right children recursively
        const leftChildFolder = path.join(folder, 'left');
        const rightChildFolder = path.join(folder, 'right');

        // Check if left and right folders exist, if they do, load the tree from those folders
        try {
            await fs.access(leftChildFolder);
            node.left = await loadTree(leftChildFolder);
        } catch {
            node.left = null;
        }
        
        try {
            await fs.access(rightChildFolder);
            node.right = await loadTree(rightChildFolder);
        } catch {
            node.right = null;
        }

        return node;
    } catch (error) {
        console.log(`An error occurred while loading the tree: ${error}`);
        return null;
    }
}





function sanitizePath(relativePath) {
    return relativePath.replace(/\//g, '_').replace(/\\/g, '_');
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
			await ensureDirectoriesExist.bind(this)(this.directory, this.indicesFolder);
			await this.ensureAllFilesIndexed(this.directory);
		} catch (error) {
			console.error("Initialization failed:", error);
		}
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
	async getSortedIndexes(directoryPath, criteria = 'alphabetical', order = 'asc', page = 1, pageSize = 10) {
		try {
			await ensureDirectoriesExist.bind(this)(this.directory, this.indicesFolder);
			const indexFolder = path.join(this.indicesFolder, path.basename(directoryPath));
			let root = await loadTree.bind(this)(indexFolder);
	
			let sortedFiles = [];
			this.inOrderTraversal(root, sortedFiles);
	
			sortedFiles.sort((a, b) => {
				let valA = a[0];
				let valB = b[0];
	
				if (criteria !== 'alphabetical') {
					valA = a[1][criteria];
					valB = b[1][criteria];
				}
	
				return order === 'asc' ? 
				(valA > valB ? 1 : -1) : (valB > valA ? 1 : -1);
			});
	
			const start = (page - 1) * pageSize;
			const end = start + pageSize;
	
			return sortedFiles.slice(start, end);
		} catch (error) {
			console.error(`Failed to get sorted indexes: ${error.message}`);
		}
	}
	
	/**
	 * Ensure all files are included in the index.
	 * @param {string} directoryPath - The path to start indexing from.
	 * @returns {Promise<void>}
	 */
	async ensureAllFilesIndexed(directoryPath) {
		try {
			// Validate directory and indicesFolder
			if (!this.directory || !this.indicesFolder) {
				throw new Error("Invalid directory paths.");
			}
	
			// Read directory
			const files = await fs.readdir(directoryPath);
	
			// Create an array to collect update promises
			const updatePromises = [];
	
			for (const file of files) {
				const filePath = path.join(directoryPath, file);
				if (file.includes(this.indicesName)) continue;
				
				const stat = await fs.stat(filePath);
				updatePromises.push(this.updateIndex(directoryPath, file, stat.isDirectory()));
	
				if (stat.isDirectory()) {
					updatePromises.push(this.ensureAllFilesIndexed(filePath));
				}
			}
	
			// Wait for all updates to complete
			await Promise.all(updatePromises);
	
		} catch (error) {
			console.error(`Failed to ensure all files are indexed: ${error.message}`);
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
		const indexFolder = path.join(this.indicesFolder, sanitizePath(path.relative(this.directory, directoryPath)));
		let root = await loadTree.bind(this)(indexFolder);
		
		return root; // Since your index is now a binary tree
	}

	/**
	 * Updates the index by adding or modifying a file's details.
	 *
	 * @param {string} directoryPath - The relative path of the directory.
	 * @param {string} fileId - The unique identifier of the file.
	 * @returns {Promise<void>} Resolves when the update is complete.
	 */
	async updateIndex(directoryPath, fileId, isDirectory = false) {
		try {
			// Validate input parameters and class properties
			if (!this.directory || !this.indicesFolder) {
				throw new Error("Invalid directory or index folder paths.");
			}
	
			// Calculate paths
			const relativePath = sanitizePath(path.relative(this.directory, directoryPath));
			const indexFolder = path.join(this.indicesFolder, relativePath);
			const indexMetadataFile = path.join(indexFolder, `${fileId}`, 'metadata.json');

	
			// Prepare new data object
			const newData = {
				fileId,
				isDirectory,
				creation: Date.now(),
				modification: Date.now(),
				relativePath
			};
	
			// Perform filesystem operations asynchronously but in a controlled manner
			await Promise.all([
				fs.mkdir(indexFolder, { recursive: true }),  // Ensure the index folder exists
				fs.writeFile(indexMetadataFile, JSON.stringify(newData), 'utf-8')  // Write metadata
			]);
	
			// Log success
			console.log(`Successfully updated metadata.json in index folder ${indexMetadataFile}`);
	
			// Load existing tree structure
			let root = await loadTree.bind(this)(indexFolder);
			
			// Initialize tree root if it doesn't exist
			if (!root) {
				root = new TreeNode('root', {});
			}
	
			// Update tree structure with the new data
			root = this.insert(root, fileId, newData);
	
			// Save updated tree structure
			await saveTree.bind(this)(root, indexFolder);
			
		} catch (error) {
			// Log errors with more context
			console.error(`Failed to update index for ${fileId} in ${directoryPath}: ${error.message}`);
		}
	}
	
	
	
	
	
	
	
	
	
	
	

	/**
	 * Traverses the binary search tree in an in-order fashion and applies the callback function.
	 * @param {TreeNode} node - The current tree node.
	 * @param {function} callback - The function to apply during the traversal.
	 */
	inOrderTraversal(root, filesArr, foldersArr) {
		if (!root) return;
		this.inOrderTraversal(root.left, filesArr, foldersArr);
	
		// Assuming root.value has a property isDirectory to identify folders
		if (root.value.isDirectory) {
			foldersArr.push([root.key, root.value]);
		} else {
			filesArr.push([root.key, root.value]);
		}
	
		this.inOrderTraversal(root.right, filesArr, foldersArr);
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
		const indexFolder = path.join(this.indicesFolder, sanitizePath(path.relative(this.directory, directoryPath)));
		let root = await loadTree(indexFolder);
		console.log("DOING",root,indexFolder)
		let sortedFiles = [];
		let sortedFolders = [];
		
		this.inOrderTraversal(root, sortedFiles, sortedFolders);
		
		// Your existing sorting logic here ...
		
		const start = (page - 1) * pageSize;
		const end = start + pageSize;
		
		return {
			files: sortedFiles.slice(start, end),
			folders: sortedFolders.slice(start, end)
		};
	}

	/**
	 * Inserts a file or directory data into the binary search tree.
	 * @param {TreeNode} node - The current tree node.
	 * @param {string} key - The property to index by.
	 * @param {object} value - The file or directory data.
	 */
	insert(root, key, value) {
		// If the root node is null, create a new TreeNode with key, value, and metadata
		if (!root) {
			const newNode = new TreeNode(key, value);
			newNode.metadata = {
				creation: Date.now(),
				modification: Date.now(),
				// Add any additional metadata fields you need
			};
			return newNode;
		}
	
		// Compare the key with the root's key and decide where to go (left or right)
		if (key < root.key) {
			root.left = this.insert(root.left, key, value);
		} else if (key > root.key) {
			root.right = this.insert(root.right, key, value);
		} else {
			// If the key already exists, update the value and metadata for that key
			root.value = value;
			root.metadata.modification = Date.now();
			// Update any other metadata fields if needed
		}
	
		// Return the updated root node
		return root;
	}
	


	treeSize(node) {
		if (node == null) return 0;
		return 1 + this.treeSize(node.left) + this.treeSize(node.right);
	}

	async saveSubTree(node) {
		await ensureDirectoriesExist(this.directory, this.indicesFolder);
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
		await ensureDirectoriesExist(this.directory, this.indicesFolder);
		if (node === null) return null;

		if (node.fileRef) {
			node = await this.loadSubTree(node.fileRef);
		}

		if (key < node.key) return this.search(node.left, key);
		else if (key > node.key) return this.search(node.right, key);
		else return node.value;
	}

	async loadSubTree(filename) {
		await ensureDirectoriesExist(this.directory, this.indicesFolder);
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
		await ensureDirectoriesExist(this.directory, this.indicesFolder);
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