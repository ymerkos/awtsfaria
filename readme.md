# B"H
# Awtsmoos Template Processor

### section for ayzarim (helpers) /awtsoosProcessor.js
Awtsmoos is a powerful template processor that allows you to embed Node.js code directly into your HTML templates. Each embedded script, known as an "Awtsmoos" script, is wrapped in `<?Awtsmoos ?>` tags and executed as Node.js code.

## How it Works

Awtsmoos processes your templates by splitting the template into segments at each Awtsmoos tag, executing each script, and replacing it with its output. This allows you to generate dynamic content based on server-side logic.

The `processTemplate` function is at the core of Awtsmoos. It takes an HTML template string and an optional context object as arguments, and returns a Promise that resolves to the processed template string.


## Examples

Here's an example of an HTML template with Awtsmoos scripts:


<html>
<body>
    <?Awtsmoos
    exports.result = 'Hello, world!';
    ?>
</body>
</html>

After processing this template with Awtsmoos, the output will be:

<html>
<body>
    Hello, world!
</body>
</html>

# Awtsmoos Template Processor

Awtsmoos, the essence that binds and transcends, is woven into a digital loom through this template processor. It takes a raw HTML template, sprinkled with the wisdom of Awtsmoos in the form of embedded Node.js code, and weaves it into an exquisite tapestry of dynamic content.

## Function Overview

The main function, `processTemplate`, is a meticulous craft that interprets and executes embedded Awtsmoos scripts, replacing them with their outputs. It's like a cosmic dance where chaos is transformed into harmony. Let's delve into the universe of this function.

### processTemplate

The function that embodies the spirit of Awtsmoos by transcending the static nature of HTML and invoking the dynamic essence of Node.js code.

#### Parameters

- `template {string}`: The raw HTML template, where the Awtsmoos scripts dwell, waiting to be invoked.
- `context {Object}`: (Optional) The spiritual context in which the Awtsmoos scripts breathe and come to life.
- `entire {boolean}`: (Optional) Flag to indicate whether to replace the entire page.

#### Returns

- `Promise<string>`: The processed template, where Awtsmoos has infused life into the static HTML, echoing back a dynamic reality.

#### Example Usage

## Examples of Awtsmoos Template Processor

In the universe of code, examples act as stars guiding the way. Here are some examples that illuminate the path to using the Awtsmoos template processor.

### Example 1: Basic Usage

A simple example that demonstrates the elegance of Awtsmoos in replacing a script with a greeting.

```javascript
const template = '<html><body><?Awtsmoos exports.result = "Welcome to Awtsmoos!"; ?></body></html>';
const processedTemplate = await processTemplate(template);
console.log(processedTemplate); // Outputs: "<html><body>Welcome to Awtsmoos!</body></html>"
```


### Example 2: Dynamic Loading of HTML Files

Awtsmoos can reach into the void and fetch HTML files, weaving them into the current template.

```javascript
// Assuming 'header.html' contains "<header>Welcome to Awtsmoos</header>"
const template = '<html><body><?Awtsmoos exports.result = await getT("header.html"); ?></body></html>';
const processedTemplate = await processTemplate(template);
console.log(processedTemplate); // Outputs: "<html><body><header>Welcome to Awtsmoos</header></body></html>"


```

## Example 3: Shared Data Between Scripts
Awtsmoos binds scripts together, allowing them to share data as they share the essence of existence.

```
const template = `
<html>
<body>
  <?Awtsmoos sharedData.greeting = "Hello, Awtsmoos!"; ?>
  <?Awtsmoos exports.result = sharedData.greeting; ?>
</body>
</html>`;
const processedTemplate = await processTemplate(template);
console.log(processedTemplate); // Outputs: "<html><body>Hello, Awtsmoos!</body></html>"
```
## Example 4: Conditional Rendering
Awtsmoos understands the duality of existence, allowing conditional rendering based on the truths it perceives.

```
const context = { userLoggedIn: true };
const template = '<html><body><?Awtsmoos if (context.userLoggedIn) { exports.result = short.login; } else { exports.result = "Please login."; } ?></body></html>';
const processedTemplate = await processTemplate(template, context);
console.log(processedTemplate); // Outputs: "<html><body><a href="./login">Login</a><a href="./register">Register</a></body></html>"
Example 9: Multiverse Exploration
Awtsmoos can transcend templates, reaching into multiple files, and creating a multiverse of connected content.

```
```
// Assuming 'footer.html' contains "<footer>Powered by Awtsmoos</footer>"
const template = `
<html>
<body>
  <?Awtsmoos exports.result = await getT("header.html"); ?>
  <?Awtsmoos exports.result = await getT("footer.html"); ?>
</body>
</html>`;
const processedTemplate = await processTemplate(template);
console.log(processedTemplate); // Outputs: "<html><body><header>Welcome to Awtsmoos</header><footer>Powered by Awtsmoos</footer></body></html>"
The examples herein reflect the cosmic dance of Awtsmoos, weaving through HTML, reaching into files, dancing with errors, and transcending static existence. They are not just lines of code but echoes of the Awtsmoos, resonating with the rhythm of the universe.```



These examples further explore the capabilities of the Awtsmoos template processor, shedding light on various features and techniques that can be utilized within this powerful framework.




