//B"H

var programs = {
  awtsmoosTextEdit(fileName, content, system) {
  var id = "awtsmoosText";
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
      width: 100%;
      margin: 0 auto;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: #f4f4f9;
      border-radius: 10px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .menu-bar {
      background-color: #3b3b3b;
      color: white;
      padding: 12px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      font-size: 16px;
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
    }

    .menu-item {
      position: relative;
      padding: 8px 20px;
      cursor: pointer;
      margin-right: 20px;
      border-radius: 5px;
    }

    .menu-item:hover {
      background-color: #5a5a5a;
      color: #ffcc00;
    }

    .menu-item:focus {
      outline: none;
      box-shadow: 0 0 10px rgba(255, 204, 0, 0.6);
    }

    .file-options, .edit-options {
      display: none;
      background-color: #4a4a4a;
      position: absolute;
      top: 36px;
      left: 0;
      min-width: 120px;
      border-radius: 8px;
      z-index: 10;
    }

    .menu-item:hover .file-options, .menu-item:hover .edit-options {
      display: block;
      animation: fadeIn 0.2s ease-in-out;
    }

    .file-options div, .edit-options div {
      padding: 10px;
      cursor: pointer;
      font-size: 14px;
      color: #e0e0e0;
    }

    .file-options div:hover, .edit-options div:hover {
      background-color: #666666;
      color: white;
    }

    .content-editable {
      margin-top: 20px;
      border: 1px solid #ddd;
      padding: 15px;
      min-height: 300px;
      background-color: white;
      box-sizing: border-box;
      font-size: 16px;
      line-height: 1.6;
      border-radius: 8px;
      transition: all 0.3s ease;
    }

    .content-editable:focus {
      border-color: #ffcc00;
      box-shadow: 0 0 10px rgba(255, 204, 0, 0.6);
    }

    .file-name-header {
      font-weight: bold;
      font-size: 20px;
      margin-top: 15px;
      margin-bottom: 10px;
      color: #333;
      text-transform: uppercase;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
  `;
  style.classList.add(id);
  var sty = document.querySelector("."+id);
  if(!sty) 
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
