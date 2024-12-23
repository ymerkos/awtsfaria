//B"H
import {
    AwtsmoosPrompt
} from "/scripts/awtsmoos/api/utils.js";

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
        var submitBtn = this.submitBtn;
        submitBtn.textContent = "Submitting comment...";
        try {
            var currentAlias = window.currentAlias;
            if (!currentAlias) {
                await AwtsmoosPrompt.go({
                    isAlert: true,
                    headerTxt: "Don't have current alias",
                });
                return;
            }
            var s = new URLSearchParams(location.search);
            var idx = s.get("idx");
            var ob = {
                images
            };
            if (idx !== null) {
                idx = parseInt(idx);
                if(!isNaN(idx))
                    ob.verseSection = idx;
            }
            var sub = s.get("sub");
            if(sub !== null) 
                sub = parseInt(sub);
            
            if(!isNaN(sub))
                ob.subSection = sub;
            
            var json = await (
                await fetch(location.origin + `/api/social/heichelos/${window.post?.heichel?.id}/post/${window.post?.id}/comments/`, {
                    method: "POST",
                    body: new URLSearchParams({
                        aliasId: currentAlias,
                        content: commentBox.innerText,
                        
                        dayuh: JSON.stringify(ob),
                    }),
                })
            ).json();
            if (json.success) {
                await AwtsmoosPrompt.go({
                    isAlert: true,
                    headerTxt: "You did it! Your comment appears below.",
                });
                return;
            } else if (json.error) {
                await AwtsmoosPrompt.go({
                    isAlert: true,
                    headerTxt: "There was an issue: " + json.error,
                });
                return;
            }
        } catch (e) {
            console.log(e);
            await AwtsmoosPrompt.go({
                isAlert: true,
                headerTxt: "Something went wrong",
            });
            return;
        }
        submitBtn.textContent = oh;
        curTab?.awtsRefresh?.();
        reloadRoot();

        // Reset UI
        this.commentBox.innerText = "";
        this.galleryContainer.innerHTML = "";
        this.galleryContainer.style.display = "none";
        this.commentBox.style.display = "none";
        this.buttonContainer.style.display = "none";
        this.btn.style.display = "block";
    }

    // Dynamically inject enhanced CSS
    injectCSS() {
        var g = document.querySelector(".BH-awtsmooStylification")
        if(g) return;
        const style = document.createElement("style");
        style.classList.add("BH-awtsmooStylification");
        style.textContent = `
           
    
            /* Add comment area */
            .add-comment-area {
                font-family: 'Inter', sans-serif;
                border: 1px solid rgba(0, 0, 0, 0.1);
                border-radius: 10px;
                box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
                background: linear-gradient(to right, #fdfbfb, #ebedee);
                padding: 15px;
                max-width: 600px;
                margin: 20px auto;
                transition: box-shadow 0.3s ease-in-out;
            }
            .add-comment-area:hover {
                box-shadow: 0px 8px 25px rgba(0, 0, 0, 0.2);
            }
    
            /* Buttons */
            .btn {
                display: inline-block;
                padding: 10px 20px;
                font-size: 14px;
                font-weight: bold;
                letter-spacing: 0.05em;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                transition: all 0.2s ease-in-out;
                background: linear-gradient(to top, #03a9f4, #2575fc);
                color: #fff;
                text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
            }
            .btn:hover {
                background: linear-gradient(to bottom, #a2fffa, #9bbdf7);
                transform: translateY(-2px);
                box-shadow: 0px 4px 15px rgba(37, 117, 252, 0.3);
            }
    
            /* Comment box */
            .comment-box {
                padding: 10px;
                border: 1px solid #ccc;
                border-radius: 5px;
                background: #f9f9f9;
                color: #333;
                min-height: 60px;
                max-height: 200px;
                overflow-y: auto;
                outline: none;
                box-shadow: inset 0px 2px 5px rgba(0, 0, 0, 0.1);
            }
            .comment-box::placeholder {
                color: #aaa;
                font-style: italic;
            }
    
            /* Image upload icon */
            .image-upload-icon {
                cursor: pointer;
                font-size: 20px;
                color: #2575fc;
                transition: color 0.3s ease-in-out;
            }
            .image-upload-icon:hover {
                color: #6a11cb;
            }
    
            /* Image gallery */
            .image-gallery {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
                margin-top: 10px;
            }
            .image-gallery img {
                width: 80px;
                height: 80px;
                border-radius: 10px;
                object-fit: cover;
                box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
                transition: transform 0.3s ease-in-out;
            }
            .image-gallery img:hover {
                transform: scale(1.1);
            }
    
            /* Buttons container */
            .button-container {
                display: flex;
                gap: 10px;
                margin-top: 10px;
            }
    
            /* Image upload popup */
            .image-upload-popup {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                padding: 20px;
                background: #fff;
                border: 1px solid #ccc;
                border-radius: 10px;
                box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);
                z-index: 1000;
                animation: fadeIn 0.3s ease-out;
            }
            @keyframes fadeIn {
                from {
                    opacity: 0;
                    transform: translate(-50%, -60%);
                }
                to {
                    opacity: 1;
                    transform: translate(-50%, -50%);
                }
            }
            .image-upload-popup input[type="file"] {
                margin-bottom: 10px;
            }
            .image-upload-popup button {
                display: block;
                width: 100%;
                padding: 10px;
                background: linear-gradient(to right, #ff7e5f, #feb47b);
                border: none;
                border-radius: 5px;
                color: #fff;
                font-weight: bold;
                cursor: pointer;
                transition: background 0.2s ease-in-out;
            }
            .image-upload-popup button:hover {
                background: linear-gradient(to left, #ff7e5f, #feb47b);
            }
        `;
        document.head.appendChild(style);
    }

}

export { CommentSection };


