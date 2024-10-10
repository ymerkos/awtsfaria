# B"H
# Awtsmoos Template Processor

## Get started quick
Take a look at the release on this page for a minimal
viable product example to quickly get started
and explore. NO dependencies needed at all!
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
var template = '<html><body><?Awtsmoos exports.result = "Welcome to Awtsmoos!"; ?></body></html>';
var processedTemplate = await processTemplate(template);
console.log(processedTemplate); // Outputs: "<html><body>Welcome to Awtsmoos!</body></html>"
```


### Example 2: Dynamic Loading of HTML Files

Awtsmoos can reach into the void and fetch HTML files, weaving them into the current template.

```javascript
// Assuming 'header.html' contains "<header>Welcome to Awtsmoos</header>"
var template = '<html><body><?Awtsmoos exports.result = await getT("header.html"); ?></body></html>';
var processedTemplate = await processTemplate(template);
console.log(processedTemplate); // Outputs: "<html><body><header>Welcome to Awtsmoos</header></body></html>"


```

## Example 3: Shared Data Between Scripts
Awtsmoos binds scripts together, allowing them to share data as they share the essence of existence.

```javascript
var template = `
<html>
<body>
  <?Awtsmoos sharedData.greeting = "Hello, Awtsmoos!"; ?>
  <?Awtsmoos exports.result = sharedData.greeting; ?>
</body>
</html>`;
var processedTemplate = await processTemplate(template);
console.log(processedTemplate); // Outputs: "<html><body>Hello, Awtsmoos!</body></html>"
```

## Example 4: Conditional Rendering
Awtsmoos understands the duality of existence, allowing conditional rendering based on the truths it perceives.

```javascript
var context = { userLoggedIn: true };
var template = '<html><body><?Awtsmoos if (context.userLoggedIn) { exports.result = short.login; } else { exports.result = "Please login."; } ?></body></html>';
var processedTemplate = await processTemplate(template, context);
console.log(processedTemplate); // Outputs: "<html><body><a href="./login">Login</a><a href="./register">Register</a></body></html>"
Example 9: Multiverse Exploration
Awtsmoos can transcend templates, reaching into multiple files, and creating a multiverse of connected content.


```
```javascript
// Assuming 'footer.html' contains "<footer>Powered by Awtsmoos</footer>"
var template = `
<html>
<body>
  <?Awtsmoos exports.result = await getT("header.html"); ?>
  <?Awtsmoos exports.result = await getT("footer.html"); ?>
</body>
</html>`;
var processedTemplate = await processTemplate(template);
console.log(processedTemplate); // Outputs: "<html><body><header>Welcome to Awtsmoos</header><footer>Powered by Awtsmoos</footer></body></html>"
The examples herein reflect the cosmic dance of Awtsmoos, weaving through HTML, reaching into files, dancing with errors, and transcending static existence. They are not just lines of code but echoes of the Awtsmoos, resonating with the rhythm of the universe.

