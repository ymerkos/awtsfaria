// B"H
const vm = require('vm');

async function processTemplate(template, context = {}) {
    // Split the template into segments based on your tags
    const segments = template.split(/<\?Awtsmoos|\?>/g);

    // Process each segment asynchronously
    for (let i = 1; i < segments.length; i += 2) {
        try {
            const code = `(async () => { ${segments[i]} })()`;
            console.log(`Processing code segment: ${code}`);
            const result = await vm.runInNewContext(code, context);
            console.log(`Result: ${result}`);
            segments[i] = result;
        } catch (error) {
            console.error(`Error processing code segment: ${error}`);
        }
    }

    // Reassemble the template
    return segments.join('');
}

module.exports = processTemplate;
