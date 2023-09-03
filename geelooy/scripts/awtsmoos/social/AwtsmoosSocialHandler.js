/**
B"H
social media handler
**/

class AwtsmoosSocialHandler {
  constructor(baseEndpoint) {
    this.baseEndpoint = baseEndpoint;
  }

  fetchEntities(urlExtension) {
    return fetch(`${this.baseEndpoint}${urlExtension}`)
      .then(response => response.json())
      .catch(err => console.log('Error:', err));
  }

  displayEntities(entities, containerID, editHandler) {
    const entityList = document.getElementById(containerID);
    entities.forEach(entity => {
      const entityDiv = document.createElement("div");
      entityDiv.innerHTML = `<span>${entity.name || entity.title}</span>`;
      entityDiv.addEventListener('dblclick', function() {
        editHandler(entity, this);
      });
      entityList.appendChild(entityDiv);
    });
  }

  editEntity(entityId, newData, urlExtension) {
    return fetch(`${this.baseEndpoint}${urlExtension}/${entityId}`, {
      method: 'POST',
      body: JSON.stringify(newData)
    })
    .then(response => response.json())
    .catch(err => console.log('Error:', err));
  }

  // For /aliases
  fetchAliases(page = 1, pageSize = 10) {
    return this.fetchEntities(`/aliases?page=${page}&pageSize=${pageSize}`);
  }
  createAlias(aliasName) {
    return this.postData('/aliases', { aliasName });
  }

  // For /heichels
  fetchHeichels(page = 1, pageSize = 10) {
    return this.fetchEntities(`/heichels?page=${page}&pageSize=${pageSize}`);
  }
  createHeichel({name, description, aliasId, isPublic}) {
    return this.postData('/heichels', { name, description, aliasId, isPublic });
  }

  // For /heichels/:heichel/posts
  fetchPosts(heichel, page = 1, pageSize = 10) {
    return this.fetchEntities(`/heichels/${heichel}/posts?page=${page}&pageSize=${pageSize}`);
  }
  createPost(heichel, {title, content, aliasId}) {
    return this.postData(`/heichels/${heichel}/posts`, { title, content, aliasId });
  }

  /**
   * @function postData
   * @param {string} urlExtension - The specific celestial path within the labyrinth of endpoints.
   * @param {Object} data - The sacred elements that shall be manifested.
   * @description: This method sends a POST request, like a whispered prayer, to create new celestial entities within the digital cosmos.
   * @returns {Promise} - An eternal promise of creation or explanation.
   */
  postData(urlExtension, data) {
    return fetch(`${this.baseEndpoint}${urlExtension}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .catch(err => console.log('Error:', err));
  }

}

export default AwtsmoosSocialHandler;
