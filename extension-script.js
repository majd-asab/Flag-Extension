var url = window.location.href;
var refinedUrl;
if (url.indexOf("://") > -1) {
	refinedUrl = url.split('/')[2];
}
else{
  refinedUrl = url.split('/')[0];
}

/*sending request to server*/
var req = new XMLHttpRequest();
req.open("GET","http://127.0.0.1:1302/"+refinedUrl,false);
req.send(null);

var ip = req.responseText.split(" ")[1];
var countryCode = req.responseText.split(" ")[2];
var flag = "flags/"+countryCode+".png";


/* append css sources to the header*/
var link1 = document.createElement("link");
document.head.appendChild(link1);
link1.rel ="stylesheet";
link1.href = chrome.extension.getURL("css/style.css");
//******* End of material design sources

/*creating div and appending to site*/
var div = document.createElement("div");
document.body.appendChild(div);
div.id = "flagExtension";

/*adding ip to div*/
div.textContent = ip;


/*adding image to div*/
var img = document.createElement("img");
div.appendChild(img);
img.id ="myFlag";
img.setAttribute("src",chrome.extension.getURL(flag));
