class IndexedDBHandler {
  constructor(dbName) {
    this.dbName = dbName;
    this.db = null;
  }

  // Initialize the database
  async init() {
    if (this.db) return; // Prevent reinitialization if already done

    this.db = await new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName);

      request.onerror = (event) => {
        console.error("Error opening database:", event.target.error);
        reject(event.target.error);
      };

      request.onsuccess = (event) => {
        resolve(event.target.result);
      };

      request.onupgradeneeded = (event) => {
        console.log("Database created or upgraded");
        resolve(event.target.result);
      };
    });
  }

  // Ensure a store exists
  async ensureStore(storeName) {
      if (this.db.objectStoreNames.contains(storeName)) return;

      this.db.close(); // Close the database to allow upgrade
      this.db = await new Promise((resolve, reject) => {
        const request = indexedDB.open(this.dbName, this.db.version + 1);

        request.onerror = (event) => {
          console.error("Error upgrading database:", event.target.error);
          reject(event.target.error);
        };

        request.onsuccess = (event) => {
          resolve(event.target.result);
        };

        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          const store = db.createObjectStore(storeName, { keyPath: "id", autoIncrement: true });

          // Create an index on the key property
          store.createIndex("keyIndex", "key", { unique: true });

          console.log(`Object store '${storeName}' and index 'keyIndex' created`);
        };
      });
    }

  // Write a value to an object store
async write(storeName, key, value) {
  await this.ensureStore(storeName);

  return new Promise((resolve, reject) => {
    const transaction = this.db.transaction(storeName, "readwrite");
    const store = transaction.objectStore(storeName);

    // Prepare the data object with the key and value
    const data = { id: key, ...value }; // Use 'id' as keyPath if required by the store
    const request = store.put(data); // 'put' will insert or overwrite

    request.onerror = (event) => {
      console.error("Error writing data:", event.target.error);
      reject(event.target.error);
    };

    request.onsuccess = () => {
      console.log("Data written successfully");
      resolve();
    };
  });
}

  // Read a value from an object store by key
  async read(storeName, key) {
      await this.ensureStore(storeName);

      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(storeName, "readonly");
        const store = transaction.objectStore(storeName);

        // Access the index to search by key
        const index = store.index("keyIndex");
        const request = index.get(key);

        request.onerror = (event) => {
          console.error("Error reading data:", event.target.error);
          reject(event.target.error);
        };

        request.onsuccess = (event) => {
          resolve(request.result ? request.result.value : null); // Return the value if found, otherwise null
        };
      });
    }

  // Get all keys from an object store
  async getAllKeys(storeName) {
    await this.ensureStore(storeName);
  
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(storeName, "readonly");
      const store = transaction.objectStore(storeName);
      const request = store.getAllKeys(); // Fetch all keys
  
      request.onerror = (event) => {
        console.error("Error fetching keys:", event.target.error);
        reject(event.target.error);
      };
  
      request.onsuccess = () => {
        console.log("Keys retrieved successfully:", request.result);
        resolve(request.result);
      };
    });
  }

  // Get all key-value pairs from a specific object store
  async getStore(storeName) {
    await this.ensureStore(storeName);

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(storeName, "readonly");
      const store = transaction.objectStore(storeName);

      const results = [];
      const request = store.openCursor();

      request.onerror = (event) => {
        console.error("Error reading store data:", event.target.error);
        reject(event.target.error);
      };

      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          results.push({ key: cursor.key, value: cursor.value });
          cursor.continue();
        } else {
          resolve(results);
        }
      };
    });
  }
}

      export default IndexedDBHandler
