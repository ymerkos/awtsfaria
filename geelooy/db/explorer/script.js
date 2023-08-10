//B"H
const endpoint = "/db/"
let path = [];

async function loadPath() {
// Determine the ID to send to the server
let id;
if (path.length === 0 || path === "/") {
    id = "/";
    path = [];
} else {
    id = path.join('/');
}

// Create a new URLSearchParams object and set the parameters
const urlParams = new URLSearchParams();
urlParams.append("endpoint", "read");
urlParams.append("id", id);

// Fetch data from the server
const response = await fetch(endpoint, {
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: urlParams.toString()
});
const res = await response.json();

// Check for an error message
if (res.status === 'error' || res.error) {
    console.log("Error")
    alert('Error: ' + (res.message||res.error));
    return;
}
    var breadcrumbElement = document.getElementById("breadcrumb")
    breadcrumbElement.innerHTML = '';
    const data = res.record;
    // Create the root breadcrumb
    const rootCrumb = document.createElement('a');
        rootCrumb.href = '#';
        rootCrumb.textContent = 'root';
        rootCrumb.addEventListener('click', () => navigateTo(0));
        breadcrumbElement.appendChild(rootCrumb);

        if(path.forEach)
        // Create the other breadcrumbs
        path.forEach((segment, index) => {
            // Create the separator
            const separator = document.createTextNode(' / ');
            breadcrumbElement.appendChild(separator);

            // Create the breadcrumb
            const crumb = document.createElement('a');
            crumb.href = '#';
            crumb.textContent = segment;
            crumb.addEventListener('click', (e) => {
                e.preventDefault();
                navigateTo(index);
            });
            breadcrumbElement.appendChild(crumb);


            // Add a Delete button
            if (index === path.length - 1) { // only add to the last crumb
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete current directory';
                deleteButton.style.backgroundColor = 'red';
                deleteButton.addEventListener('click', () => {
                    deleteFileOrFolder().then(() => {
                        // Navigate to parent directory or root after deletion
                        navigateTo(index === 0 ? 0 : index - 1);
                    });
                });
                breadcrumbElement.appendChild(deleteButton);
            }
        });
    // Update contents
    const contentsElement = document.getElementById('contents');
    contentsElement.innerHTML = '';
    if (Array.isArray(data)) {
        // Directory
        data.forEach(item => {
            const div = document.createElement('div');
            div.classList.add('dir');
            div.textContent = item;
            div.addEventListener('click', () => {
                path.push(item);
                loadPath();
            });
            contentsElement.appendChild(div);
        });
    } else {
        // File
        const div = document.createElement('div');
        div.classList.add('file');
        var cont = typeof(data) == "object" 
            ? JSON.stringify(data, null, 4) : data; // Stringify JSON with indentation;

            
        div.textContent = cont;
        div.contentEditable = true;
        contentsElement.appendChild(div);
        // Add a Save button
        const button = document.createElement('button');
        button.textContent = 'Save';
        button.addEventListener('click', saveFile);
        contentsElement.appendChild(button);


        // Add a Delete button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.style.backgroundColor = 'red';
        deleteButton.addEventListener('click', deleteFileOrFolder);
        contentsElement.appendChild(deleteButton);
    }
}

async function saveFile() {
    const urlParams = new URLSearchParams();
    urlParams.append("endpoint", "update");
    urlParams.append("id", path.join('/'));
    const editedContent = document.querySelector('#contents .file').textContent;
    try {
        const record = JSON.parse(editedContent); // Try to parse the edited content as JSON
        urlParams.append("record", JSON.stringify(record));
    } catch (err) {
        alert('The edited content is not valid JSON.');
        return;
    }
    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: urlParams.toString()
    });
    const res = await response.json();
    if (res.status === 'error') {
        alert('Error: ' + res.message);
    } else {
        alert('File saved successfully.');
    }
}

function navigateTo(index) {
    const newPath = path.slice(0, index + 1);
    path = newPath;
    if(index == 0) path = "/"
    loadPath();
}



async function deleteFileOrFolder() {
    const urlParams = new URLSearchParams();
    urlParams.append("endpoint", "delete");
    urlParams.append("id", path.join('/'));

    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: urlParams.toString()
    });
    const res = await response.json();

    if (res.status === 'error') {
        alert('Error: ' + res.message);
    } else {
        alert('File or folder deleted successfully.');
        navigateTo(path.length - 2); // Refresh the parent directory
    }
}

    // New function for creating file or folder
async function createFileOrFolder(isFile) {
    const name = prompt("Enter name of the " + (isFile ? "file" : "folder"));
    if (!name) return;

    // Append the new item to the path
    path.push(name);
    const urlParams = new URLSearchParams();
    urlParams.append("endpoint", "create");
    urlParams.append("id", path.join('/'));
    urlParams.append("record", isFile ? "{}" : ""); // Files are created as empty JSON objects, and folders as empty arrays

    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: urlParams.toString()
    });
    const res = await response.json();

    if (res.status === 'error') {
        alert('Error: ' + res.message);
        // Remove the item from the path if creating failed
        path.pop();
    } else {
        if(isFile) {
            loadPath();
        } else {
            // If a folder was created, refresh the parent directory
            path.pop();
            loadPath();
        }
    }
}

// Attach the new function to the buttons
document.getElementById("newFile").addEventListener('click', () => createFileOrFolder(true));
document.getElementById("newFolder").addEventListener('click', () => createFileOrFolder(false));

// Load root on startup
loadPath();



// Add this before the loadPath() function call in the script
document.getElementById("importDirectory").addEventListener('click', importDirectory);

// Define the importDirectory function
async function importDirectory() {
    // Prompt the user to select a directory
    const options = { type: 'openDirectory' };
    const directoryHandle = await window.showDirectoryPicker(options);
    
    // Fetch and display the contents of the selected directory
    try {
        await traverseDirectory(directoryHandle, path);
        loadPath();
    } catch (error) {
        console.log('Error importing directory: ' + error.message);
    }
}

// Define the traverseDirectory function to recursively fetch and append directory contents
async function traverseDirectory(directoryHandle, currentPath = []) {
    const iterator = directoryHandle.entries();
    for await (const entry of iterator) {
        const isDirectory = entry[1].kind != "file";
        const name = entry[0];
        console.log("Got name",b=name,z=entry)
        const newPath = [...currentPath, name];

        if (isDirectory) {
            // Recurse into the subdirectory
            try{
                const subdirectoryHandle = await directoryHandle.getDirectoryHandle(
                    name
                );
                await traverseDirectory(subdirectoryHandle, newPath);
            } catch(e){
                console.log("Didnt work"+e+name)
                return;
            }
        } else {
            try {
                
                const fileHandle = await directoryHandle.getFileHandle(name);
                const file = await fileHandle.getFile();
                
                const content = await file.text();

                var pth  = newPath.join('/');
                var lst = pth.lastIndexOf(".json")
                if(lst > -1) {
                    pth = pth.substring(0,lst)
                }

                
                const urlParams = new URLSearchParams();  
                urlParams.append("endpoint", "create");
                urlParams.append("id", pth);
                urlParams.append("record", content); // Creating a file with content

                await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: urlParams.toString(),
                });
            } catch(e) {
                console.log("no "+e+name)
            }
        }
    }
}