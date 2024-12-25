class IndexedDBHandler {
  constructor(dbName) {
    this.dbName = dbName;
    this.db = null;
  }

  // Open or upgrade the database, ensuring object store exists or is created
  async init() {
    this.db = await new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Create a default store 'keys' if it doesn't exist
        if (!db.objectStoreNames.contains('keys')) {
          db.createObjectStore('keys', { keyPath: 'id' });
        }
      };
    });
  }

 // Ensures the store exists; if not, creates it in an upgraded transaction
async _ensureStoreExists(storeName) {
  return false
  try {
    // Check if the store exists in the current database schema
    const storeExists = this.db.objectStoreNames.contains(storeName);
    console.log("Trying",storeExists,this.db.objectStoreNames);
    if (storeExists) {
      return; // If store exists, do nothing and return
    }
  
    // Store does not exist, initiate a version upgrade
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.db.version + 1); // Increment version to trigger upgrade
      console.log("Doing",request);
      // Handle errors during opening the database
      request.onerror = (e) => {
        console.error('Error opening database:', e.target.error);
        reject(e.target.error);
      };

      // Once the database is successfully opened
      request.onsuccess = () => {
        const db = request.result;
        
        // Check again after the successful open, just to be sure
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath: 'id' });
        }
        resolve(); // Resolve once the store is created or already exists
      };

      // Trigger the store creation during upgrade if needed
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath: 'id' });
        }
      };
    });
  } catch (e) {
    console.log('Error during _ensureStoreExists:', e);
    return false; // Return false if there was an error
  }
}


  // Write data to the object store, ensuring store exists first
  async write(storeName, data) {
    await this._ensureStoreExists(storeName); // Ensure store exists before writing
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const request = store.put(data); // Attempt to write data
      request.onsuccess = () => resolve(true);
      request.onerror = (e) => reject(e.target.error); // Error handling
    });
  }

  // Read data from the object store, ensuring store exists first
  async read(storeName, id) {
    await this._ensureStoreExists(storeName); // Ensure store exists before reading
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const request = store.get(id); // Attempt to read data
      request.onsuccess = () => resolve(request.result || null); // Return null if no result
      request.onerror = () => reject(request.error); // Error handling
    });
  }

  // Get all keys in a store (returns an array)
  async getAllKeys(storeName) {
    await this._ensureStoreExists(storeName); // Ensure store exists before reading
    return new Promise((resolve, reject) => {
      try {
        const tx = this.db.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        const keys = [];
  
        // Use cursor to iterate through the store and get all keys
        const request = store.openCursor();
        request.onsuccess = (event) => {
          const cursor = event.target.result;
          if (cursor) {
            keys.push(cursor.key); // Add the key to the keys array
            cursor.continue(); // Continue to next entry
          } else {
            // Once done, resolve the keys array
            resolve(keys);
          }
        };
  
        request.onerror = (err) => {
          reject(err.target.error); // Reject if there's an error
        };
      } catch(e) {
        console.log(e);
        resolve([]);
      }
    });
  }

  // Method for reading conversations, with sorting and pagination (like in your original method)
  async getStore({storeName, offset, pageSize}={}) {
    return this.getAllKeys(storeName).then((keys) => {
      return new Promise((resolve, reject) => {
        const tx = this.db.transaction('conversations', 'readonly');
        const store = tx.objectStore('conversations');
        const conversations = [];

        keys.forEach((key) => {
          const request = store.get(key);
          request.onsuccess = (event) => {
            conversations.push(event.target.result);
            if (conversations.length === keys.length) {
              // Sort by updatedAt in descending order
              conversations.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
              const paginatedConversations = conversations.slice(offset, offset + pageSize);
              resolve(paginatedConversations);
            }
          };
          request.onerror = (err) => reject(err.target.error);
        });
      });
    });
  }
}

export default IndexedDBHandler;
