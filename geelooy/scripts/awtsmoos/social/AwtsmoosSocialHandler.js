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
}

export default AwtsmoosSocialHandler;
