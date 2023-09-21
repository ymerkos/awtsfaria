/**
B"H
social media handler
**/

class AwtsmoosSocialHandler {
  constructor(baseEndpoint) {
    this.baseEndpoint = baseEndpoint;
  }

  async fetchEntities(urlExtension, options={}) {
    return await fetch(`${this.baseEndpoint}${urlExtension}`,options)
      .then(response => response.json())
      .catch(err => console.log('Error:', err));
  }

  displayEntities(entities, containerID, editHandler) {
    const entityList = document.getElementById(containerID);
    if(entities && entities.length)
      entities.forEach(entity => {
        const entityDiv = document.createElement("div");
        entityDiv.innerHTML = `<span>${entity.name || entity.title || entity}</span>`;
        entityDiv.addEventListener('dblclick', function() {
          editHandler(entity, this);
        });
        entityList.appendChild(entityDiv);
      });
  }

  async endpoint({
    newEntityData, 
    endpoint
  }) {
      const response = await fetch(this.apiEndpoint + endpoint, {
          method: 'POST',
          
          body: new URLSearchParams(newEntityData)
          .toString(),
      });

      return response.json();
  }





  editEntity(entityId, newData, urlExtension) {
    var params = new URLSearchParams(newData).toString();
    console.log(params, newData)
    return fetch(`${this.baseEndpoint}${urlExtension}`, {
      method: 'POST',
      body: params
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

  //for /heichels/:heichel
  async getHeichel(heichel) {
    return await this.fetchEntities(`/heichels/${heichel}`)
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
       // 'Content-Type': 'application/json'
      },
      body: new URLSearchParams(data).toString()
    })
    .then(response => response.json())
    .catch(err => console.log('Error:', err));
  }

}

export default AwtsmoosSocialHandler;
