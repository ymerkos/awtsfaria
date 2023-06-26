// B"H
const vm = require('vm');

/**
 * This function processes an HTML template, executing embedded Awtsmoos scripts and replacing them with their outputs.
 * Each Awtsmoos script is wrapped in <?Awtsmoos ?> tags and is treated as Node.js code.
 * 
 * @example
 * const template = `
 * <html>
 * <body>
 *   <?Awtsmoos
 *   exports.result = 'Hello, world!';
 *   ?>
 * </body>
 * </html>`;
 * const processedTemplate = await processTemplate(template);
 * console.log(processedTemplate);  // Outputs: "<html><body>Hello, world!</body></html>"
 * 
 * @param {string} template - The HTML template containing embedded Awtsmoos scripts. 
 * @param {Object} [context={}] - The context in which Awtsmoos scripts are executed. 
 * @returns {Promise<string>} - The processed template with Awtsmoos scripts replaced by their outputs. 
 */
async function processTemplate(template, context = {}) {
    const segments = template.split(/<\?Awtsmoos|\?>/g);
  
    /** 
     * Shared data between scripts, keyed by script name.
     * @type {Object<string, any>} 
     */
    const sharedData = {};

    /** 
     * Commands that can be invoked from within Awtsmoos scripts.
     * @type {Object<string, function>} 
     */
    const commands = {
        replace: () => {
            // Logic to replace the entire page with the returned value
            const latestSnippet = sharedData[Object.keys(sharedData)[Object.keys(sharedData).length - 1]];
            return latestSnippet.exports.result;
        },
        setName: name => {
            // Logic to set name of "module" in snippet, need to also setup system for accessing module values
            sharedData[name] = context.exports;
        }
    };

    for (let i = 1; i < segments.length; i += 2) {
        try {
            context.sharedData = sharedData;
            context.commands = commands;
            context.exports = {};

            const code = `(async () => { ${segments[i]} })()`;
            let result = await vm.runInNewContext(code, context);

            const etsemMatch = segments[i].match(/$_etsem\n(.*)\n_\$/);
            if (etsemMatch) {
                const instructions = etsemMatch[1].split('\n');
                for (const instruction of instructions) {
                    const [commandName, ...args] = instruction.split(' ');
                    if (commands[commandName]) {
                        const commandResult = commands[commandName](...args);
                        if (commandName === 'replace') {
                            return commandResult;
                        }
                    }
                }
            }

            segments[i] = result;
        } catch (error) {
            segments[i] = "<script>console.log("
                + JSON.stringify({ thereWasAnAwtsmoosErrorHere: error + "" })
                + ");</script>";
            console.error(`Error processing code segment: ${error}`);
        }
    }

    return segments.join('');
}

module.exports = processTemplate;
