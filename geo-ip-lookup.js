var geoip2 = require('geoip2');

function ipLocator(ip,cb){
	geoip2.init();

	geoip2.lookupSimple(ip, function(error, result) {
	  if (error) {
	    console.log("Error: %s", error);
	  }
	  else if (result) {
	    process.nextTick(function(){return cb(result)});
	  }
	});
}

module.exports.locateIP = ipLocator;
