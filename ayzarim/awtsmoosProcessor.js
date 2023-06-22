// B"H
const vm = require('vm');

async function processTemplate(template, context = {}) {
    // Split the template into segments based on your tags
    const segments = template.split(/<\?Awtsmoos|\?>/g);

    // Process each segment asynchronously
    for (let i = 1; i < segments.length; i += 2) {
        const code = segments[i];
        const script = new vm.Script(code);
        const result = script.runInContext(vm.createContext(context));
        // If result is a Promise, await it
        if (result instanceof Promise) {
            segments[i] = await result;
        } else {
            segments[i] = result;
        }
    }

    // Reassemble the template
    return segments.join('');
}

module.exports = processTemplate;
