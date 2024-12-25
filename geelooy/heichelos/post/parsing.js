/**
B"H

**/
import makeCode from "/scripts/awtsmoos/coding/make.js"
function markdownToHtml(markdown) {
    // Convert headers (e.g., # Header to <h1>Header</h1>)
    markdown = markdown.replace(/^###### (.*?)$/gm, '<h6>$1</h6>');
    markdown = markdown.replace(/^##### (.*?)$/gm, '<h5>$1</h5>');
    markdown = markdown.replace(/^#### (.*?)$/gm, '<h4>$1</h4>');
    markdown = markdown.replace(/^### (.*?)$/gm, '<h3>$1</h3>');
    markdown = markdown.replace(/^## (.*?)$/gm, '<h2>$1</h2>');
    markdown = markdown.replace(/^# (.*?)$/gm, '<h1>$1</h1>');

    // Convert bold text (e.g., **bold** to <strong>bold</strong>)
    markdown = markdown.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Convert italic text (e.g., *italic* to <em>italic</em>)
    markdown = markdown.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Convert links (e.g., [link](url) to <a href="url">link</a>)
    markdown = markdown.replace(/\[([^\]]+)\]\((.*?)\)/g, '<a href="$2">$1</a>');
    
    // Convert unordered lists (e.g., - item to <ul><li>item</li></ul>)
    markdown = markdown.replace(/^-\s+(.*)$/gm, '<ul><li>$1</li></ul>');
    
    // Convert ordered lists (e.g., 1. item to <ol><li>item</li></ol>)
    markdown = markdown.replace(/^\d+\.\s+(.*)$/gm, '<ol><li>$1</li></ol>');

    // Convert code blocks (e.g., ```code``` to <pre><code>code</code></pre>)
// Adds the first word of the code as a data-first-word attribute
    markdown = markdown.replace(/```([\s\S]*?)```/g, (match, codeContent) => {
        const firstWord = codeContent.trim().split(/\s+/)[0];
        return `<pre><code data-first-word="${firstWord}">${codeContent}</code></pre>`;
    });
    
    // Convert inline code (e.g., `code` to <code>code</code>)
    // Adds the first word of the inline code as a data-first-word attribute
    markdown = markdown.replace(/`(.*?)`/g, (match, codeContent) => {
        const firstWord = codeContent.trim().split(/\s+/)[0];
        return `<code data-first-word="${firstWord}">${codeContent}</code>`;
    });
    
    return markdown;
}

export {
  markdownToHtml
}