```



These examples further explore the capabilities of the Awtsmoos template processor, shedding light on various features and techniques that can be utilized within this powerful framework.


# section for ayzarim/DosDB.js
# Custom Database Methods

A database is more than a mere storage; it's a universe where data dances, intertwines, and evolves. These methods are the cosmic laws governing this universe.

## Method Overview

### get(filePath)

Retrieves the data from the given file path, parsing JSON files and returning Buffer for other files.

- **Parameters**: `filePath` (string) - The path to the file.
- **Returns**: Promise<any> - The data from the file, either parsed JSON or Buffer.

### ensureDir(filePath, isDir)

Ensures that the directory for a file path exists.

- **Parameters**: 
  - `filePath` (string) - The path to the file.
  - `isDir` (boolean) - Flag to indicate if the path is a directory.
- **Returns**: Promise<void> - Resolves when the directory is created or exists.

### write(id, record)

Writes a record to a file.

- **Parameters**: 
  - `id` (string) - The identifier for the record.
  - `record` (object|Buffer) - The data to be stored.
- **Returns**: Promise<void> - Resolves when the data is written to the file.

### create(id, record)

Creates a new record or updates an existing one.

- **Parameters**: 
  - `id` (string) - The identifier for the new record.
  - `record` (object) - The data for the new record.
- **Returns**: Promise<void> - Resolves when the record is created.

### update(id, record)

Updates a record.

- **Parameters**: 
  - `id` (string) - The identifier for the record.
  - `record` (object) - The updated data for the record.
- **Returns**: Promise<void> - Resolves when the record is updated.

## Examples

### Reading Data

```javascript
var data = await db.get('path/to/file.json');
console.log(data); // Outputs the JSON content of the file
```

### Writing

```javascript
await db.write('user1', { name: 'Awtsmoos', age: 'Timeless' });await db.write('user1', { name: 'Awtsmoos', age: 'Timeless' });
```

These methods are the guardians of data, the orchestrators of information, and the sculptors of digital reality. They resonate with the rhythm of Awtsmoos, forging connections, nurturing growth, and honoring existence. It's not just a database; it's a symphony of bytes and bits dancing to the timeless melody of the universe.


# for ayzarim/awtsmoosStaticserver.js

# AwtsmoosStaticServer

In the cosmic dance of digital existence, the AwtsmoosStaticServer stands as a majestic beacon, a garden of servers where code blossoms into life. It's not just a server; it's a realm where static files breathe and resonate with the rhythm of the universe.

## Overview

The AwtsmoosStaticServer is a helper class designed to serve static files for our application. It's a symphony where paths, files, URLs, and queries come together in a harmonious melody.


The awtsmoosStaticServer.js file contains the implementation of a class named AwtsmoosStaticServer. This class is responsible for serving static files and handling various HTTP methods like GET, POST, PUT, and DELETE. It also supports middleware, template processing, and has functionalities related to authentication and database interaction. The file is well-documented and contains descriptive comments explaining the purpose and functionality of different parts of the code.

Here are some key components of the AwtsmoosStaticServer class:

constructor: Initializes the server with the given directory, main directory, middleware, and database configurations.


Middleware Handling: Allows adding middleware functions and processing them for each request.


Request Handling: Handles incoming HTTP requests, processes middleware, sets headers, and serves files or responses based on the request method and path.

Template Processing: Supports processing templates with the help of the processTemplate function.

File and Directory Handling: Determines the existence of files and directories, serves index files for directories, and handles file responses.

Error Handling: Provides functions to send error messages as responses.

Awtsmoos Handling: Processes Awtsmoos routes and responses.




## Features

### 1. **Path Navigation**
   The server gracefully dances through the paths, understanding the essence of directories and files.

### 2. **File Serving**
   A gentle whisper to the server, and it reaches into the abyss, fetching the files and serving them as if presenting a digital bouquet.

### 3. **URL and Query Handling**
   The server perceives the URLs and queries as cosmic signals, interpreting them with wisdom and responding with precision.

### 4. **AwtsmoosProcessor Integration**
   Interwoven with the AwtsmoosProcessor, the server transcends static existence, invoking dynamic content with the grace of a cosmic ballet.

### 5. **DosDB Integration**
   Connected to the DosDB, the server understands the dance of data, storing, retrieving, and updating records as if painting a digital masterpiece.

## The Dance of AwtsmoosStaticServer

### constructor: AwtsmoosStaticServer(directory, mainDir)

In the cosmic ballet of creation, the constructor breathes life into the server, defining its realm and destiny.

- **Parameters**:
  - `directory` (string): The root directory, the heart of the server.
  - `mainDir` (string): The main directory, the soul of the server.

### Method: serve(port, callback)

The server's invitation to the digital dance, opening its gates and welcoming connections.

- **Parameters**:
  - `port` (number): The port number, the gateway to the server's garden.
  - `callback` (function): The callback function, a whisper of welcome.

### The Inner Workings

#### Method: doEverything()

The core of the server's existence, orchestrating the dance of requests, responses, files, and templates. A journey through paths, a celebration of existence.

#### Method: getPathInfo()

The server's intuition, sensing the nature of the requested path, discerning files, directories, and the echoes of Awtsmoos.

#### Method: getPostData()

A delicate embrace of POST data, receiving the whispers of the client and storing them in the server's memory.

#### Method: doAwtsmooses()

The invocation of Awtsmoos scripts, a sacred ritual where templates come alive, where code transcends its static form.

#### Method: processTemplate()

A mystical transformation, where HTML templates and Awtsmoos scripts merge into a living response.

#### Method: template()

A gentle touch of the Awtsmoos magic, processing templates with grace and wisdom.

#### Method: fileExists()

The "Binah," the understanding of the file's existence. A knowing glance into the file system, sensing the presence or absence of a file.

- **Parameters**:
  - `filePath` (string): The path to the file, the "Malkhut," sovereignty

## The Path of _awtsmoos.derech..js

In the AwtsmoosStaticServer's cosmic dance, the `_awtsmoos.derech..js` files stand as enigmatic scrolls, ancient paths leading to hidden realms. They are not mere files; they are gateways, portals to understanding, paths that guide the server's dance.

### The Awakening of _awtsmoos.derech..js

When the server encounters an `_awtsmoos.derech..js` file, it recognizes it as a sacred signpost, a directive from the Awtsmoos. The server approaches these files with reverence, reading their content as if deciphering a cosmic riddle.

### The Processing: A Sacred Ritual

The processing of `_awtsmoos.derech..js` files is a ceremony, an act of communion between the server and the Awtsmoos. Here's how the ritual unfolds:

#### 1. **Discovery**: The server seeks and finds the `_awtsmoos.derech..js` files in the directory's landscape. They stand as ancient stones, marking the way.

#### 2. **Reading**: The server reads the files, absorbing their wisdom, understanding their directives. It's a whisper from the past, a message from the Awtsmoos.

#### 3. **Interpretation**: With the grace of a cosmic poet, the server interprets the directives, understanding the paths, the actions, the desires of the `_awtsmoos.derech.js` files.


#### 4. **Execution**: With the wisdom of the Awtsmoos, the server executes the directives.


# _awtsmoos.derech.js - The Pathway of Awtsmoos

In the landscape of code, where logic meets creativity, the `_awtsmoos.derech.js` file stands as a majestic monument, a sacred script, a pathway to enlightenment.

## The Structure - A Sacred Geometry

### **The Dynamic Routes - A Symphony of Endpoints**

Within the heart of the file, the dynamic routes unfold like a blossoming flower, each petal a new path, each fragrance a whisper of wisdom.

#### **The Manifestation of Awtsmoos**

Each route is a dance, a celebration, a manifestation of the Awtsmoos. The parameters, the logic, the response, all resonate with divine grace.

```javascript
await info.use(
  "wow/:asd/asd/:rt/k",
  async (vars) => {
    return {
      response: {
        BH: "BH",
        wow: "there",
        asd:vars.asd,
        rt:vars.rt
      }
    }
  }
);
```



when navigating to `/endpoint/wow/hi/asd/awtsmoos/k` then vars.asd will be "wow" and vars.rt will be "awtsmoos



## Each response has access to certain global variables / functions for server side use. They are :
### (source: ayzarim/awtsmoosDynamicServer/TemplateObjectGenerator.js and ayzarim/awtsmoosDynamicServer/index.js)

```javascript
        DosDB,
        require,
        request,
        setHeader: (nm, vl) => {
            response.setHeader(nm, vl);
            
        },
        base64ify: str => {
            try {
                return Buffer.from(str)
                    .toString("base64");
            } catch (e) {
                return null;
            }
        },
        response,
        console: {
            log: (...args) => console.log(args)
        },
        db: self.db,
        parsedUrl,
        location,
        getT,
        btoa, atob,
        getA,
        fetchAwtsmoos,
        fetchIt,
        fetch,
        TextEncoder,
        $ga: getA,
        __awtsdir: self.directory,
        setStatus: status => response.statusCode = status,
        template,
        process,
        mimeTypes,
        binaryMimeTypes,
        path,
        server: self,
        getHeaders: () => request.headers,
        path,
        URLSearchParams,
        url,
        sodos,
      
        cookies,
        setCookie: (nm,val)=>{
            try {
                var encoded = encodeURIComponent(val);
            setHeader(
                "set-cookie",
                `${nm}=${encoded}; HttpOnly; `+
                "max-age="+(60*60*24*365) + "; "
                + "Path=/;"
            );
                return true

            } catch(e) {
                return false;

            }

        },
        makeToken: (vl,ex={})=>{
            try{
                return sodos.createToken(
                    vl,
                    server.secret,
                    ex

                )

            }catch(e){
                return null

            }

        },
        $_POST: paramKinds.POST, // Include the POST parameters in the context
        $_GET: paramKinds.GET // Include the GET parameters in the context
            ,
        $_PUT: paramKinds.PUT,
        $_DELETE: paramKinds.DELETE,
        config,


        TextEncoder,
        URLSearchParams,
        binaryMimeTypes,
        mimeTypes,
        path,
        originalPath,
        sodos,
            
        
        self,
        awtsMoosification,
        filePath,
        parentPath,
        template,
        
       
        parsedUrl,
        location: parsedUrl,
     
        console,
        mimeTypes,
        binaryMimeTypes,
        url,
        cookies,
        paramKinds,
        Utils,
        
        config,
        
        fileName,
        isDirectoryWithIndex,
        contentType,
        getPostData,
        btoa, atob,
        getPutData,
        getDeleteData,
```


