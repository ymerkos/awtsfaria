//B"H
// B"H

class ParagraphHighlighter {
    constructor(containerSelector, paragraphSelector, onHighlightCallback) {
        this.paragraphSelector = paragraphSelector;
        this.containerSelector = containerSelector;
        this.onHighlightCallback = onHighlightCallback;
        this.refresh()
        this.init()
        // Bind the highlight function to allow it to be attached to events easily
        this.highlightParagraph = this.highlightParagraph.bind(this);
    }

    refresh() {
        this.paragraphContainer = document.querySelector(this.containerSelector);
       
        this.paragraphs = Array.from(this.paragraphContainer.querySelectorAll(this.paragraphSelector));
        this.onHighlightCallback = this.onHighlightCallback;

        this.lastParagraph = null;
        this.currentParagraph = null;
    }

    highlightParagraph() {
        let topParagraph = null;
        let index = null;
        if(!this.paragraphContainer) {
            return console.log("NOTHING",window.hh=this)
        }
        // Get container dimensions
        const containerTop = this.paragraphContainer.scrollTop + (this.paragraphContainer.offsetHeight / 4);
        const containerBottom = containerTop + this.paragraphContainer.offsetHeight - (this.paragraphContainer.offsetHeight / 4);

        // Find the first visible paragraph
        for (let i = 0; i < this.paragraphs.length; i++) {
            const paragraph = this.paragraphs[i];
            const paragraphTop = paragraph.offsetTop;
            const paragraphBottom = paragraphTop + paragraph.offsetHeight;

            // Check if paragraph is within the adjusted viewport boundaries
            if (paragraphTop <= containerBottom && paragraphBottom >= containerTop) {
                topParagraph = paragraph;
                index = i;
                break;
            }
        }

        if (topParagraph) {
            if (!topParagraph.classList.contains("active")) {
                // Remove 'active' class from all paragraphs and add it to the top paragraph
                this.paragraphs.forEach(p => p.classList.remove('active'));
                topParagraph.classList.add('active');
            }

            // Call the callback if a new paragraph has become the top paragraph
            if (this.lastParagraph !== topParagraph) {
                this.onHighlightCallback(topParagraph, index);
            }

            this.lastParagraph = topParagraph;
            this.currentParagraph = topParagraph;
        }
    }

    init() {
        // Attach the highlightParagraph function to scroll events
        this.paragraphContainer.addEventListener('scroll', () => this.highlightParagraph());
    }
}
export default ParagraphHighlighter;
// Usage Example:
/*
function notificationalism(paragraph, index) {
    console.log(`Highlighted paragraph index: ${index}`);
}

const highlighter = new ParagraphHighlighter('.paragraph-content', '.p-div', notificationalism);
highlighter.init();
*/
