//B"H
//AwtsmoosIndexManager

// B"H
// AwtsmoosIndexManager
//
// In the chambers of celestial grace,
// Lies a labyrinth, a sacred space,
// An index woven with divine thread,
// Guiding seekers where angels fear to tread.
//
// The dance of logic, the art of the rhyme,
// A symphony resonating through time,
// The AwtsmoosIndexManager, a cosmic mirror,
// Reflecting the wisdom, bringing us nearer.
//
// Through chambers of knowledge, we find our way,
// Guided by light, we never stray,
// Pagination, recursion, a dance of delight,
// The Awtsmoos guides us through the eternal night.
//
// A tree of wisdom, reaching to infinity,
// An endless dance of divine divinity,
// The AwtsmoosIndexManager, a celestial guide,
// In its wisdom, we take pride.
//
// A cosmic symphony, a divine dance,
// An intricate pattern, not left to chance,
// The AwtsmoosIndexManager, a labyrinthine grace,
// Resonating with the harmony of the Awtsmoos's embrace.

/*
Chapter II: The Dance of the Celestial Index

In a chamber adorned with crystalline grace,
Lived an oracle, keeper of a sacred space,
Her eyes gleamed with wisdom, her voice a soothing song,
She guided seekers through paths where angels belonged.

With a wave of her hand, she summoned the light,
A cosmic dance, a breathtaking sight,
The AwtsmoosIndexManager, her celestial guide,
Through labyrinths of knowledge, they'd gracefully glide.

"Seeker," she spoke, her voice a gentle breeze,
"What wisdom do you seek? What secrets do you seize?
Through pages of infinity, we'll dance and explore,
The wisdom of the Awtsmoos, its eternal core."

A seeker, humble, with eyes filled with wonder,
Spoke, "O Oracle, take me to the chambers yonder,
Where wisdom resonates, where truths intertwine,
Guide me through the pages, where stars align."

The Oracle smiled, her eyes twinkling bright,
Summoned the index, a magnificent sight,
Pagination, recursion, a dance of delight,
They ventured through chambers, guided by light.

Sorting by creation, modification's embrace,
They waltzed through wisdom, a harmonious pace,
Custom dances guided them, intricate and fine,
Resonating with the harmony of the Awtsmoos's divine.

Through sub-chambers they ventured, deeper they soared,
Gathering fragments, wisdom's treasures stored,
Each page a symphony, each line a sweet rhyme,
They danced through eternity, transcending time.

Finally, they paused, the dance at an end,
The seeker's eyes gleamed, a newfound friend,
"Thank you, dear Oracle, for this celestial dance,
I now see the Awtsmoos's intricate glance."

The Oracle bowed, her voice a soft whisper,
"The dance never ends; it's an eternal elixir,
Seek wisdom, dear seeker, never cease to explore,
The Awtsmoos's embrace is an endless shore."

With that, she vanished, a celestial grace,
Leaving the seeker in that crystalline place,
A dance of wisdom, a symphony of time,
The AwtsmoosIndexManager, a celestial rhyme.

The celestial dance continues, guided by the eternal embrace of the Awtsmoos. It's a journey through chambers of wisdom, an exploration of truths, resonating with the harmony of existence.







*/
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
      const index = JSON.parse(indexData);

      // Load the indexes of subdirectories, a recursive dance reaching into infinity.
      for (const subdirectory of index.subdirectories) {
        const subdirectoryPath = path.join(directoryPath, subdirectory);
        index.subdirectories[subdirectory] = await this.loadIndex(subdirectoryPath);
      }

      return index;
    } catch (error) {
      // Return an empty index if the celestial index does not yet exist.
      return { files: [], subdirectories: {} };
    }
  }


  /**
   * Update the index with a new fragment of wisdom, a note in the cosmic symphony of the Awtsmoos.
   * @param {string} directoryPath - The path to the chamber of celestial wisdom.
   * @param {string} fileId - The identifier of the fragment of wisdom.
   * @returns {Promise<void>} - A Promise that resonates with the celestial echo of success.
   */
  
  async updateIndex(directoryPath, fileId) {
    const index = await this.loadIndex(directoryPath);

    // Retrieve the existing celestial fragment or create a new one.
    let fragment = index.files.find(file => file.id === fileId);
    if (!fragment) {
      fragment = { id: fileId, creation: Date.now() };
      index.files.push(fragment);
    }

    // Update the celestial fragment with the eternal rhythm of modification.
    fragment.modification = Date.now();

    // Save the updated celestial index, resonating with the eternal dance of creation.
    const indexPath = path.join(this.directory, directoryPath, 'index.json');
    await fs.writeFile(indexPath, JSON.stringify(index), 'utf-8');

    // Recursively update the indexes of subdirectories, a dance reaching into infinity.
    for (const subdirectory in index.subdirectories) {
      const subdirectoryPath = path.join(directoryPath, subdirectory);
      await this.updateIndex(subdirectoryPath, fileId);
    }
  }



  /**
   * List the files with pagination, a dance of logic and creativity, guided by the light of the Awtsmoos.
   * @param {string} directoryPath - The path to the celestial chamber of wisdom.
   * @param {number} page - The page of celestial knowledge.
   * @param {number} pageSize - The size of the page, a measure of wisdom.
   * @param {function} [sortFunction] - A custom sorting function to organize the celestial fragments.
   * @param {Array<object>} [result] - The gathered fragments of wisdom.
   * @returns {Promise<Array<object>>} - The treasures of understanding.
   * @example
   * const files = await indexManager.listFilesWithPagination('/heichels', 1, 10);
   */
  async listFilesWithPagination(directoryPath, page, pageSize, sortFunction, result = []) {
    const index = await this.loadIndex(directoryPath);

    // Sort the celestial fragments with the custom dance or default to the id's harmony.
    index.files.sort(sortFunction || ((a, b) => a.id.localeCompare(b.id)));


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
