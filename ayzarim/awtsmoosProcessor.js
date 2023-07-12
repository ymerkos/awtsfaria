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
    const segmentObjects = Array.from({
        length:segments.length
    })
    /** 
     * Shared data between scripts, keyed by script name.
     * @type {Object<string, any>} 
     */
    const sharedData = {};

    /**
     * list of shorthand commands that can be interpreted
     * by the template for 
     * @example
     * <?Awtsmoos
     * return short.awtsmoos
     * ?>
     * 
     * would return 
     * <script src="./scripts/awtsmoos/index.js"></script>
     * 
     * to include the awtsmoos script easier.
     * 
     * @type {Object <string, function>}
     */
    const short = {
        awtsmoos: `<script src="./scripts/awtsmoos/index.js"></script>`,
        login: `<a href="./login">Login</a><a href="./register">Register</a>`
    };
    /** 
     * Commands that can be invoked from within Awtsmoos scripts.
     * @type {Object<string, function>} 
     */
    const commands = {
        replace: (...args) => {
            
            // Logic to replace the entire page with the returned value
            
        },
        setName: name => {
            // Logic to set name of "module" in snippet, need to also setup system for accessing module values
            sharedData[name] = context.exports;
        }
    };
    var res;
    for (let i = 1; i < segments.length; i += 2) {
        res = await (async i => {
            try {
                context.sharedData = sharedData;
                context.commands = commands;
                context.exports = {};
                var olam = {};
                context.olam = olam;
                var code/*code entry*/
                 = `(async () => { 
                    ${"\n"+segments[i]}
                    return olam;
                })()`;

                if(context.config) {
                    console.log(context.config,context.config.template)
                    var temp = context.config.template;
                    if(temp) {
                        console.log(temp.replace)
                        var rep = context.config
                        .template.replace;
                        if(rep) {
                            Object.keys(rep).forEach(q=>{
                                if(typeof(rep[q]) == "string") {
                                    code = code.split(q)
                                        .join(rep[q]);
                                }
                            });
                        }
                    }
                    
                }

                let bichayn = await vm.runInNewContext(code, {
                    ...context,
                    short
                });

                var segmentObject;
                var tochen = ""
             //   console.log(bichayn,333)
             var ech = context.olam.echo || context.olam.toychen
                ||context.olam.content;
                if(bichayn === undefined) {
                    bichayn = olam;
                }
                if(bichayn && typeof(bichayn) == "object") {
                    segmentObject = bichayn
                    tochen = bichayn.toychen /*content*/ ||
                        bichayn.content || bichayn.echo /*to 
                            mirror php echo a bit*/
                   
                            
                } else if(bichayn && typeof(bichayn) == "string") {
                    tochen = bichayn;
                }
                segmentObjects[i] = {
                    bichayn, 
                    code,
                    segmentObject
                };
                //console.log("hi",3,result,segments[i],3333,i,context.request.path)
                const etsemMatch = segments[i].match(/\$_etsem\n(.*)\n_\$/);
    
                if (etsemMatch) {
                    
                    const instructions = etsemMatch[1].split('\n');
                    for (const instruction of instructions) {
                        const [commandName, ...args] = instruction.split(' ');
                        if (commands[commandName]) {
                            const commandResult = commands[commandName](...args);
                            if (commandName === 'replace') {
                                
                                return {
                                    replace:bichayn
                                }
                            }
                        }
                    }
                }
    
                segments[i] = tochen;
            } catch (error) {
                segments[i] = "<script>console.log("
                    + JSON.stringify({ thereWasAnAwtsmoosErrorHere: error + "" })
                    + ");</script>";
                console.error(`Error processing code segment: ${error}`);
            }
        })(i);

        
        
    }

    var finalResult = segments.join('\n');
    segmentObjects.forEach(k => {
        if(
            k &&
            k.segmentObject 
            && (
                k.segmentObject.replace ||
                k.segmentObject.mawchleef /*replace*/
            )
        ) {
            finalResult = k.segmentObject.replace;
           
            
        }
    })
    if(res && res.replace) {
        
        return res.replace
    } 
    return finalResult;
}

module.exports = processTemplate;
