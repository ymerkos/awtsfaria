//B"H
class ImageUploader {
    constructor(galleryContainer) {
        this.galleryContainer = galleryContainer;
        this.galleryContainer.style.display = "none";
    }

    createImageUploadPopup() {
        const popup = document.createElement("div");
        popup.classList.add("image-upload-popup");

        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = "image/*";
        fileInput.multiple = true;
        popup.appendChild(fileInput);

        const apiKeyInput = document.createElement("input");
        apiKeyInput.type = "text";
        apiKeyInput.placeholder = "Enter your ImgBB API key";
        popup.appendChild(apiKeyInput);

        const uploadBtn = document.createElement("button");
        uploadBtn.innerText = "Upload Images";
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

            this.galleryContainer.style.display = "block";
            for (const file of files) {
                const formData = new FormData();
                formData.append("image", file);
                const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKeyInput.value}`, {
                    method: "POST",
                    body: formData,
                });
                const result = await response.json();
                if (result.data) {
                    const img = document.createElement("img");
                    img.src = result.data.url;
                    this.galleryContainer.appendChild(img);
                }
            }
            popup.remove();
        };

        popup.appendChild(uploadBtn);
        document.body.appendChild(popup);
    }
}

export { ImageUploader };
