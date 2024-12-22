//B"H
// State Management
const state = {
  currentVerse: 0,
  curTab: null,
  timesheet: null,
  loop: null,
  post: null,
};

// API Module
const API = {
  async getCommentsByAlias(postId, heichelId, aliasId, options) {
    try {
      const params = new URLSearchParams(options || {});
      const response = await fetch(`/api/comments/alias/${aliasId}?${params}`);
      return await response.json();
    } catch (error) {
      console.error("Error fetching comments by alias:", error);
    }
  },

  async getComment(heichelId, commentId, postId, aliasId) {
    try {
      const response = await fetch(
        `/api/comments/${heichelId}/${postId}/${commentId}/${aliasId}`
      );
      return await response.json();
    } catch (error) {
      console.error("Error fetching comment:", error);
    }
  },

  async uploadBlobToS3(url, heichel, series, postId, verseNum, author, fileName) {
    try {
      const awsConfig = JSON.parse(localStorage.getItem("awsCredentials"));
      if (!awsConfig) throw new Error("AWS credentials are missing");

      const blob = await (await fetch(url)).blob();
      const int = new Uint8Array(await blob.arrayBuffer());
      const key = `heichelos/${heichel}/series/${series}/postId/${postId}/verse/${verseNum}/${author}/${fileName}`;

      return await sendIt({
        ...awsConfig,
        key,
        content: int,
      });
    } catch (error) {
      console.error("Error uploading blob to S3:", error);
    }
  },
};

// UI Module
const UI = {
  createCommentContainer() {
    const container = document.createElement("div");
    container.className = "comment-content";
    return container;
  },

  createMenuButton(options, onClick) {
    const button = document.createElement("div");
    button.className = "menu-button";
    button.innerText = "⋮";
    button.onclick = (e) => {
      e.stopPropagation();
      onClick();
    };
    return button;
  },

  createLoadingIndicator() {
    const loadingDiv = document.createElement("div");
    loadingDiv.className = "center loading";
    loadingDiv.innerHTML = '<div class="loading-circle"></div>';
    return loadingDiv;
  },

  renderComment(comment, tab) {
    const container = UI.createCommentContainer();
    const commentText = document.createElement("div");
    commentText.className = "comment-text";
    commentText.innerHTML = Utils.sanitizeComment(comment.content);
    container.appendChild(commentText);
    tab.appendChild(container);
  },

  renderCommentsGroupedBySection(groupedComments, container) {
    Object.entries(groupedComments).forEach(([section, comments]) => {
      const sectionTab = document.createElement("div");
      sectionTab.className = `section-${section}`;
      comments.forEach((comment) => UI.renderComment(comment, sectionTab));
      container.appendChild(sectionTab);
    });
  },
};

// Event Handlers
const Handlers = {
  async handleMenuOption(option, comment) {
    switch (option) {
      case "Edit":
        alert("Edit functionality coming soon!");
        break;
      case "Reply":
        alert("Reply functionality coming soon!");
        break;
      case "Play":
        await Handlers.playAudio(comment);
        break;
      case "Add Audio":
        await Handlers.addAudio(comment);
        break;
      case "Copy":
        navigator.clipboard.writeText(comment.content).catch(console.error);
        break;
    }
  },

  async playAudio(comment) {
    const audioElement = document.querySelector(`audio[data-id='${comment.id}']`);
    if (audioElement) {
      audioElement.paused ? audioElement.play() : audioElement.pause();
    } else {
      alert("Audio element not found for this comment.");
    }
  },

  async addAudio(comment) {
    if (window.curAlias !== comment.author) {
      alert("You are not the author of this comment!");
      return;
    }
    const file = await selectAndUpload({ type: "audio", ...otherParams });
    alert(`File uploaded: ${JSON.stringify(file)}`);
  },
};

// Utility Functions
const Utils = {
  sanitizeComment(content) {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, "text/html");
      return doc.body.innerHTML;
    } catch {
      return content;
    }
  },

  groupBySection(comments) {
    const grouped = {};
    comments.forEach((comment) => {
      const section = comment.dayuh?.verseSection || "root";
      if (!grouped[section]) grouped[section] = [];
      grouped[section].push(comment);
    });
    return grouped;
  },
};

// Main Application Logic
async function loadComments() {
  const postId = getPostId(state.currentVerse);
  const comments = await API.getCommentsByAlias(postId, state.post.heichel.id, aliasId);
  const groupedComments = Utils.groupBySection(comments);

  const container = document.getElementById("comments-container");
  container.innerHTML = ""; // Clear existing content
  UI.renderCommentsGroupedBySection(groupedComments, container);
}

function initializeApp() {
  document.addEventListener("DOMContentLoaded", () => {
    state.post = postDataFromServer; // Assume postDataFromServer is available globally
    loadComments();
  });
}

// Initialize the app
initializeApp();
