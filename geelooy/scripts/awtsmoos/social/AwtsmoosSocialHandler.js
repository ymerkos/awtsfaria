/**
B"H
social media handler
**/
console.log("B\"H")
class AwtsmoosSocialHandler {
  constructor(baseEndpoint, subPath) {
    this.baseEndpoint = baseEndpoint;
    this.subPath = subPath || "";
  }

  async endpoint(
    path, {
      method = 'GET', 
      body = null, headers = {}
    } = {}
  ) {
   
    var params = body?
    new URLSearchParams(body)
    .toString():null;
    var realPath = this.baseEndpoint +
      this.subPath+ "/"+
      path;
      
    try {
      var response = await fetch(realPath, {
        method,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          ...headers,
        },
        body:params,
      });
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return await response.json();
    } catch (error) {
      console.error('Fetch error: ', error);
      throw error;
    }
  }

  async fetchEntities(endpoint, options={}) {
    return await this
    .endpoint(endpoint, {
      method: 'GET',...options
    });
  }

  async createEntity({ entityType, newEntityData }) {
    return await this.endpoint(entityType, {
      method: 'POST', body: newEntityData
    });
  }

  async editEntity({entityId, entityType, updatedData}) {
    console.log("updating",updatedData)
	var cleansedObj = {};
	if(updatedData && typeof(updatedData) == "object") 
		for(var k in updatedData) {
			if(
				updatedData[k] ||
				updatedData[k] === 0
			) {
				cleansedObj[k] = 
				updatedData[k];
			}
		}
    return await this.endpoint(
      entityType+"/"+entityId, 
      { method: 'PUT', body: cleansedObj }
    );
  }

  async deleteEntity(endpoint) {
    return await this.endpoint(endpoint, { method: 'DELETE' });
  }






  createAlias(aliasName) {
    return this.postData('/aliases', { aliasName });
  }

  //for /heichelos/:heichel
  async getHeichel(heichel) {
    return await this.fetchEntities(`/heichelos/${heichel}`)
  }

  async getPost(
    postId

  ) {
    return await 
    this.fetchEntities(
      "/posts/"+
      postId
      

    )

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
