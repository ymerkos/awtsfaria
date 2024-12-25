/**
B"H

**/
import makeCode from "/scripts/awtsmoos/coding/make.js"function markdownToHtml(markdown) {
    // Extract and temporarily replace code blocks and inline code to prevent further processing
    const codeBlockRegex = /```([\s\S]*?)```/g;
    const inlineCodeRegex = /`(.*?)`/g;
    
    const codeBlocks = [];
    markdown = markdown.replace(codeBlockRegex, (match, codeContent) => {
        const firstWord = codeContent.trim().split(/\s+/)[0];
        const placeholder = `{{CODE_BLOCK_${codeBlocks.length}}}`;
        codeBlocks.push(`<pre><code data-first-word="${firstWord}">${codeContent}</code></pre>`);
        return placeholder;
    });
    
    const inlineCodes = [];
    markdown = markdown.replace(inlineCodeRegex, (match, codeContent) => {
        const firstWord = codeContent.trim().split(/\s+/)[0];
        const placeholder = `{{INLINE_CODE_${inlineCodes.length}}}`;
        inlineCodes.push(`<code data-first-word="${firstWord}">${codeContent}</code>`);
        return placeholder;
    });

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

    // Restore the code blocks and inline code placeholders
    codeBlocks.forEach((block, index) => {
        markdown = markdown.replace(`{{CODE_BLOCK_${index}}}`, block);
    });
    inlineCodes.forEach((code, index) => {
        markdown = markdown.replace(`{{INLINE_CODE_${index}}}`, code);
    });

    return markdown;
}


export {
  markdownToHtml
}
