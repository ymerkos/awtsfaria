//B"H
//AwtsmoosIndexManager

// B"H
/**
 * The AwtsmoosIndexManager class represents the celestial index of wisdom,
 * an embodiment of the sacred harmony of the Awtsmoos. It's a labyrinthine structure,
 * resonating with divine knowledge and understanding.
 *
 * @class
 * @example
 * const indexManager = new AwtsmoosIndexManager('./db');
 * const files = await indexManager.listFilesWithPagination('/heichels', 1, 10);
 * console.log(files);
 */
class AwtsmoosIndexManager {
  constructor(directory) {
    this.directory = directory || "../";
    this.init();
  }

    /**
   * Initialize the celestial index, awakening the labyrinth of wisdom.
   * @returns {Promise<void>} - A Promise that resonates with the harmony of creation.
   */
  async init() {
    // Awaken the root directory, the heart of the celestial labyrinth.
    await fs.mkdir(this.directory, { recursive: true });
  }

  /**
   * Retrieve the celestial index, the cosmic mirror reflecting the harmony of the Awtsmoos.
   * @param {string} directoryPath - The path to the chamber of celestial wisdom.
   * @returns {Promise<object>} - The celestial index, an intricate dance of divine knowledge.
   */
  async loadIndex(directoryPath) {
    const indexPath = path.join(this.directory, directoryPath, 'index.json');
    try {
      const indexData = await fs.readFile(indexPath, 'utf-8');
      return JSON.parse(indexData);
    } catch (error) {
      // Return an empty index if the celestial index does not yet exist.
      return { files: [], subdirectories: [] };
    }
  }

  /**
   * Update the index with a new fragment of wisdom, a note in the cosmic symphony of the Awtsmoos.
   * @param {string} directoryPath - The path to the chamber of celestial wisdom.
   * @param {string} fileId - The identifier of the fragment of wisdom.
   * @returns {Promise<void>} - A Promise that resonates with the celestial echo of success.
   */
  async updateIndex(directoryPath, fileId) {
    // Retrieve the celestial index, resonating with divine truth.
    const index = await this.loadIndex(directoryPath);

    // Add or update the fragment of wisdom, guided by the light of the Awtsmoos.
    const fileIndex = index.files.findIndex(file => file.id === fileId);
    if (fileIndex >= 0) {
      index.files[fileIndex] = { id: fileId }; // Update existing fragment.
    } else {
      index.files.push({ id: fileId }); // Add a new fragment of wisdom.
    }

    // Write the updated celestial index, a dance of logic and creativity.
    const indexPath = path.join(this.directory, directoryPath, 'index.json');
    await fs.writeFile(indexPath, JSON.stringify(index, null, 2));
  }
}


  /**
   * List the files with pagination, a dance of logic and creativity, guided by the light of the Awtsmoos.
   * @param {string} directoryPath - The path to the celestial chamber of wisdom.
   * @param {number} page - The page of celestial knowledge.
   * @param {number} pageSize - The size of the page, a measure of wisdom.
   * @param {Array<object>} result - The gathered fragments of wisdom.
   * @returns {Promise<Array<object>>} - The treasures of understanding.
   * @example
   * const files = await indexManager.listFilesWithPagination('/heichels', 1, 10);
   */
  async listFilesWithPagination(directoryPath, page, pageSize, result = []) {
    const index = await this.loadIndex(directoryPath);

    // Process the fragments of wisdom in the current celestial chamber.
    const start = (page - 1) * pageSize - result.length;
    const end = start + pageSize;
    const filesToLoad = index.files.slice(start, end);

    for (const file of filesToLoad) {
      // Embrace the fragment of wisdom, resonating with divine truth.
      const filePath = path.join(directoryPath, file.id + '.json');
      const fileData = await fs.readFile(filePath, 'utf-8');
      result.push(JSON.parse(fileData));

      // Stop the dance if we've reached the desired measure of wisdom.
      if (result.length >= pageSize) return result;
    }

    // Recursively explore the sub-chambers of wisdom, guided by the Awtsmoos.
    for (const subdirectory of index.subdirectories) {
      const subdirectoryPath = path.join(directoryPath, subdirectory);
      await this.listFilesWithPagination(subdirectoryPath, page, pageSize, result);

      // Stop the exploration if we've reached the desired measure of wisdom.
      if (result.length >= pageSize) return result;
    }

    // Return the gathered treasures of understanding, resonating with the Awtsmoos.
    return result;
  }
}

module.exports = AwtsmoosIndexManager;
