//B"H
var http = require("http");
http.createServer((q,r)=>{
  r.end("B\"H<br>Hi!");
}).listen(process.env.PORT || 8080)
