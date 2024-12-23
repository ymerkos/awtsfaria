//B"H
import { ImageUploader } from "./ImageUploader.js";

class CommentSection {
    constructor(container) {
        this.container = container;
        this.init();
    }

    init() {
        this.addCommentArea = document.createElement("div");
        this.addCommentArea.classList.add("add-comment-area");
        this.container.appendChild(this.addCommentArea);

        this.createInitialButton();
        this.createCommentBox();
        this.createImageUploadIcon();
        this.createGalleryContainer();
        this.createButtons();
        this.injectCSS();
    }

    createInitialButton() {
        this.btn = document.createElement("div");
        this.btn.classList.add("btn", "add-comment");
        this.btn.innerText = "Add a comment...";
        this.btn.onclick = async () => {
            const currentAlias = window.curAlias;
            if (!currentAlias) {
                await AwtsmoosPrompt.go({
                    isAlert: true,
                    headerTxt: "You need to be logged in with an alias to comment!",
                });
                return;
            }
            const hasPermission = await (
                await fetch(`/api/social/alias/${currentAlias}/heichelos/ikar/ownership`)
            ).json();
            if (!hasPermission.yes) {
                await AwtsmoosPrompt.go({
                    isAlert: true,
                    headerTxt: `That alias, ${currentAlias}, doesn't have permission to post here.`,
                });
                return;
            }

            this.btn.style.display = "none";
            this.commentBox.style.display = "block";
        };
        this.addCommentArea.appendChild(this.btn);
    }

    createCommentBox() {
        this.commentBox = document.createElement("div");
        this.commentBox.classList.add("comment-box");
        this.commentBox.contentEditable = true;
        this.commentBox.placeholder = "Add a comment...";
        this.commentBox.style.display = "none";

        this.commentBox.oninput = () => {
            this.buttonContainer.style.display = "flex";
            this.submitBtn.disabled = false;
        };

        this.addCommentArea.appendChild(this.commentBox);
    }

    createImageUploadIcon() {
        this.imageUploader = new ImageUploader(this.createGalleryContainer());
        const imageUploadIcon = document.createElement("div");
        imageUploadIcon.classList.add("image-upload-icon");
        imageUploadIcon.innerText = "📷";
        imageUploadIcon.onclick = () => {
            this.imageUploader.createImageUploadPopup();
        };
        this.addCommentArea.appendChild(imageUploadIcon);
    }

    createGalleryContainer() {
        this.galleryContainer = document.createElement("div");
        this.galleryContainer.classList.add("image-gallery");
        this.galleryContainer.style.display = "none";
        this.addCommentArea.appendChild(this.galleryContainer);
        return this.galleryContainer;
    }

    createButtons() {
        this.buttonContainer = document.createElement("div");
        this.buttonContainer.classList.add("button-container");
        this.addCommentArea.appendChild(this.buttonContainer);

        const cancelBtn = document.createElement("button");
        cancelBtn.classList.add("btn", "cancel-comment");
        cancelBtn.innerText = "Cancel";
        cancelBtn.onclick = () => {
            this.commentBox.innerText = "";
            this.galleryContainer.innerHTML = "";
            this.galleryContainer.style.display = "none";
            this.commentBox.style.display = "none";
            this.buttonContainer.style.display = "none";
            this.btn.style.display = "block";
            this.submitBtn.disabled = true;
        };

        this.submitBtn = document.createElement("button");
        this.submitBtn.classList.add("btn", "submit-comment");
        this.submitBtn.innerText = "Comment";
        this.submitBtn.disabled = true;
        this.submitBtn.onclick = this.submitComment.bind(this);

        this.buttonContainer.appendChild(cancelBtn);
        this.buttonContainer.appendChild(this.submitBtn);
    }

    async submitComment() {
        const content = this.commentBox.innerText;
        const images = [...this.galleryContainer.querySelectorAll("img")].map((img) => img.src);

        if (!content) {
            alert("Comment cannot be empty.");
            return;
        }

        // Perform submit logic here
        console.log({ content, images });

        // Reset UI
        this.commentBox.innerText = "";
        this.galleryContainer.innerHTML = "";
        this.galleryContainer.style.display = "none";
        this.commentBox.style.display = "none";
        this.buttonContainer.style.display = "none";
        this.btn.style.display = "block";
    }

    injectCSS() {
        const style = document.createElement("style");
        style.textContent = `
            .add-comment-area { margin: 20px; }
            .btn { cursor: pointer; padding: 10px 15px; }
            .comment-box { border: 1px solid #ccc; padding: 10px; }
            .image-upload-icon { cursor: pointer; font-size: 1.5em; }
            .image-gallery img { width: 80px; height: 80px; margin: 5px; border-radius: 5px; }
            .button-container { display: none; gap: 10px; margin-top: 10px; }
        `;
        document.head.appendChild(style);
    }
}

export { CommentSection };
