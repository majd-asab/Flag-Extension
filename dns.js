const dns = require("dns");
const http = require("http");
const fs = require("fs");
const port = 1302;

/******************************************************************************
*Dns lookup function
*******************************************************************************/
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



/*********************************************************************************
*looks up dns and creates file
**********************************************************************************/
function createDnsFile(url,cb){
	dnsLookUp(url,function(address){			
		var data = url +" "+ address+"\n";
		fs.writeFile(__dirname+'/dns-cache.txt',data, function (err)  {
			if (err !== null){
				console.log("[ERROR]: " + err);
			}
			else{
				process.nextTick(function(){return cb(data)});
			}
		});
	});
}


/*************************************************************************************
*Checks for file existance
*Checks if dns lookup already exists
**************************************************************************************/
function checkInFile(url,cb){
	fs.readFile(__dirname+'/dns-cache.txt', function (err, data)  { 

		//file not found handling
		if(err !== null &&  err.code === "ENOENT"){
			process.nextTick(function(){return cb(false)});		
		}

		//other errors
		else if(err !== null &&  err.code !== "ENOENT"){
			console.log(err);		
		}

		else if(data.toString('utf-8').match(url)){ 
			//find the url and return the number next to it.
			process.nextTick(function(){return cb(1)});
		}
		else{
			dnsLookUp(url,function(address){	
					process.nextTick(function(){return cb(address)});
					//append to file
					fs.appendFile(__dirname+'/dns-cache.txt', url+" "+address+"\n", function(err){
 					 if (err){
						console.log(err);
					 }

			});
			});
		}
	});
}



/**************************************************************************
* return dns and url  from file
**************************************************************************/
function findLine(url,cb){
	fs.readFile(__dirname+'/dns-cache.txt', function (err, data)  {
	if(err !== null){
			console.log(err);		
	}
	else{
		var dataString = data.toString('utf-8');
		var splitLines = dataString.split("\n");
		splitLines.pop();

		
		for(var i = 0; i < splitLines.length; i++){
			if(splitLines[i].match(url) ){
				var data = splitLines[i];
				process.nextTick(function(){return cb(data)});
			}
		}
		
	}
});
}



/*******************************************************************************
* Server 
*******************************************************************************/
http.createServer(function(request, response){
	const url = request.url.substring(1,request.url.length);
	
	//check in dns cached file
	checkInFile(url, function(data){
		if(data === false){
			createDnsFile(url,function(addressFromLookUp){
			response.writeHead(200, {"Content-Type": "text/html"});		
			response.write(addressFromLookUp);
			response.end();
			});
		}
		else if(data === 1){
			findLine(url,function(addressFromFile){
			response.writeHead(200, {"Content-Type": "text/html"});		
			response.write(addressFromFile);
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
