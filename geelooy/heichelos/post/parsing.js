/**
B"H

**/
function markdownToHtml(markdown) {
    // Extract and temporarily replace code blocks to prevent interference
    const codeBlockRegex = /```([\s\S]*?)```/g;
    const inlineCodeRegex = /`(.*?)`/g;
    
    const codeBlocks = [];
    markdown = markdown.replace(codeBlockRegex, (match, codeContent) => {
        const placeholder = `{{CODE_BLOCK_${codeBlocks.length}}}`;
        codeBlocks.push(match); // Save the entire code block as-is
        return placeholder;
    });
    
    const inlineCodes = [];
    markdown = markdown.replace(inlineCodeRegex, (match, codeContent) => {
        const placeholder = `{{INLINE_CODE_${inlineCodes.length}}}`;
        inlineCodes.push(match); // Save the entire inline code as-is
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
    markdown = markdown.replace(/^-\s+(.*)$/gm, (match, listItem) => {
        return `<ul><li>${listItem}</li></ul>`;
    });

    // Convert ordered lists (e.g., 1. item to <ol><li>item</li></ol>)
    markdown = markdown.replace(/^\d+\.\s+(.*)$/gm, (match, listItem) => {
        return `<ol><li>${listItem}</li></ol>`;
    });

    // Restore code blocks and inline code from placeholders
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
