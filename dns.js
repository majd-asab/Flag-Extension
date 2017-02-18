const dns = require("dns");
const http = require("http");
const fs = require("fs");
const port = 1302;
var ipLocator =  require('./geo-ip-lookup.js');

/******************************************************************************
*Dns lookup function
*perfom dns lookup and finds the server's country of origin.
*******************************************************************************/
function dnsLookUp(url,cb){
	dns.lookup(url,function (err,addresses){
				if(err !== null){
					console.log("[ERROR]:" + err);
					}
				else{
									
					ipLocator.locateIP(addresses,function(data){
					var country = data.country.toString().toLowerCase();
					process.nextTick(function(){return cb(addresses +" " + country)});
					});

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
*DNS cache lookup.
*the function either returns that the file does not exist.
*OR
*logs the errors that could've occured.
*OR
*checks in the "dns-cache" file if the url exists, if so, return 1, indicating it exits
*else, will call the DNS lookup function, save the new value, and send it back to the client.
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
					var fullAddress = url+" "+address; //send url + ip 
					process.nextTick(function(){return cb(fullAddress)});
					fs.appendFile(__dirname+'/dns-cache.txt', fullAddress+"\n", function(err){
 					 if (err !== null){
						console.log(err);
					 }

			});
			});
		}
	});
}



/**************************************************************************
* return dns and url  from file IF "dns-cache" contains the address.
**************************************************************************/
function findLine(url,cb){
	fs.readFile(__dirname+'/dns-cache.txt', function (err, data)  {
	if(err !== null){
			console.log(err);		
	}
	else{
		var dataString = data.toString('utf-8'); //convert the file buffer into utf-8 string
		var splitLines = dataString.split("\n"); // split all by lines, to have 1 address/line
		splitLines.pop(); // remove the empty line

		for(var i = 0; i < splitLines.length; i++){
			if(splitLines[i].match(url) ){ // if the line from file matches the url, return to client.
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
		if(data === false){ //no "dns-cache" file. perfrom dns lookup and save in file.
			createDnsFile(url,function(addressFromLookUp){
			response.writeHead(200, {"Content-Type": "text/html"});		
			response.end(addressFromLookUp);
			});
		}
		else if(data === 1){ // address found in "dns-cache" file. return data to client.
			findLine(url,function(addressFromFile){
			response.writeHead(200, {"Content-Type": "text/html"});		
			response.end(addressFromFile);
			});
		}
		else{ // "dns-cache" file exits, but data no found. perform dns lookup and return to client.
			response.writeHead(200, {"Content-Type": "text/html"});		
			response.end(data);

		}
		
	});
}).listen(port);

console.log("listening on port " + port);
