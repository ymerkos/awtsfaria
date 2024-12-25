//B"H
//B"H

// IndexedDB Handler Class
class IndexedDBHandler {
  constructor(dbName) {
    this.dbName = dbName;
    this.db = null;
  }

  async init() {
    // Initialize the database
    this.db = await new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        // Initial store setup
        db.createObjectStore('keys', { keyPath: 'id' });
        resolve(db);
      };
    });
  }

  // Write function with auto-creation of store if it doesn't exist
  async write(storeName, data) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeName, 'readwrite');
      let store;

      try {
        store = tx.objectStore(storeName);
      } catch (error) {
        if (error.name === 'NotFoundError') {
          // Create store if it doesn't exist
          const db = tx.db; // Get the database
          store = db.createObjectStore(storeName, { keyPath: 'id' });
        } else {
          // Reject with any other error
          return reject(error);
        }
      }

      const request = store.put(data); // Attempt to write data
      request.onsuccess = () => resolve(true);
      request.onerror = (e) => reject(e.target.error); // Error handling
    });
  }

  // Read function with return of null if store doesn't exist or no data found
  async read(storeName, id) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeName, 'readonly');
      let store;

      try {
        store = tx.objectStore(storeName);
      } catch (error) {
        if (error.name === 'NotFoundError') {
          // Store doesn't exist, resolve with null
          return resolve(null);
        }
        return reject(error); // Reject with other errors
      }

      const request = store.get(id); // Attempt to read data
      request.onsuccess = () => resolve(request.result || null); // Return null if no result
      request.onerror = () => reject(request.error); // Error handling
    });
  }
}

export default IndexedDBHandler;
