var url = window.location.href;
var refinedUrl;
if (url.indexOf("://") > -1) {
	refinedUrl = url.split('/')[2];
}
else{
  refinedUrl = url.split('/')[0];
}

var div = document.createElement("div");
document.body.appendChild(div);
div.id = "flagExtension";


/**needs to be removed and link the css file
var doc = document.getElementById("flagExtension");
doc.style.position = "fixed";
doc.style.bottom= "0px";
doc.style.right= "0px";
doc.style.fontSize= "12px";
doc.style.color= "#000000";
doc.style.cursor= "default";
doc.style.zIndex= "1000";
doc.style.lineHeight= "1";
doc.style.verticalAlign= "baseline";
doc.style.background= "#e3e3e3";
doc.style.padding= "5px";
doc.style.borderWidth= "1px 1px 0px";
doc.style.borderStyle= "solid";
doc.style.borderColor= "#d3d3d3";
doc.style.borderBottom= "0px";
doc.style.outline= "0px";
doc.style.margin= "3px";
doc.style.display="inline-block";
**/ 


var req= new XMLHttpRequest();
req.open("GET","http://127.0.0.1:1302/"+refinedUrl,false);
req.send(null);

div.textContent = req.responseText.split(" ")[1];
var countryCode = req.responseText.split(" ")[2];


var img = document.createElement("img");
div.appendChild(img);
img.id ="imFlag";
var flag = "flags/"+countryCode+".png";

img.setAttribute("src",chrome.extension.getURL(flag));
img.setAttribute("width","19px");
img.setAttribute("height","19px");
img.style.zIndex ="9999";
img.style.display ="inline-block";
img.style.margin= "4px";
