//B"H
var http = require("http");
http.createServer((q,r)=>{
  r.setHeader("content-type","text/html");
  r.end("B\"H<br>Hi there! How are u doing today!??! Learning Rambam. Hi");
}).listen(process.env.PORT || 8080)
