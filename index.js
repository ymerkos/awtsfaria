//B"H
var http = require("http");
http.createServer((q,r)=>{
  r.end("B\"H<br>Hi there! How are u doign?!");
}).listen(process.env.PORT || 8080)
