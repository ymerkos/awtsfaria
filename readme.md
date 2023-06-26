#B"H
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

A more complex example would be a template that includes a command to replace the entire page with the result of the script:

<html>
<body>
    <?Awtsmoos
    exports.result = 'Hello, world!';
    $_etsem
    replace
    _$
    ?>
</body>
</html>

In this case, the entire page will be replaced with the text 'Hello, world!'.

Another example demonstrates the use of the setName command and shared data between scripts:


<html>
<body>

    <?Awtsmoos
    //<script>
    /*can add scipt tags with
        comments since it's treated as JavaScript
        by NodeJS but in your
        code editor it would treat it as JS
    */
    exports.result = 'This is snippet one.';
    exports.someValue = 42;
    $_etsem
    setName("snippetOne")
    _$

    //</script>
    ?>

    <?Awtsmoos
    const snippetOneValue = sharedData.snippetOne.someValue;
    exports.result = 'This is snippet two. Snippet one had the value: ' + snippetOneValue;
    ?>
</body>
</html>

In the second script, we are accessing the someValue that was exported by the first script. The processed page would look like this:

<html>
<body>
    This is snippet one.
    This is snippet two. Snippet one had the value: 42
</body>
</html>
These examples should give you a good idea of how Awtsmoos works and what it can do. If you need to do something that isn't covered by these examples, don't hesitate to experiment and see what's possible!





