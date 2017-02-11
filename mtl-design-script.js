var url = window.location.href;
var refinedUrl;
if (url.indexOf("://") > -1) {
	refinedUrl = url.split('/')[2];
}
else{
  refinedUrl = url.split('/')[0];
}


	var req= new XMLHttpRequest();
	req.open("GET","http://127.0.0.1:1302/"+refinedUrl,false);
	req.send(null);


var ip = req.responseText.split(" ")[1];
var countryCode = req.responseText.split(" ")[2];
var flag = "flags/"+countryCode+".png";


	/*
	* append material design sources to the header
	*/
	var link1 = document.createElement("link");

	document.head.appendChild(link1);

	link1.rel ="stylesheet";

	link1.href = chrome.extension.getURL("css/style.css");
	//******* End of material design sources


	var div1 = document.createElement("div");
	var div1_1 = document.createElement("div");
	//var div1_2 = document.createElement("div");

	document.body.appendChild(div1);
	div1.id = "outterDiv";

	div1.appendChild(div1_1);
	div1_1.className = "chip";

	var img = document.createElement("img");
	div1_1.appendChild(img);

	img.setAttribute("src", chrome.extension.getURL(flag));

	var span = document.createElement("span");
	div1_1.appendChild(span);
	span.innerHTML = ip;


