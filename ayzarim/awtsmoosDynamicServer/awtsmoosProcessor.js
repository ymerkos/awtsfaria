// B"H


/**

This code defines a function `processTemplate`, designed to process HTML templates that contain embedded Awtsmoos scripts. These scripts are Node.js code enclosed within `<?Awtsmoos ?>` tags. The function evaluates these scripts and replaces the tags with the output of the script execution. This process allows for dynamic content generation within HTML templates.

### Key Components and Features:

1. **Awtsmoos Scripts**: These are Node.js code snippets embedded within `<?Awtsmoos ?>` tags in the HTML template. They're processed and executed to generate dynamic content.

2. **`processTemplate` Function**: The main function that takes an HTML template string as input, processes the Awtsmoos scripts within it, and returns a promise that resolves to the processed template string.

3. **Context Object**: An optional parameter that provides a context in which the Awtsmoos scripts are executed. It can contain any data or variables that the scripts might need.

4. **Shared Data Across Scripts**: The function allows sharing data between different Awtsmoos script tags via a `sharedData` object, which is part of the execution context.

5. **Error Handling**: The function includes a try-catch block to handle any errors that occur during the execution of Awtsmoos scripts, ensuring the rest of the template processes correctly.

6. **`olam` Object**: A special object in the context that scripts can modify. It can be used to control how the template is processed, like replacing the entire template with a specific output.

7. **Configurable Shortcuts**: The function supports a `short` object that contains shorthand commands for common HTML snippets, making it easier to write complex templates.

8. **Conditional Script Execution**: Scripts can conditionally decide whether to replace the entire template or just their segment based on certain conditions set in the `olam` object.

9. **Exported Data Handling**: If a script exports data (using `module.exports`), this data is used as the output of the script.

10. **Dynamic Script Content Replacement**: Scripts can dynamically decide their output, which can be a simple text replacement, a complex HTML structure, or even a decision to skip processing the next script segment.

### How It Works:

1. The HTML template is split into segments at each Awtsmoos script tag.
2. Each script segment is processed asynchronously:
   - The script is executed in a VM context with the provided context and shared data.
   - If the script modifies the `olam` object or exports data, these changes affect how the template is processed.
   - The output of each script replaces its corresponding script tag in the template.
3. The function checks if any script decided to replace the entire template. If so, it uses that output; otherwise, it joins all segments back into a single string.

### Use Cases:

- **Dynamic Web Pages**: Creating web pages that require server-side computation or dynamic content generation before being sent to the client.
- **Template Systems**: In systems where templates need to be customizable and capable of including dynamic, server-side logic.
- **Content Management Systems (CMS)**: Where users might need to embed custom server-side logic within their content.

In summary, `processTemplate` is a powerful function for processing HTML templates with embedded Node.js code, allowing for dynamic content generation and complex template manipulation.

The `olam` object within the `processTemplate` function plays a crucial role in determining how the template gets processed based on the embedded Awtsmoos scripts. Here are specific details of what can be set in the `olam` object and the consequences of these settings:

1. **Replacing Entire Template (`olam.replace`)**:
   - If a script sets `olam.replace = true`, it indicates that the output of this script should replace the entire HTML template. The final output of the `processTemplate` function will be whatever this script outputs.
   - If `olam.replace` is set to a string, the entire HTML template is replaced with this string.

2. **Skipping Next Script Segment (`olam.skipNextSegment`)**:
   - Setting `olam.skipNextSegment = true` in a script instructs the `processTemplate` function to skip the processing of the immediately following Awtsmoos script segment.

3. **Replacing with Next Segment (`olam.replaceWithNext`)**:
   - When `olam.replaceWithNext = true` is set, it indicates that the current segment's output should be replaced with the output of the next Awtsmoos script segment.

4. **Conditional Script Execution**:
   - The `olam` object can be used to store flags or conditions that influence how subsequent scripts in the template behave. For example, a script could set a condition in `olam`, and later scripts could change their behavior based on this condition.

5. **Shared Data Across Scripts (`sharedData`)**:
   - While not directly a part of the `olam` object, `sharedData` is another key aspect of the context. Scripts can use the `olam` object to read or write to `sharedData`, allowing for sharing state or data between different script segments.

6. **Access to Next HTML Segment (`olam.nextHtml`)**:
   - The `olam` object provides access to the next HTML segment (`olam.nextHtml`). Scripts can use this to make decisions based on the content that follows them in the template.

7. **Exported Data Handling (`module.exports`)**:
   - If a script uses `module.exports` to export data, this data can be accessed through the `olam` object in subsequent script segments, allowing scripts to build upon each other's outputs.

8. **Custom Properties and Functions**:
   - Developers can add custom properties and functions to the `olam` object, which can be used to store state or perform operations that are relevant across multiple script segments.

In practice, these features make the `olam` object a powerful tool for controlling the flow of HTML template processing, enabling complex logic and dynamic content generation based on server-side computations and conditions.


 * This function processes an HTML template, executing embedded Awtsmoos scripts and replacing them with their outputs.
 * Each Awtsmoos script is wrapped in <?Awtsmoos ?> tags and is treated as Node.js code.
 * 
 * @example
 * var template = `
 * <html>
 * <body>
 *   <?Awtsmoos
 *   exports.result = 'Hello, world!';
 *   ?>
 * </body>
 * </html>`;
 * var processedTemplate = await processTemplate(template);
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
var vm = require('vm');

/**
 * This function processes an HTML template, executing embedded Awtsmoos scripts and replacing them with their outputs.
 * Each Awtsmoos script is wrapped in <?Awtsmoos ?> tags and is treated as Node.js code.
 *
 * @param {string} template - The HTML template containing embedded Awtsmoos scripts.
 * @param {Object} [context={}] - The context in which Awtsmoos scripts are executed.
 * @returns {Promise<string>} - The processed template with Awtsmoos scripts replaced by their outputs.
 */

