//B"H

// IndexedDB Handler Class
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
    // Open a transaction to check for the store
    const storeExists = this.db.objectStoreNames.contains(storeName);

    if (storeExists) {
      return; // Store exists, do nothing
    }

    // Store does not exist, initiate a version upgrade
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 2); // Increment version
      request.onerror = (e) => reject(e.target.error);

      request.onsuccess = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath: 'id' });
        }
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath: 'id' });
        }
      };
    });
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
}

export default IndexedDBHandler;
