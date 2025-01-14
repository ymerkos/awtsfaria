//B"H
import codeify from "/scripts/awtsmoos/coding/make.js";
var programs = {
  awtsmoosTextEdit({
    fileName, 
    content,
    system,
    extension
  } = {}) {
    
    var id = "awtsmoosText";
    var coded = null
    var self = {
      id,
      content: () => contentDiv.innerText,
      fileName: () => fileName,
      coded: () => coded,
      onresize() {
        coded?.init()
      }
    }
    console.log(fileName,self.fileName())
    
    var map = {
      ".js": "javascript",
      ".html":"html",
      ".css":"css"
    }
    var type = map[extension];
    
    
    // Create the root container for the editor
    const editorContainer = document.createElement('div');
    editorContainer.classList.add('awtsmoos-editor-container');
    self.div = editorContainer;
    
    // Create the menu bar
    const menuBar = document.createElement('div');
    menuBar.classList.add('menu-bar');
    window.customSaveFunction = () => system?.save(self);
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

      const editFunctions2 = new Map([
      ['Undo', () => document.execCommand('undo')],
      ['asdf', () => document.execCommand('redo')],
      ['Cut', () => document.execCommand('cut')],
      ['Copy', () => document.execCommand('copy')],
      ['Paste', () => document.execCommand('paste')]
    ]);

    var awtsmoosFuncs = new Map([
      ['Import', () => {}],
      ['Export', () => {}]
    ]);
    
    
  
    // Create the File menu
    const fileMenu = createMenu('File', fileFunctions);
  
    // Create the Edit menu
    const editMenu = createMenu('Edit', editFunctions);
    
    
    menuBar.appendChild(fileMenu);
    menuBar.appendChild(editMenu);
    
    if(extension == ".js") {
      var run = async () => {
        var code = self.content();
        try {
          eval(`//B"H
          (async () => {
            ${code}  
          })()`);
        } catch(e) {

        }
      };
      window.customRunFunction = run;
      awtsmoosFuncs.set("Run", run)
    }

    var awtsmoosMenu = createMenu("Awtsmoos", awtsmoosFuncs);
    
    menuBar.appendChild(awtsmoosMenu);
    
  
    // Create the filename header
    const fileNameHeader = document.createElement('div');
    fileNameHeader.classList.add('file-name-header');
    fileNameHeader.textContent = fileName;


  const contentDiv = document.createElement('div');
  // Create the content editable div
  contentDiv.classList.add('content-editable');
  contentDiv.setAttribute('contenteditable', 'true');
  contentDiv.innerText = content;

  const contentHolder = document.createElement('div');
  // Create the content editable div
  contentHolder.classList.add('content-holder');
  contentHolder.appendChild(contentDiv)
    
    // Append elements to the editor container
    editorContainer.appendChild(menuBar);
    editorContainer.appendChild(fileNameHeader);
    editorContainer.appendChild(contentHolder);

    
    if(type) {
      coded =codeify(contentDiv, type)
     // console.log(coded,"Coded",contentDiv);
      window.coded=coded;
      coded?.parent?.focus()
      contentDiv?.focus()
    }
    
    // Add CSS styles dynamically
    const style = document.createElement('style');
    style.textContent = getCSS();
    style.classList.add(id);
    var sty = document.querySelector("."+id);
    if(!sty) 
      document.head.appendChild(style);
  
  
    document.body.appendChild(editorContainer)
    var fileHeaderHeight = fileNameHeader.offsetHeight;
    var menuBarHeight = menuBar.offsetHeight;
    editorContainer.parentNode.removeChild(editorContainer);
    function calculateContentHeight() {
      var heightAmount = fileHeaderHeight + 
            menuBarHeight;
      var heightStr = `calc(100% - ${
            heightAmount
          }px);`
      contentHolder.style.cssText = "height:"+heightStr;
    }
    calculateContentHeight()
    // Utility function to create a menu dynamically
    function createMenu(menuName, actionsMap) {
      const menu = document.createElement('div');
      menu.classList.add('menu-item');
      menu.textContent = menuName;
      
      const menuOptions = document.createElement('div');
      menuOptions.classList.add(`awtsmoos-options`);
      actionsMap.forEach((func, action) => {
        const menuOption = document.createElement('div');
        menuOption.textContent = action;
        menuOption.addEventListener('click', func);
        menuOptions.appendChild(menuOption);
      });
    
      let isMenuVisible = true;  // Track the visibility state
    
      menu.addEventListener('click', function (e) {
        e.stopPropagation(); // Prevent the click event from propagating to the document
        if (isMenuVisible) {
          menuOptions.style.display = 'none';  // Hide the menu
          isMenuVisible = false;
        } else {
          menuOptions.style.display = 'block'; // Show the menu again
          isMenuVisible = true;
        }
      });
    
      // Show menu when hovering
      menu.addEventListener('mouseover', function () {
        if (!isMenuVisible) {
          menuOptions.style.display = 'block'; // Show it again when hovering over
          isMenuVisible = true;
        }
      });
    
      // Hide menu when mouse leaves
      menu.addEventListener('mouseleave', function () {
        if (isMenuVisible) {
          menuOptions.style.display = 'none'; // Hide the menu if it's still visible
          isMenuVisible = false;
        }
      });
    
      menu.appendChild(menuOptions);
      return menu;
    }
  
    // Returns the refined CSS as a string
    function getCSS() {
      return `
        /* Refined CSS */
      .awtsmoos-editor-container {
        width: 100%;
        height: 100%;
        margin: 0 auto;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
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

      .content-holder {
        overflow:scroll;
      }  
      
      .menu-item {
        position: relative;
        padding: 12px 25px;
        cursor: pointer;
        z-index: 23;
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
      
      .menu-item:hover .awtsmoos-options {
        display: block;
        animation: fadeIn 0.3s ease-out;
      }
      
      .awtsmoos-options {
        display: none;
        background-color: #3b3b3b;
        position: absolute;
        left: 0;
        min-width: 150px;
        border-radius: 10px;
        z-index: 10;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
      }
      
      .awtsmoos-options div {
        padding: 12px;
        cursor: pointer;
        font-size: 16px;
        color: #e0e0e0;
        transition: all 0.3s ease;
      }
      
      .awtsmoos-options div:hover {
        background-color: #666;
        color: white;
        transform: scale(1.05);
      }
      
      .content-editable {
        border: 2px solid #444;
        padding: 20px;
        
        overflow: scroll;
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
        padding: 10px 5px;
        background: #002d55;
        color: #f1f1f1;
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
        .awtsmoos-options {
          left: -10px;
          min-width: 120px;
        }
      }

      `;
    }
    return self;
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
