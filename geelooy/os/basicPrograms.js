//B"H

var programs = {
  awtsmoosTextEdit(fileName, content, system) {
    var id = "awtsmoosText";
    var self = {
      id,
      content: () => editorContainer.textContent,
      fileName: () => fileName
    }
    // Create the root container for the editor
    const editorContainer = document.createElement('div');
    editorContainer.classList.add('awtsmoos-editor-container');
    self.div = editorContainer;
    
    // Create the menu bar
    const menuBar = document.createElement('div');
    menuBar.classList.add('menu-bar');
    
    // Functionality map for File and Edit menus
    const fileFunctions = new Map([
      ['New', () => system?.newFile(self)],
      ['Open', () => system?.open(self)],
      ['Save', () => system?.save(self)]
    ]);
  
    const editFunctions = new Map([
      ['Undo', () => document.execCommand('undo')],
      ['Redo', () => document.execCommand('redo')],
      ['Cut', () => document.execCommand('cut')],
      ['Copy', () => document.execCommand('copy')],
      ['Paste', () => document.execCommand('paste')]
    ]);
  
    // Create the File menu
    const fileMenu = createMenu('File', fileFunctions);
  
    // Create the Edit menu
    const editMenu = createMenu('Edit', editFunctions);
  
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
    style.textContent = getCSS();
    style.classList.add(id);
    var sty = document.querySelector("."+id);
    if(!sty) 
      document.head.appendChild(style);
  
    // Return the editor container element
    return editorContainer;
  
    // Utility function to create a menu dynamically
    function createMenu(menuName, actionsMap) {
      const menu = document.createElement('div');
      menu.classList.add('menu-item');
      menu.textContent = menuName;
      
      const menuOptions = document.createElement('div');
      menuOptions.classList.add(`${menuName.toLowerCase()}-options`);
      actionsMap.forEach((func, action) => {
        const menuOption = document.createElement('div');
        menuOption.textContent = action;
        menuOption.addEventListener('click', func);
        menuOptions.appendChild(menuOption);
      });
      menu.appendChild(menuOptions);
      return menu;
    }
  
    // Returns the refined CSS as a string
    function getCSS() {
      return `
        .awtsmoos-editor-container {
          width: 100%;
          margin: 0 auto;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: #3a3a3a;
          border-radius: 12px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
          overflow: hidden;
        }
  
        .menu-bar {
          background-color: #333;
          color: white;
          padding: 15px;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          font-size: 18px;
          border-top-left-radius: 12px;
          border-top-right-radius: 12px;
          transition: all 0.4s ease-in-out;
        }
  
        .menu-item {
          position: relative;
          padding: 12px 25px;
          cursor: pointer;
          margin-right: 25px;
          border-radius: 8px;
          background-color: #444;
          transition: all 0.3s ease-in-out;
        }
  
        .menu-item:hover {
          background-color: #555;
          color: #ffcc00;
          transform: scale(1.1);
        }
  
        .menu-item:focus {
          outline: none;
          box-shadow: 0 0 15px rgba(255, 204, 0, 0.7);
        }
  
        .menu-item:hover .file-options, .menu-item:hover .edit-options {
          display: block;
          animation: fadeIn 0.3s ease-out;
        }
  
        .file-options, .edit-options {
          display: none;
          background-color: #3b3b3b;
          position: absolute;
          /*top: 5px;*/
          left: 0;
          min-width: 150px;
          border-radius: 10px;
          z-index: 10;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
        }
  
        .file-options div, .edit-options div {
          padding: 12px;
          cursor: pointer;
          font-size: 16px;
          color: #e0e0e0;
          transition: all 0.3s ease;
        }
  
        .file-options div:hover, .edit-options div:hover {
          background-color: #666;
          color: white;
          transform: scale(1.05);
        }
  
        .content-editable {
          margin-top: 25px;
          border: 2px solid #444;
          padding: 20px;
          min-height: 350px;
          background-color: #fff;
          box-sizing: border-box;
          font-size: 18px;
          line-height: 1.7;
          border-radius: 10px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
  
        .content-editable:focus {
          border-color: #ffcc00;
          box-shadow: 0 0 12px rgba(255, 204, 0, 0.6);
        }
  
        .file-name-header {
          font-weight: bold;
          font-size: 24px;
          margin-top: 20px;
          margin-bottom: 15px;
          color: #f1f1f1;
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
  
        @media (max-width: 768px) {
          .menu-bar {
            flex-direction: row;
            padding: 10px;
          }
          .menu-item {
            padding: 8px 18px;
            margin-right: 10px;
          }
          .file-options, .edit-options {
            left: -10px;
            min-width: 120px;
          }
        }
      `;
    }
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
