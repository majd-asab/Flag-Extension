const dns = require("dns");
const http = require("http");
const fs = require("fs");
const port = 1302;

function readWriteToFile(url,cb){
	fs.readFile(__dirname+'/bla.txt', function (err, data)  {
  if (err !== null){
		console.log("[ERROR]: " + err);
}
else{
  	process.nextTick(function(){return cb(data)});
	}
});
}

http.createServer(function(request, response){
	const url = request.url.substring(1,request.url.length);
	readWriteToFile(url, function(data){

		console.log("in server "+data);
		
			dns.lookup(url,function (err,addresses){
			if(err !== null){
				console.log("[ERROR]:" + err);
				}
			else{
				console.log(addresses);
				response.writeHead(200, {"Content-Type": "text/html"});		
				response.write(addresses);
				response.end();
			}
		});
});
}).listen(port);

console.log("listening on port " + port);
