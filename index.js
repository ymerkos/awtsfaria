//B"H
var http = require("http");
http.createServer((request, response) => {
    const filePath = './geelooy' + request.url;
    const extname = String(path.extname(filePath)).toLowerCase();

    let contentType = 'text/html';

    if (extname == '.js') {
        contentType = 'application/javascript';
    }

    fs.readFile(filePath, (errors, content) => {
        if (!errors) {
            response.writeHead(200, { 'Content-Type': contentType });
            response.end(content, 'utf-8');
        } else {
            console.log(errors);
        }
    });

}).listen(8080);
