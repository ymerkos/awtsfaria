//B"H
class ImageUploader {
    constructor(galleryContainer) {
        this.galleryContainer = galleryContainer;
        this.galleryContainer.style.display = "none";
    }

    uploadImages() {
        return new Promise((resolve) => {
            const popup = document.createElement("div");
            popup.classList.add("image-upload-popup");
    
            // Close Button
            const closeButton = document.createElement("div");
            closeButton.classList.add("btn", "close-btn");
            closeButton.innerText = "×";
            popup.appendChild(closeButton);
            closeButton.onclick = () => popup.remove();
    
            // Drag-and-Drop Area
            const dropArea = document.createElement("div");
            dropArea.classList.add("drop-area");
            dropArea.innerHTML = `
                <p>Drag your images here or <span class="click-upload">click to upload</span></p>
                <input type="file" accept="image/*" multiple hidden>
            `;
            popup.appendChild(dropArea);
    
            const fileInput = dropArea.querySelector("input[type='file']");
            dropArea.onclick = () => fileInput.click();
            dropArea.ondragover = (e) => {
                e.preventDefault();
                dropArea.classList.add("dragging");
            };
            dropArea.ondragleave = () => dropArea.classList.remove("dragging");
            dropArea.ondrop = (e) => {
                e.preventDefault();
                dropArea.classList.remove("dragging");
                fileInput.files = e.dataTransfer.files;
            };
    
            // API Key Input
            const apiKeyInput = document.createElement("input");
            apiKeyInput.type = "text";
            apiKeyInput.placeholder = "Enter your ImgBB API key";
            apiKeyInput.classList.add("api-key-input");
            popup.appendChild(apiKeyInput);
    
            const savedKey = localStorage.getItem("imgbb-api-key");
            if (savedKey) apiKeyInput.value = savedKey;
            apiKeyInput.oninput = () => {
                localStorage.setItem("imgbb-api-key", apiKeyInput.value);
            };
    
            // Helper Link
            const helperLink = document.createElement("a");
            helperLink.textContent = "Get an API key here";
            helperLink.href = "https://api.imgbb.com/";
            helperLink.target = "_blank";
            helperLink.classList.add("helper-link");
            popup.appendChild(helperLink);
    
            // Upload Button
            const uploadButton = document.createElement("button");
            uploadButton.classList.add("upload-btn");
            uploadButton.innerText = "Upload Images";
            uploadButton.onclick = async () => {
                const apiKey = apiKeyInput.value;
                if (!apiKey) {
                    alert("Please enter an API key");
                    return;
                }
                const files = fileInput.files;
                if (!files.length) {
                    alert("Please select or drop images to upload");
                    return;
                }
    
                const results = [];
                for (const file of files) {
                    const formData = new FormData();
                    formData.append("image", file);
                    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
                        method: "POST",
                        body: formData,
                    });
                    const result = await response.json();
                    if (result.data) results.push(result);
                }
    
                popup.remove();
                resolve(results);
            };
            popup.appendChild(uploadButton);
    
            document.body.appendChild(popup);
        });
    }

}

export { ImageUploader };
