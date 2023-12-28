//B"H
class Node {
	constructor(id, keys = [], children = []) {
		this.id = id;
		this.keys = keys;
		this.children = children;
	}
}

class BTree {
	constructor(order = 3) {
		this.nextNodeId = 0;
		this.root = this.createNode();
		this.order = order;
	}

	createNode(keys, children = []) {
		var newNode = new Node(this.generateNodeId(), keys, children);
		return newNode;
	}

	generateNodeId() {
		return ++this.nextNodeId;
	}

	insert(key) {
		var root = this.root;
		if (root.keys.length === this.order - 1) {
			var newRoot = this.createNode([]);
			newRoot.children.push(root);
			this.split(newRoot, 0);
			this.insertNonFull(newRoot, key);
			this.root = newRoot;
		} else {
			this.insertNonFull(root, key);
		}
	}

	bulkInsert(keys) {
		for (var key of keys) {
			this.insert(key);
		}
	}

	insertNonFull(node, key) {
        if (!node || !Array.isArray(node.keys)) {
            return;
        }
    
        // Find the correct position for key insertion
        let i = node.keys.length - 1;
        while (i >= 0 && key < node.keys[i]) {
            i--;
        }
        i++;
    
        if (node.children.length > 0) {
            var child = node.children[i];
            
            // Check if the child is full and needs splitting
            if (child && child.keys.length >= this.order - 1) {
                this.split(node, i);
                
                // Adjust the child index if necessary
                if (key >= node.keys[i]) {
                    i++;
                }
            }
    
            // Recursively insert the key into the appropriate child node
            this.insertNonFull(node.children[i], key);
        } else {
            // Insert the key into the current node
            if (key != null && key !== '' && !Array.isArray(key)) {
                if (!node.keys.includes(key)) {
                    // Key doesn't already exist, so insert it
                    node.keys.splice(i, 0, key);
                } else {
                    throw new Error('Duplicate key.');
                }
            } else {
                throw new Error('Invalid key.');
            }
        }
    
        if (node === this.root && node.keys.length >= this.order - 1) {
            // Split the root node if it's full
            var median = node.keys.pop();
            var newChildKeys = node.keys.splice(i);
            var newChild = this.createNode(newChildKeys);
            var newRoot = this.createNode([median], [this.root, newChild]);
            this.root = newRoot;
        }
    }

	split(parent, index) {
        if (!parent || !Array.isArray(parent.children)) {
            throw new Error('Invalid parent or children.');
        }
    
        var child = parent.children[index];
        var medianIndex = Math.floor((this.order - 1) / 2);
    
        if (child.keys.length >= this.order - 1) {
            // Create a new child node to store the remaining keys from the old child node
            var newKeys = child.keys.splice(medianIndex + 1);
            // Remove the old child node from the parent
            parent.children.splice(index, 1);
    
            if (newKeys.length > 0) {
                // If the new child node is not empty, add it to the parent node
                var newChild = this.createNode(newKeys);
                parent.children.splice(index, 0, newChild);
            }
    
            // Update the parent's keys with the median key
            parent.keys.splice(index, 0, child.keys.pop());
    
            if (parent.keys.length === 0 && parent === this.root) {
                // If the parent node is empty and it is the root node, make the new child node the root
                this.root = parent.children[index];
            }
        }
    }
    
}