// 

// List of shorthand commands that can be interpreted by the template
var short = {
    awtsmoos: `<script src="./scripts/awtsmoos/index.js"></script>`,
    login: `<a href="./login">Login</a><a href="./register">Register</a>`
};

async function processTemplate(template, context = {}, entire = false) {
    // Split the template into segments at each Awtsmoos script tag
    var code = template;
    // If a config object is provided in the context, use it to replace certain parts of the script
    if (context.config?.template?.replace) {
        for (var [key, value] of Object.entries(context.config.template.replace)) {
            if (typeof value === 'string') {
                code = code.split(key).join(value);
            }
        }
    }
    var segments = !entire ? code.split(/<\?Awtsmoos|\?>/g)
        : [0,code];

    // Array to hold the final values of each script segment
    var segmentObjects = Array.from({ length: segments.length });
    var sharedData = {};

    // Process each Awtsmoos script segment
    for (let i = 1; i < segments.length; i += 2) {
		
    
        await processSegment(segments,i,segmentObjects, context,sharedData);
		
    }

    // Join the segments back together to form the final template

    var isReplaced = false;
    var finalResult = "";
   
    // If any script segment indicated that it should replace the entire page, do so
    for(var i = 0; i < segmentObjects.length; i++) {
        if(isReplaced) continue;
        var segment = segmentObjects[i];
        if(!segment) {
			continue;
		} else if(segment == "skipme") {
			segments[i] = ""
		}
        
        var rep = (
            segment.bichayn ? (
            segment.bichayn.replace || 
            segment.bichayn.mawchleef) :
            context.olam.replace
        )
        if (typeof(rep) == "string") {
            finalResult = rep;
            isReplaced = true;
        } 
        
        
        if(segment.replaceWithReplaceText) {
            finalResult = segment.replace;
            isReplaced = true;
            
        }

        if(segment.doesBichaynReplaceAll) {
            
            finalResult = segment.bichayn;
            isReplaced = true;
            
        }

        if(segment.hasExports) {
            
            finalResult = segment.bichayn;
            isReplaced = true;
        }
		
		if(segment.doWeOnlyReplaceWithNextSegment) {
			if(segment.nextSegment) {
				finalResult = segment.nextSegment;
				isReplaced = true;
			}
		}
		
		if(segment.doWeSkipNextSegment) {
			segmentObjects[i + 1] = "skipme"
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
        
        finalResult = segments.join('');
		//finalResult = finalResult.slice(0, finalResult.length-1);
    }
    
    
    return finalResult;
}

async function processSegment(segments,i,segmentObjects,context,sharedData={}) {
	var nextHtml = segments[i];
    if(context.olam && context.olam.replace) {

        return "";
    }
    // The result of executing the current script
    let res;

    // Wrap the script processing in a try-catch block to handle errors
    // Wrap the script processing in a try-catch block to handle errors
try {
    // Prepare the execution context for the script
    context.sharedData = sharedData;
	context.$sd=context.sharedData;
    context.olam = {};     // The olam object for the script
    context.nextHtml = nextHtml;
    // The code of the script, wrapped in an immediately invoked function expression (IIFE)
    let code = `(async () => {
            var module = { exports: {},etsem:3 };
            var exports = module.exports;
            
            ${segments[i]}
            
            return { olam, module};
        })();
        
    `;

        
    let tochen = "";
    var hasExports = null;
    // Execute the script in a new VM context, spreading the context object and adding the "short" object
    var bichayn = await vm.runInNewContext(code, { ...context, short });
    
    
    // If there's any exported data, use that. Otherwise, proceed as normal.
    if (
        bichayn && 
        typeof(bichayn) == "object" && 
        bichayn.module && 
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

	var doWeOnlyReplaceWithNextSegment = context.olam.replaceWithNext === true;
    var doWeSkipNextSegment = context.olam.skipNextSemgment === true;
	var doesBichaynReplaceAll = context.olam.replace === true;
    var replaceWithReplaceText = typeof(context.olam.replace)
        == "string" ? context.olam.replace : false;
    
    // Save the return value, script code, and content for this script segment
    segmentObjects[i] = { 
        bichayn: tochen,
        doesBichaynReplaceAll,
        code, 
        replace: context.olam.replace,
        replaceWithReplaceText,
        segmentObject: tochen,
        hasExports,
        shouldReplace: context.olam.replace,
		doWeOnlyReplaceWithNextSegment,
		doWeSkipNextSegment,
		nextSegment:segments[i+1]
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
                thereWasAnAwtsmoosErrorHere: error.stack,
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
