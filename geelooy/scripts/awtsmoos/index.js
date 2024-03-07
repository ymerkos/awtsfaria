//B"H
console.log("B\"H");
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/oyvedEdom.js')
  .then((registration) => {
      console.log('Service Worker Registered', registration);
      
  })
  .catch((error) => {
      console.log('Service Worker Registration Failed', error);
      
  });
}

/**
 * Awtsmoos - A wrapper class for IndexedDB operations
 * and more
 *
 * @example
 * // To write data
 * Awtsmoos.write('testStore', 'testKey', 'testValue')
 *   .then(() => console.log('Data written successfully'))
 *   .catch((error) => console.error('Error writing data: ', error));
 *
 * // To read data
 * Awtsmoos.read('testStore', 'testKey')
 *   .then((value) => console.log('Read value: ', value))
 *   .catch((error) => console.error('Error reading data: ', error));
 *
 * // Hebrew counterparts for write and read
 * Awtsmoos.Koysayv('testStore', 'testKey', 'testValue')
 *   .then(() => console.log('Data written successfully'))
 *   .catch((error) => console.error('Error writing data: ', error));
 *
 * Awtsmoos.Laynin('testStore', 'testKey')
 *   .then((value) => console.log('Read value: ', value))
 *   .catch((error) => console.error('Error reading data: ', error));
 */

class Awtsmoos {
    /**
     * Opens the IndexedDB and gets the object store
     *
     * @param {string} storeName - The name of the object store
     * @returns {Promise} - A promise that resolves with the object store
     */
    static getObjectStore(storeName) {
      return new Promise((resolve, reject) => {
        // Open (or create) the database
        let openRequest = indexedDB.open('myDatabase', 1);
  
        openRequest.onupgradeneeded = function(event) {
          // The database did not previously exist, so create object stores and indexes
          let db = event.target.result;
          db.createObjectStore(storeName);
        };
  
        openRequest.onsuccess = function(event) {
          // The database was successfully opened (or created)
          let db = event.target.result;
  
          // Start a new transaction with the object store
          let transaction = db.transaction([storeName], 'readwrite');
  
          // Get the object store
          let objectStore = transaction.objectStore(storeName);
  
          resolve(objectStore);
        };
  
        openRequest.onerror = function(event) {
          // There was an error opening (or creating) the database
          reject(event.target.error);
        };
      });
    }
  
    /**
     * Writes data to the IndexedDB
     *
     * @param {string} storeName - The name of the object store
     * @param {string} key - The key for the data
     * @param {any} value - The data to write
     * @returns {Promise} - A promise that resolves when the data is written
     */
    static write(storeName, key, value) {
      return this.getObjectStore(storeName).then((objectStore) => {
        // Write the data to the object store
        let request = objectStore.put(value, key);
  
        return new Promise((resolve, reject) => {
          request.onsuccess = resolve;
          request.onerror = () => reject(request.error);
        });
      });
    }

    /**
     * Deletes data from the IndexedDB
     *
     * @param {string} storeName - The name of the object store
     * @param {string} key - The key for the data to delete
     * @returns {Promise} - A promise that resolves when the data is deleted
     */
    static delete(storeName, key) {
      return new Promise((resolve, reject) => {
          this.getObjectStore(storeName).then((objectStore) => {
              // Delete the data from the object store
              let request = objectStore.delete(key);

              request.onsuccess = () => {
                  resolve();
              };

              request.onerror = () => {
                  reject(request.error);
              };
          }).catch(reject);
      });
  }
  
    /**
     * Reads data from the IndexedDB
     *
     *```javascript
    * @param {string} storeName - The name of the object store
     * @param {string} key - The key for the data to read
     * @returns {Promise} - A promise that resolves with the read data
     */
    static read(storeName, key) {
      return this.getObjectStore(storeName).then((objectStore) => {
        // Read the data from the object store
        let request = objectStore.get(key);
  
        return new Promise((resolve, reject) => {
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error);
        });
      });
    }


    /**
     * Retrieves all keys from the specified object store in IndexedDB.
     *
     * @param {string} storeName - The name of the object store
     * @returns {Promise<string[]>} - A promise that resolves with an array of keys
     */
    static getAllKeys(storeName) {
      return new Promise((resolve, reject) => {
          this.getObjectStore(storeName).then(objectStore => {
              let request = objectStore.getAllKeys();

              request.onsuccess = () => {
                  resolve(request.result);
              };

              request.onerror = () => {
                  reject(request.error);
              };
          }).catch(reject);
      });
  }

  
    /**
     * Writes data to the IndexedDB (Hebrew counterpart of write)
     *
     * @param {string} storeName - The name of the object store
     * @param {string} key - The key for the data
     * @param {any} value - The data to write
     * @returns {Promise} - A promise that resolves when the data is written
     */
    static Koysayv(storeName, key, value) {
      return this.write(storeName, key, value);
    }
  
    /**
     * Reads data from the IndexedDB (Hebrew counterpart of read)
     *
     * @param {string} storeName - The name of the object store
     * @param {string} key - The key for the data to read
     * @returns {Promise} - A promise that resolves with the read data
     */
    static Laynin(storeName, key) {
      return this.read(storeName, key);
    }
  }
 