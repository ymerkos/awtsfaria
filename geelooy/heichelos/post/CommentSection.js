//B"H
import {
    AwtsmoosPrompt
} from "/scripts/awtsmoos/api/utils.js";

import { ImageUploader } from "./ImageUploader.js";

class CommentSection {
    imgResults = [];
    constructor(container) {
        this.container = container;
        this.init();
        window.commentSection = this;
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
        imageUploadIcon.onclick = async () => {
            var res = await this.imageUploader.uploadImages();
            this.imgResults = res;
            res.forEach(r => {
                var img = document.createElement("img");
                img.src = r?.data?.thumb?.url;
                this.galleryContainer.appendChild(img)
            })
            this.galleryContainer.style.display = "";
            console.log("Results?",res);
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
        
        const images = this.imgResults.map(q=>q?.success ? ({
            medium: q?.data?.medium?.url,
            thumbnail: q?.data?.thumb?.url,
            img: q?.data?.url,
            height: q?.data?.height,
            width: q?.data?.width,
            size: q.data?.size
        }) : null).filter(Boolean);//[...this.galleryContainer.querySelectorAll("img")].map((img) => img.src);

        if (!content) {
            alert("Comment cannot be empty.");
            return;
        }

        
        // Perform submit logic here
        console.log({ content, images });
        var submitBtn = this.submitBtn;
        submitBtn.textContent = "Submitting comment...";
        try {
            var currentAlias = window.currentAlias || window.curAlias;
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
                        content: this.commentBox.innerText,
                        
                        dayuh: JSON.stringify(ob),
                    }),
                })
            ).json();
            if (json.message == "Added comment!") {
                await AwtsmoosPrompt.go({
                    isAlert: true,
                    headerTxt: "You did it! Your comment appears below.",
                });
                submitBtn.textContent = "Submit Comment";
                
            } else if (json.error) {
                await AwtsmoosPrompt.go({
                    isAlert: true,
                    headerTxt: "There was an issue: " + json.error,
                });
                
            }
        } catch (e) {
            console.log(e);
            await AwtsmoosPrompt.go({
                isAlert: true,
                headerTxt: "Something went wrong",
            });
          
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
                border: 1px solid rgba(0, 0, 0, 0.15);
                border-radius: 12px;
                box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.15), inset 0px 0px 10px rgba(255, 255, 255, 0.5);
                background: linear-gradient(135deg, #fdfbfb, #ebedee, #ffffff);
                padding: 20px;
                max-width: 700px;
                margin: 25px auto;
                transition: box-shadow 0.3s ease, transform 0.3s ease;
            }
            .add-comment-area:hover {
                box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.3), inset 0px 0px 20px rgba(255, 255, 255, 0.6);
                
            }
            
            /* Buttons */
            .btn {
                display: inline-block;
                padding: 12px 25px;
                font-size: 16px;
                font-weight: bold;
                letter-spacing: 0.08em;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.3s ease-in-out;
                background: linear-gradient(to top, #03a9f4, #2575fc);
                color: #fff;
                text-shadow: 0 2px 3px rgba(0, 0, 0, 0.3);
                box-shadow: 0px 4px 12px rgba(37, 117, 252, 0.3);
            }
            .btn:hover {
                background: linear-gradient(to bottom, #a2fffa, #9bbdf7);
                transform:  scale(1.03);
                box-shadow: 0px 6px 18px rgba(37, 117, 252, 0.4);
            }
            .btn:active {
                transform: translateY(1px) scale(0.98);
                box-shadow: 0px 3px 8px rgba(37, 117, 252, 0.2);
            }
            
            /* Comment box */
            .comment-box {
                padding: 12px;
                border: 1px solid rgba(0, 0, 0, 0.1);
                border-radius: 8px;
                background: linear-gradient(135deg, #f9f9f9, #ffffff);
                color: #333;
                min-height: 70px;
                max-height: 250px;
                overflow-y: auto;
                outline: none;
                box-shadow: inset 0px 3px 6px rgba(0, 0, 0, 0.1);
                transition: box-shadow 0.2s ease-in-out;
            }
            .comment-box:focus {
                box-shadow: inset 0px 5px 10px rgba(0, 0, 0, 0.2);
            }
            .comment-box::placeholder {
                color: #bbb;
                font-style: italic;
                font-size: 14px;
            }
            
            /* Image upload icon */
            .image-upload-icon {
                cursor: pointer;
                font-size: 24px;
                width:24px;
                color: #2575fc;
                transition: color 0.4s ease, transform 0.3s ease;
            }
            .image-upload-icon:hover {
                color: #6a11cb;
                cursor:pointer;
                transform: rotate(10deg) scale(1.2);
            }
            
            /* Image gallery */
            .image-gallery {
                display: flex;
                flex-wrap: wrap;
                gap: 15px;
                margin-top: 15px;
            }
            .image-gallery img {
        
                width:50%;
                border-radius: 12px;
                object-fit: cover;
                box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.2);
                transition: transform 0.3s ease, box-shadow 0.3s ease;
            }
            .image-gallery img:hover {
                transform: scale(1.15);
                box-shadow: 0px 10px 25px rgba(0, 0, 0, 0.3);
            }
            
            /* Buttons container */
            .button-container {
                display: flex;
                gap: 12px;
                margin-top: 15px;
            }
    
            
        `;
        document.head.appendChild(style);
    }

}

export { CommentSection };


