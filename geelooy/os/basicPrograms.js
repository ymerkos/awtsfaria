//B"H

var programs = {
  awtsmoosTextEdit(fileName, content, system) {
  // Create the root container for the editor
  const editorContainer = document.createElement('div');
  editorContainer.classList.add('awtsmoos-editor-container');

  // Create the menu bar
  const menuBar = document.createElement('div');
  menuBar.classList.add('menu-bar');
  
  // Create the File menu
  const fileMenu = document.createElement('div');
  fileMenu.classList.add('menu-item');
  fileMenu.textContent = 'File';
  const fileOptions = document.createElement('div');
  fileOptions.classList.add('file-options');
  fileOptions.innerHTML = `
    <div>New</div>
    <div>Open</div>
  `;
  fileMenu.appendChild(fileOptions);
  
  // Create the Edit menu
  const editMenu = document.createElement('div');
  editMenu.classList.add('menu-item');
  editMenu.textContent = 'Edit';
  const editOptions = document.createElement('div');
  editOptions.classList.add('edit-options');
  editOptions.innerHTML = `
    <div>Undo</div>
    <div>Redo</div>
    <div>Cut</div>
    <div>Copy</div>
    <div>Paste</div>
  `;
  editMenu.appendChild(editOptions);
  
  menuBar.appendChild(fileMenu);
  menuBar.appendChild(editMenu);

  // Create the content editable div
  const contentDiv = document.createElement('div');
  contentDiv.classList.add('content-editable');
  contentDiv.setAttribute('contenteditable', 'true');
  contentDiv.textContent = content;

  // Create the filename header
  const fileNameHeader = document.createElement('div');
  fileNameHeader.classList.add('file-name-header');
  fileNameHeader.textContent = fileName;

  // Append elements to the editor container
  editorContainer.appendChild(menuBar);
  editorContainer.appendChild(fileNameHeader);
  editorContainer.appendChild(contentDiv);

  // Add CSS styles dynamically
  const style = document.createElement('style');
  style.textContent = `
    .awtsmoos-editor-container {
      width: 80%;
      margin: 0 auto;
      font-family: Arial, sans-serif;
    }

    .menu-bar {
      background-color: #333;
      color: white;
      padding: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .menu-item {
      cursor: pointer;
      position: relative;
    }

    .menu-item:hover {
      color: #ff9900;
    }

    .file-options, .edit-options {
      display: none;
      background-color: #444;
      position: absolute;
      top: 30px;
      left: 0;
      min-width: 100px;
      border-radius: 5px;
    }

    .menu-item:hover .file-options, .menu-item:hover .edit-options {
      display: block;
    }

    .file-options div, .edit-options div {
      padding: 5px;
      cursor: pointer;
    }

    .file-options div:hover, .edit-options div:hover {
      background-color: #666;
    }

    .content-editable {
      margin-top: 20px;
      border: 1px solid #ddd;
      padding: 10px;
      min-height: 300px;
      background-color: #f9f9f9;
      box-sizing: border-box;
      font-size: 16px;
      line-height: 1.6;
    }

    .file-name-header {
      font-weight: bold;
      font-size: 18px;
      margin-top: 10px;
    }
  `;
  document.head.appendChild(style);

  // Return the editor container element
  return editorContainer;
}

}
var programsByExtensionDefaults = {
  ".txt": "awtsmoosTextEdit",
  ".js": "awtsmoosTextEdit",
  ".html":"awtsmoosTextEdit",
  ".css":"awtsmoosTextEdit"
}

export {
  programsByExtensionDefaults,
  programs
}
