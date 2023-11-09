//B"H
const fs = require('fs').promises;

async function getDirectoryEntries(
  directoryPath,
  page = 1,
  pageSize = 10,
  sortBy = 'alphabetical',
  order = 'asc'
) {
  try {
    page = parseInt(page);
    pageSize = parseInt(pageSize);
    const startIndex = (page - 1) * pageSize;
    let files = await fs.readdir(directoryPath, { withFileTypes: true });
    
    let entries = await Promise.all(files.map(async (file) => {
      if (file.isFile()) {
        const stats = await fs.stat(directoryPath + '/' + file.name);
        return {
          name: file.name,
          createdBy: stats.birthtime, // assuming birthtime is when file was created
          modifiedBy: stats.mtime
        };
      }
      return null;
    }));
    
    entries = entries.filter(entry => entry !== null);
    
    if (sortBy === 'alphabetical') {
      entries.sort((a, b) => {
        if(order === 'asc') {
          return a.name.localeCompare(b.name);
        } else {
          return b.name.localeCompare(a.name);
        }
      });
    } else if (sortBy === 'createdBy') {
      entries.sort((a, b) => order === 'asc' ? a.createdBy - b.createdBy : b.createdBy - a.createdBy);
    } else if (sortBy === 'modifiedBy') {
      entries.sort((a, b) => order === 'asc' ? a.modifiedBy - b.modifiedBy : b.modifiedBy - a.modifiedBy);
    }

    // Apply pagination
    const paginatedEntries = entries.slice(startIndex, startIndex + pageSize);
    return paginatedEntries;
  } catch (error) {
    console.error("Failed to process directory entries", error);
    return [];
  }
}

module.exports = getDirectoryEntries
