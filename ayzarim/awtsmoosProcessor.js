// B"H


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
 * can also use in .js files or any other file.
 * In awtsmoos.config.json u can set replace variables to make it
 * easier to use <?Awtsmoos ?> like  $rosh and $sof or anything (see that file)
 * 
 * @param {string} template - The HTML template containing embedded Awtsmoos scripts. 
 * @param {Object} [context={}] - The context in which Awtsmoos scripts are executed. 
 * @returns {Promise<string>} - The processed template with Awtsmoos scripts replaced by their outputs. 
 */
// Import the vm module from Node.js
const vm = require('vm');

/**
 * This function processes an HTML template, executing embedded Awtsmoos scripts and replacing them with their outputs.
 * Each Awtsmoos script is wrapped in <?Awtsmoos ?> tags and is treated as Node.js code.
 *
 * @param {string} template - The HTML template containing embedded Awtsmoos scripts.
 * @param {Object} [context={}] - The context in which Awtsmoos scripts are executed.
 * @returns {Promise<string>} - The processed template with Awtsmoos scripts replaced by their outputs.
 */

// Shared data between scripts, keyed by script name
const sharedData = {};

// List of shorthand commands that can be interpreted by the template
const short = {
    awtsmoos: `<script src="./scripts/awtsmoos/index.js"></script>`,
    login: `<a href="./login">Login</a><a href="./register">Register</a>`
};

async function processTemplate(template, context = {}, entire = false) {
    // Split the template into segments at each Awtsmoos script tag
    const segments = !entire ? template.split(/<\?Awtsmoos|\?>/g)
        : [0,template];

    // Array to hold the final values of each script segment
    var segmentObjects = Array.from({ length: segments.length });

    
    // Process each Awtsmoos script segment
    for (let i = 1; i < segments.length; i += 2) {
        await processSegment(segments,i,segmentObjects, context);
    }

    // Join the segments back together to form the final template

    var isReplaced = false;
    var finalResult = "";
    // If any script segment indicated that it should replace the entire page, do so
    for(var i = 0; i < segmentObjects.length; i++) {
        var segment = segmentObjects[i];
        if(!segment) continue;
        if(!segment.bichayn) continue;
        var rep = (
            segment.bichayn.replace || 
            segment.bichayn.mawchleef
        )
        if (typeof(rep) == "string") {
            finalResult = rep;
            isReplaced = true;
        } 
        
        if(segment.hasExports) {
            
            finalResult = segment.bichayn;
            isReplaced = true;
        }
    }

    if(
        !isReplaced &&
        !finalResult
    ) {
        var segs = segmentObjects.map(q=>{
            if(!q) return q;
            return q.bichayn || ""
        }
              
        )
        
        finalResult = segments.join('\n');
    }
    
    return finalResult;
}

async function processSegment(segments,i,segmentObjects,context) {
    // The result of executing the current script
    let res;

    // Wrap the script processing in a try-catch block to handle errors
    // Wrap the script processing in a try-catch block to handle errors
try {
    // Prepare the execution context for the script
    context.sharedData = sharedData;
    context.olam = {};     // The olam object for the script
    
    // The code of the script, wrapped in an immediately invoked function expression (IIFE)
    let code = `(async () => {
            const module = { exports: {},etsem:3 };
            const exports = module.exports;
            
            ${segments[i]}
            
            return { olam, module};
        })();
        
    `;

        // If a config object is provided in the context, use it to replace certain parts of the script
        if (context.config?.template?.replace) {
            for (const [key, value] of Object.entries(context.config.template.replace)) {
                if (typeof value === 'string') {
                    code = code.split(key).join(value);
                }
            }
        }
    let tochen = "";
    var hasExports = null;
    // Execute the script in a new VM context, spreading the context object and adding the "short" object
    const bichayn = await vm.runInNewContext(code, { ...context, short });
    
    
    // If there's any exported data, use that. Otherwise, proceed as normal.
    if (
        bichayn && 
        typeof(bichayn) == "object" && 
        Object.keys(bichayn.module.exports).length > 0
    ) {
        
        tochen = bichayn.module.exports;
        hasExports = tochen;

    } else if(bichayn) {
        // If there is no exported data, use `bichayn.olam` or `context.olam` as the return value
        let returnValue = bichayn;
        
        if (typeof returnValue === 'object') {
            var olam = returnValue.olam;
            if(typeof(olam) == "object") {
                // If the return value is an object, use the "toychen", "content", or "echo" property, if they exist
                tochen = olam.toychen ||
                olam.tochen ||
                olam.content || olam.echo;
            } else tochen = returnValue;
        } else {
            // If the return value is a string, use it directly
            tochen = returnValue;
        }
    }

    
    // Save the return value, script code, and content for this script segment
    segmentObjects[i] = { 
        bichayn: tochen,
        
        code, 
        segmentObject: tochen,
        hasExports
    };
    

    // Handle the return value based on its type
    if (typeof tochen === 'object') {
        // Store the returned object into sharedData
        var name = segments[i] =  
            tochen.shaym ||
             tochen.name;
        if(typeof(name) == "string")
        sharedData[name] = tochen;

        var text = tochen.text || tochen.content ||
            tochen.replace;

        if(typeof(text) == "string") {
            segmentObjects[i].bichayn = text;
        }
    } else if (typeof tochen === 'string') {
        
        // If the return value is a string, replace the script segment directly
        segmentObjects[i].bichayn = tochen;
        
    }
    
    segments[i] = segmentObjects[i].bichayn;
    } catch (error) {
        // If an error occurred, replace the script in the segment with an error message
        segments[i] = `
        var er = ${
            JSON.stringify({ 
                thereWasAnAwtsmoosErrorHere: error.message,
                segment: segments[i]
            })
        }
        console.log(er);
        er;`;
        console.error(`Error processing code segment: ${error}`,segments[i]);
    }
}

// Add this function to your code to check if the "replace" or "mawchleef" property is set to "olam".
function isOlam(obj) {
    return ['replace', 'mawchleef'].some(key => obj[key] === 'olam');
}
module.exports = processTemplate;
