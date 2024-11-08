//B"H
/*testing if streaming works*/
var http = require("http")
http.createServer(async (q,r) => {
	
    r.writeHead(200, {
      'Content-Type': 'application/json',
      'Transfer-Encoding': 'chunked',
      'Awtsmoos': "yes"
  });
  for(var i = 0; i < 9; i++) {
			await new Promise(r =>(setTimeout(() => {r()}, 300)));
			r.write("WOW "+ i);
		}
		r.end("LOL");
  
}).listen(8082,()=>console.log("LIst"))
