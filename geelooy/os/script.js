//B"H
import AwtsmoosOS from "./awtsmoosOs.js";
var os = new AwtsmoosOS();
// Function to create a new window and add it to the desktop
function createWindow(title, content) {
    os.addWindow({title, content})
}

// Event listener for creating new files or folders
document.getElementById('desktop').addEventListener('contextmenu', (e) => {
    e.preventDefault();
    const newFile = prompt('Enter file name:');
    if (newFile) {
        createWindow(newFile, `<p>Content of ${newFile}</p>`);
    }
});

// Start button functionality
var selected = false;
document.getElementById('start-button').onclick = async () => {
    
    const menu = document.getElementById('start-menu');
    const menuItemsContainer = document.getElementById('menu-items');
    menuItemsContainer.innerHTML = "";
    if(selected) {
        selected = false;
        menu.style.display = 'none';
        return;
    }
    // Dynamic menu items as an object with functions
    const menuItems = {
        "New File":  async () => {
            const newFile = prompt('Enter file name:');
            if (newFile) {
                await os.createFile("desktop", newFile, `Content of ${newFile}`);
                
            }
        },
        "Import Files": async () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.multiple = true; // Allow multiple file selection
            input.style.display = 'none'; // Make input invisible
            document.body.appendChild(input);
            
            input.onchange = async () => {
                const files = Array.from(input.files);
                for (const file of files) {
                    const content = file.type.startsWith("application/") ||
                        file.type.startsWith('text/') 
                        ? await file.text() 
                        : await file.arrayBuffer(); // Handle binary/text files
                    console.log(file)
                    // Save each file to the desktop
                    await os.createFile("desktop", file.name, content);
                }
                alert(`${files.length} file(s) imported successfully!`);
                document.body.removeChild(input); // Clean up
            };
            
            input.click(); // Trigger file selection dialog
        },
        "Export All": async () => {
            const files = await os.db.getAllData("desktop"); // Get all files
            const exportContent = JSON.stringify(files, null, 2); // Prepare JSON content
            
            // Create a downloadable file
            const blob = new Blob([exportContent], { type: 'application/json' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = 'exported_files.json'; // Set default filename
            a.style.display = 'none';
            document.body.appendChild(a);
            
            a.click(); // Trigger download
            URL.revokeObjectURL(a.href); // Clean up
            document.body.removeChild(a);
            alert('All files exported successfully!');
        },
        "File Explorer": () => alert('Files selected!'),
        
    };

    // Generate dynamic menu items using map()
    Object.keys(menuItems).map(item => {
        const li = document.createElement('li');
        li.textContent = item;
        li.onclick = menuItems[item];
        menuItemsContainer.appendChild(li);
    });

    // Display the menu with animation
    menu.classList.remove('hidden');
    menu.style.display = 'block';

    function clickOutside(event) {
        if (!menu.contains(event.target) && event.target !== document.getElementById('start-button')) {
            menu.style.display = 'none';
            
            window.removeEventListener("click",clickOutside)
        }
    }
    // Close the menu when clicked outside
    window.addEventListener('click', clickOutside);
    
};

// Example folder interaction
document.getElementById('desktop').addEventListener('dblclick', (e) => {
    if (e.target.classList.contains('window')) {
        alert(`Opening ${e.target.querySelector('.window-header').textContent}`);
    }
});


const desktop = document.getElementById('desktop');

// Create overlay
const overlay = document.createElement('div');
overlay.id = 'drag-overlay';
overlay.className = 'drag-overlay';
overlay.textContent = 'Drop files here!';
desktop.appendChild(overlay);

// Drag and drop events
desktop.addEventListener('dragover', (event) => {
    event.preventDefault();
    desktop.classList.add('drag-over');
    overlay.classList.add('visible');
});

desktop.addEventListener('dragleave', (event) => {
    desktop.classList.remove('drag-over');
    overlay.classList.remove('visible');
});

desktop.addEventListener('drop', async (event) => {
    event.preventDefault();
    desktop.classList.remove('drag-over');
    overlay.classList.remove('visible');

    const files = Array.from(event.dataTransfer.files);
    if (files.length === 0) return;

    for (const file of files) {
        const content = file.type.startsWith('text/') 
            ? await file.text() 
            : await file.arrayBuffer(); // Handle binary/text files

        // Save each file to the desktop
        await os.createFile("desktop", file.name, content);
    }

    alert(`${files.length} file(s) uploaded successfully!`);
});

(async () => {
    await os.start();
    
})()

