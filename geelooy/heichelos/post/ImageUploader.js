//B"H
class ImageUploader {
    constructor(galleryContainer) {
        this.galleryContainer = galleryContainer;
        this.galleryContainer.style.display = "none";
        this.injectCSS()
    }

    uploadImages() {
        return new Promise((resolve) => {
            const popup = document.createElement("div");
            popup.classList.add("image-upload-popup");
    
            // Close button
            const closeButton = document.createElement("div");
            closeButton.classList.add("btn");
            closeButton.innerText = "x";
            popup.appendChild(closeButton);
            closeButton.onclick = () => popup.remove();
    
            // Dropzone
            const dropzone = document.createElement("div");
            dropzone.classList.add("dropzone");
            dropzone.innerText = "Drop your pictures here or click to select.";
            popup.appendChild(dropzone);
    
            const fileInput = document.createElement("input");
            fileInput.type = "file";
            fileInput.accept = "image/*";
            fileInput.multiple = true;
            dropzone.appendChild(fileInput);
    
            dropzone.addEventListener("click", () => fileInput.click());
            dropzone.addEventListener("dragover", (e) => {
                e.preventDefault();
                dropzone.classList.add("drag-over");
            });
            dropzone.addEventListener("dragleave", () => dropzone.classList.remove("drag-over"));
            dropzone.addEventListener("drop", (e) => {
                e.preventDefault();
                dropzone.classList.remove("drag-over");
                fileInput.files = e.dataTransfer.files;
            });
    
            // API Key input
            const apiKeyInput = document.createElement("input");
            apiKeyInput.type = "text";
            apiKeyInput.placeholder = "Enter your ImgBB API key";
            popup.appendChild(apiKeyInput);
    
            const savedApiKey = localStorage.getItem("imgbb-api-key");
            if (savedApiKey) {
                apiKeyInput.value = savedApiKey;
            }
    
            apiKeyInput.oninput = apiKeyInput.onchange = () => {
                localStorage.setItem("imgbb-api-key", apiKeyInput.value);
            };
    
            // Progress bars
            const overallProgress = document.createElement("div");
            overallProgress.classList.add("progress-bar");
            const individualProgress = document.createElement("div");
            individualProgress.classList.add("radial-loader");
            popup.appendChild(overallProgress);
            popup.appendChild(individualProgress);
    
            // Upload button
            const uploadBtn = document.createElement("button");
            uploadBtn.innerText = "Upload Images";
            popup.appendChild(uploadBtn);
    
            // Gallery
            const gallery = document.createElement("div");
            gallery.classList.add("gallery");
            popup.appendChild(gallery);
    
            uploadBtn.onclick = async () => {
                if (!apiKeyInput.value) {
                    alert("Please enter an API key");
                    return;
                }
    
                const files = fileInput.files;
                if (!files.length) {
                    alert("Please select images to upload");
                    return;
                }
    
                overallProgress.style.width = "0%";
                let completed = 0;
    
                for (const [index, file] of Array.from(files).entries()) {
                    const formData = new FormData();
                    formData.append("image", file);
    
                    individualProgress.classList.add("loading");
    
                    const response = await fetch(
                        `https://api.imgbb.com/1/upload?key=${apiKeyInput.value}`,
                        { method: "POST", body: formData }
                    );
    
                    const result = await response.json();
                    individualProgress.classList.remove("loading");
    
                    if (result.data) {
                        // Add thumbnail to the gallery
                        const thumbnail = document.createElement("div");
                        thumbnail.classList.add("thumbnail");
                        thumbnail.style.backgroundImage = `url(${result.data.thumb.url})`;
                        thumbnail.title = file.name;
    
                        const removeBtn = document.createElement("div");
                        removeBtn.classList.add("remove-btn");
                        removeBtn.innerText = "x";
                        thumbnail.appendChild(removeBtn);
    
                        removeBtn.onclick = () => {
                            gallery.removeChild(thumbnail);
                            this.results = this.results.filter((r) => r.data.id !== result.data.id);
                        };
    
                        thumbnail.onclick = () => {
                            const fullPopup = document.createElement("div");
                            fullPopup.classList.add("full-popup");
                            const fullImage = document.createElement("img");
                            fullImage.src = result.data.url;
                            fullPopup.appendChild(fullImage);
    
                            const closeFullPopup = document.createElement("div");
                            closeFullPopup.classList.add("close-btn");
                            closeFullPopup.innerText = "x";
                            closeFullPopup.onclick = () => fullPopup.remove();
                            fullPopup.appendChild(closeFullPopup);
    
                            document.body.appendChild(fullPopup);
                        };
    
                        gallery.appendChild(thumbnail);
                        this.results.push(result);
                    }
    
                    // Update progress
                    completed++;
                    const overallPercentage = (completed / files.length) * 100;
                    overallProgress.style.width = `${overallPercentage}%`;
                }
    
                resolve(this.results);
            };
    
            document.body.appendChild(popup);
        });
    }


    injectCSS() {
        var id = "BH-imgGallterAwtsmooStylification"
        var g = document.querySelector("."+id)
        if(g) return;
        const style = document.createElement("style");
        style.classList.add(id);
        style.textContent = `
           
    
            /* Image upload popup */
            .image-upload-popup {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                padding: 30px;
                background: #fdfdfd;
                border-radius: 12px;
                box-shadow: 0px 6px 20px rgba(0, 0, 0, 0.3);
                z-index: 10000;
                width: 400px;
            }
            
            .image-upload-popup .btn {
                position: absolute;
                top: 10px;
                right: 10px;
                cursor: pointer;
                font-size: 18px;
                font-weight: bold;
                color: #f44336;
            }
            
            .dropzone {
                border: 2px dashed #ddd;
                padding: 20px;
                text-align: center;
                margin-bottom: 20px;
                color: #888;
                cursor: pointer;
                transition: border-color 0.3s;
            }
            
            .dropzone.drag-over {
                border-color: #999;
            }
            
            .progress-bar {
                height: 10px;
                background: linear-gradient(to right, #4caf50, #81c784);
                border-radius: 5px;
                margin-bottom: 10px;
                width: 0%;
                transition: width 0.3s;
            }
            
            .radial-loader {
                width: 50px;
                height: 50px;
                border: 5px solid #ddd;
                border-top: 5px solid #4caf50;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                display: none;
                margin: 0 auto 20px;
            }
            
            .radial-loader.loading {
                display: block;
            }
            
            @keyframes spin {
                to {
                    transform: rotate(360deg);
                }
            }
            
            .gallery {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
            }
            
            .thumbnail {
                width: 80px;
                height: 80px;
                background-size: cover;
                background-position: center;
                position: relative;
                cursor: pointer;
            }
            
            .thumbnail .remove-btn {
                position: absolute;
                top: 0;
                right: 0;
                background: rgba(255, 0, 0, 0.7);
                color: white;
                font-size: 12px;
                padding: 2px 4px;
                border-radius: 50%;
                cursor: pointer;
            }
            
            .full-popup {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(0, 0, 0, 0.9);
                padding: 20px;
                z-index: 11000;
            }
            
            .full-popup img {
                max-width: 100%;
                max-height: 100%;
            }
            
            .full-popup .close-btn {
                position: absolute;
                top: 10px;
                right: 10px;
                cursor: pointer;
                color: white;
                font-size: 20px;
                font-weight: bold;
            }


        `;
        document.head.appendChild(style);
    }

}

export { ImageUploader };
