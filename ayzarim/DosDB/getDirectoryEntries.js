//B"H

var fs = require('fs').promises;
var path = require('path');

async function getDirectoryEntries(
  directoryPath,
  page = 1,
  pageSize = 60,
  filterBy=null,
  sortBy = 'alphabetical',
  order = 'asc',
  id,
  db
) {
  try {
    page = parseInt(page);
    pageSize = parseInt(pageSize);
    var startIndex = (page - 1) * pageSize;

    // Retrieve both files and directories
    let entries = await fs.readdir(directoryPath, { withFileTypes: true });
    if(filterBy  && typeof(filterBy) == "object") {
      try {
        var newEnt = [];
        for(var k of entries) {
          var g = await db.get(id, {
            propertyMap: filterBy
          });
          if(db.areAllKeysEqual(g,filterBy)) {
            newEnt.push(g)
          }

        }
        entries = newEnt;
      } catch(e){}
    }
    // Get stats for each entry in parallel
    entries = await Promise.all(entries.map(async (dirent) => {
      var entryPath = path.join(directoryPath, dirent.name);
      var stats = await fs.stat(entryPath);
      return {
        name: dirent.name,
        created: stats.birthtime,
        modified: stats.mtime
      };
    }));

    // Sort entries based on the sortBy and order parameters
    switch (sortBy) {
      case 'alphabetical':
        entries.sort((a, b) => order === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));
        break;
      case 'createdBy':
        entries.sort((a, b) => order === 'asc' ? a.created - b.created : b.created - a.created);
        break;
      case 'modifiedBy':
        entries.sort((a, b) => order === 'asc' ? a.modified - b.modified : b.modified - a.modified);
        break;
    }

    // Extract just the name for the final result
    var sortedNames = entries.map(entry => entry.name);

    // Apply pagination to the sorted names
    var paginatedNames = sortedNames.slice(startIndex, startIndex + pageSize);

    return paginatedNames;
  } catch (error) {
    console.error("Failed to process directory entries", error);
    return [];
  }
}

module.exports = getDirectoryEntries;
