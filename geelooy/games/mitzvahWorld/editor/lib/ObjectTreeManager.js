//B"H
import Heeooleey from "https://awtsmoos.com/games/mitzvahWorld/ckidsAwtsmoos/chayim/heeooleey.js";
export default class ObjectTreeManager extends Heeooleey {
    constructor(scene) {
        super()
        this.scene = scene;
        this.sceneObjects = [];
        this.rootObjects = [];
        this.selectedObject = null;
        this.objectTree = document.createElement('ul');
        this.objectTree.classList.add('object-tree');
        this.minimizedCategories = new Set(); // Track minimized categories by their dataset IDs
        this.initObjectTree();
    }

    initObjectTree() {
        this.clearObjectTree();
        document.body.appendChild(this.objectTree);
    }

    deselectAll() {
        var sel = Array.from(this.objectTree.querySelectorAll(".selected"))
        sel.forEach(w => w.classList.remove("selected"))
    }

    traverse(cb) {
        // Define a recursive function to traverse each child and sub-child
        const traverseChildren = (li) => {
            // Call the callback function with the current li element
            cb(li);
    
            // Traverse each child of the current li element
            Array.from(li.children).forEach(child => {
                // If the current child has further children, recursively traverse them
                if (child.children.length > 0) {
                    traverseChildren(child);
                }
            });
        };
    
        // Iterate over each root object and start traversing from it
        this.rootObjects.forEach(li => {
            traverseChildren(li);
        });
    }


    clearObjectTree() {
        this.objectTree.innerHTML = '';
    }

    addRootObject(mesh) {
        this.scene.add(mesh);
        this.sceneObjects.push(mesh);
        
        const li = this.addToObjectTree(mesh, this.objectTree);
        this.rootObjects.push(li);
        const toggleBtn = this.createToggleBtn('-', li.dataset.id); // Pass unique dataset ID
        toggleBtn.addEventListener('click', () => {
            this.toggleChildrenVisibility(li);
        });

        var categ = li.querySelector(".categ")
        if(categ) {
            categ.prepend(toggleBtn)
        }
        this.traverseAndAddChildren(mesh, li);
    }

    addToObjectTree(object, parentElement, isSubcategory = false) {
        const id = this.generateUniqueId(); // Generate unique dataset ID
        const li = document.createElement('li');
        const div = this.createDiv(object);
        var self = this;
        li.dataset.id = id; // Add unique dataset ID
        li.appendChild(div);
        parentElement.appendChild(li);
        if (isSubcategory) {
            li.classList.add('sub-category');
        }
        return li;
    }

    generateUniqueId() {
        return Math.random().toString(36).substr(2, 9); // Generate unique dataset ID
    }

    _events = {}
    fireEvent(nm, data) {


    }


    createDiv(object) {
        const div = document.createElement('div');
        var titl = document.createElement("div")
        div.className = "categ"
        div.appendChild(titl)
        titl.textContent = object.name || object.userData.name || object.userData.id;

        object.userData.awtsmoosEl = titl;
        var self = this;
        titl.onclick = () => {
            self.ayshPeula("clicked", object)
        };
        titl.classList.add('object-name');
        return div;
    }

    createToggleBtn(text, id) { // Pass unique dataset ID
        const toggleBtn = document.createElement('button');
        toggleBtn.textContent = text;
        toggleBtn.dataset.id = id; // Add unique dataset ID
        toggleBtn.classList.add('toggle-btn');
        return toggleBtn;
    }

    toggleChildrenVisibility(parentElement) {
        const isMinimized = !parentElement.classList.contains('minimized'); // Negate for clear state setting
        parentElement.classList.toggle('minimized');
        const toggleBtn = parentElement.querySelector('.toggle-btn');
        toggleBtn.textContent = isMinimized ? '+' : '-';
        parentElement.dataset.minimized = isMinimized ? 'true' : 'false'; // Explicit state update
       /* console.log('isMinimized:', isMinimized);
        console.log('parentElement style.display?:', parentElement.style.display); // Log display style
        */
        this.traverseAndUpdateVisibility(parentElement, isMinimized);
      
    }
    ok(){
        console.log(123123)
    }

    
    
    traverseAndUpdateVisibility(parentElement, isParentMinimized) {
      
        parentElement.childNodes.forEach(child => {

            
            if (child.tagName === 'LI') {
                const isChildSubcategory = child.classList.contains('sub-category');
                const initialMinimized = child.dataset.minimized === 'true';
                const shouldBeVisible = !isParentMinimized



    
                child.style.display = shouldBeVisible ? 'block' : 'none';
                child.classList.toggle('minimized-subcategory', !shouldBeVisible); // Add class when minimized
                
                /*console.log("should",shouldBeVisible)
                console.log('shouldBeVisible:', shouldBeVisible);
                console.log('child style.display:', child.style.display); // Log display style

                */
    
                // Recursively update visibility if the child has further children
                if (isChildSubcategory) {
                    this.traverseAndUpdateVisibility(child, initialMinimized);
                }
            }
        });
    }

    updateMinimizedCategories(id, isMinimized) { // Receive dataset ID
        if (isMinimized) {
            this.minimizedCategories.add(id);
        } else {
            this.minimizedCategories.delete(id);
        }
    }

    traverseAndAddChildren(parentObject, parentElement) {
        parentObject.children.forEach(child => {
            const li = this.addToObjectTree(child, parentElement, true);
            if (child.children.length > 0) {
                const toggleBtn = this.createToggleBtn('-', li.dataset.id); // Pass unique dataset ID
                toggleBtn.addEventListener('click', () => {
                    this.toggleChildrenVisibility(li);
                });
                var categ = li.querySelector(".categ")
                if(categ) {
                    categ.prepend(toggleBtn)
                }
                
                this.traverseAndAddChildren(child, li); // Recursively add children
            }
        });
    }

  
}
