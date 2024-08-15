//B"H

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
document.getElementById('start-button').onclick = async () => {
    const newFile = prompt('Enter file name:');
    if (newFile) {
        await os.createFile("desktop", newFile + ".txt", `<p>Content of ${newFile}</p>`);
        
    }
};

// Example folder interaction
document.getElementById('desktop').addEventListener('dblclick', (e) => {
    if (e.target.classList.contains('window')) {
        alert(`Opening ${e.target.querySelector('.window-header').textContent}`);
    }
});

(async () => {
    await os.start();
    
    // Create an initial example window
    createWindow("ok", "asdf");
    createWindow("awow","2raa2")
})()

