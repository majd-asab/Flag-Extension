const dns = require("dns");
const http = require("http");
const fs = require("fs");
const port = 1302;

/*
*Dns lookup function
*/
function dnsLookUp(url,cb){
	dns.lookup(url,function (err,addresses){
				if(err !== null){
					console.log("[ERROR]:" + err);
					}
				else{
					process.nextTick(function(){return cb(addresses)});
				}
			});
}


function createDnsFile(url,cb){
	dnsLookUp(url,function(address){			
		var data = url +" "+ address+"\n";
		fs.writeFile(__dirname+'/dns-Cache.txt',data, function (err)  {
			if (err !== null){
				console.log("[ERROR]: " + err);
			}
			else{
				process.nextTick(function(){return cb(data)});
			}
		});
	});
}


/*
*Checks for file existance
*Checks if dns lookup already exists
*/
function checkInFile(url,cb){
	fs.readFile(__dirname+'/dns-Cache.txt', function (err, data)  {
		var dataString = data.toString('utf-8');
		
		if(err !== null &&  err.code === "ENOENT"){
			process.nextTick(function(){return cb(false)});		
		}
		else if(err !== null &&  err.code !== "ENOENT"){
			console.log(err);		
		}
		else if(dataString.match(url)){ 
			//find the url and return the number next to it.
			console.log("found it");
			process.nextTick(function(){return cb(1)});
		}
		else{
			dnsLookUp(url,function(address){	
					process.nextTick(function(){return cb(address)});
					//append to file
					fs.appendFile(__dirname+'/dns-Cache.txt', address, function(err){
 					 if (err){
						console.log(err);
					 }

			});
			});
		}
	});
}

/*
* return dns and url 
*/
/***************************************************************************FIX MATCHING LINE AND RETURNING
function findLine(url,cb){
	fs.readFile(__dirname+'/dns-Cache.txt', function (err, data)  {
	if(err !== null){
			console.log(err);		
	}
	else{
		var dataString = data.toString('utf-8');
		var pattern = ".*"+url+".*";
		var r = new Regex(pattern);
		for (that string matching)
		{
				 process.nextTick(function(){return cb(m.Value)});
		}
	}
});
}
********************************************************************************/
http.createServer(function(request, response){
	const url = request.url.substring(1,request.url.length);
	
	//check in dns cached file
	checkInFile(url, function(data){
		if(data === false){//then file is not found, make it, perform dns lookup,save it send it to client
			createDnsFile(url,function(address){
			response.writeHead(200, {"Content-Type": "text/html"});		
			response.write(address);
			response.end();
			});
		}
		else if(data === 1){
			findLine(url,function(address){
			response.writeHead(200, {"Content-Type": "text/html"});		
			response.write(address);
			response.end();
			});
		}
		else{
			response.writeHead(200, {"Content-Type": "text/html"});		
			response.write(data);
			response.end();

		}
		
	});
}).listen(port);

console.log("listening on port " + port);
