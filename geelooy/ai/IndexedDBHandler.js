//B"H
// IndexedDB Handler Class
class IndexedDBHandler {
  constructor(dbName) {
    this.dbName = dbName;
    this.db = null;
  }

  async init() {
    // ... (init function remains unchanged) ...
  }

  async _ensureStoreExists(storeName) {
    try {
      // Attempt to get the store (will throw error if not found)
      await this.db.transaction([storeName], 'readonly').objectStore(storeName);
    } catch (error) {
      if (error.name === 'NotFoundError') {
        // Store doesn't exist, create it in a separate transaction
        return new Promise((resolve, reject) => {
          const request = this.db.createObjectStore(storeName, { keyPath: 'id' });
          request.onsuccess = () => resolve();
          request.onerror = (e) => reject(e.target.error);
        });
      } else {
        throw error; // Re-throw other errors
      }
    }
  }

  async write(storeName, data) {
    await this._ensureStoreExists(storeName); // Ensure store exists before writing
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const request = store.put(data);
      request.onsuccess = () => resolve(true);
      request.onerror = (e) => reject(e.target.error);
    });
  }

  async read(storeName, id) {
    await this._ensureStoreExists(storeName); // Ensure store exists before reading
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }
}

export default IndexedDBHandler;
