//B"H

// IndexedDB Handler Class
class IndexedDBHandler {
  constructor(dbName) {
    this.dbName = dbName;
  }

  async init() {
    this.db = await new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        db.createObjectStore('keys', { keyPath: 'id' });
        resolve(db);
      };
    });
  }

  async write(storeName, data) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName); // Get the object store

      // Check if the object store exists.  If not, create it.
      try {
          store.put(data); //This will throw an error if store doesn't exist.
      } catch (error) {
          if (error.name === 'NotFoundError') {
              // Create the object store within the transaction
              const db = tx.db; // get the database
              const newStore = db.createObjectStore(storeName, { keyPath: 'id' }); //Added keyPath for consistency
              newStore.put(data);
          } else {
              //Handle other errors
              reject(error);
              return;
          }
      }


      tx.oncomplete = () => resolve(true);
      tx.onerror = (e) => reject(e.target.error); // More informative error handling
    });
  }

  async read(storeName, id) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeName, 'readonly');
      const request = tx.objectStore(storeName).get(id);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
}

export default IndexedDBHandler;
