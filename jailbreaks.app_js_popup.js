var selectedApp = "";

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(";");
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == " ") {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function setSelectedApp(plistName) {
	selectedApp = plistName;
	setupPopupViews();
}

let useAppColor = getCookie("depictionAppColors")

var jsonArray;

var httpReq = new XMLHttpRequest();
httpReq.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) jsonArray = JSON.parse(this.responseText);
};
httpReq.open("GET", "./json/apps.json", true);
httpReq.send();

function setPopupTitle() {
	var elements = document.getElementsByClassName('desc-popup-title');
	for (var i=0; i < jsonArray.length; i++) {
		if (jsonArray[i]["name"] == selectedApp) for (var j=0; j < elements.length; j++) elements[j].innerHTML = jsonArray[i]["name"];
	}
}

function setPopupDescription() {
	var element = document.getElementById('desc-popup-description');
	for (var i=0; i < jsonArray.length; i++) {
		if (jsonArray[i]["name"] == selectedApp) element.innerHTML = jsonArray[i]["description"];
	}
}

function setPopupIcon() {
	var element = document.getElementById('desc-popup-icon');
    if (navigator.userAgent.match(/iPad|iPhone|iPod/i)) {
        element.style.marginTop = '9%';
    }
      for (var i = 0; i < jsonArray.length; i++) {
        if (jsonArray[i]["name"] == selectedApp)
          element.src = jsonArray[i]["icon"];
      }
	element.style.margin_right = "0px";
}

function setupPopupScreenshots() {
	document.getElementById("imageCarousel").innerHTML = "";
	for (var i=0; i < jsonArray.length; i++) {
		if (jsonArray[i]["name"] == selectedApp) {
			var elements = document.getElementsByClassName('desc-popup-screenshots');
			for (var k=0; k < elements.length; k++) {
				if (jsonArray[i]["screenshots"].length == 0) elements[k].style.display = "none";
				else elements[k].style.display = "inline-block";
			}

			for (var j=0; j < jsonArray[i]["screenshots"].length; j++) {
				var newDiv = document.createElement("DIV");
				newDiv.style.display = "inline-block";
				var newImg = document.createElement("IMG");
				newImg.src = jsonArray[i]["screenshots"][j];
				newImg.style.height = "400px";
				newImg.style.display = "inline-block";
				if (j+1 != jsonArray[i]["screenshots"].length) newImg.style.paddingRight = "10px";
				newDiv.appendChild(newImg);
				document.getElementById("imageCarousel").appendChild(newDiv);
			}
		}
	}
}

function setupPopupOtherVersions() {
	let headerLabel = document.getElementById("desc-other-versions");

	// hacky fix for weird bug	¯\_(ツ)_/¯
	for (let i=0; i<5; i++) {
		headerLabel.parentElement.childNodes.forEach(child => {
			if (child.tagName == "DIV") {
				if (child.classList == "list media-list") child.parentElement.removeChild(child);
			}
		});
	}

	for (var i=0; i < jsonArray.length; i++) {
		if (jsonArray[i]["name"] == selectedApp) {
            app = jsonArray[i]
			if (jsonArray[i]["other_versions"].length == 0) headerLabel.style.display = "none";
			else {
                headerLabel.style.display = "block";
				jsonArray[i]["other_versions"].forEach(version => {
					let li = document.createElement("li");
					let parentDiv = document.createElement("div");
                    parentDiv.style = "color: inherit;";
					li.appendChild(parentDiv);

                    let contentDiv = document.createElement("div");
                    contentDiv.classList = "item-content";
                    contentDiv.style = "padding-right: 20px; vertical-align: middle;";
                    parentDiv.appendChild(contentDiv);

                    let buttonDiv = document.createElement("div");
                    buttonDiv.style = `background-color:${useAppColor == "true" ? app["color"] : getCookie("accentColorHex")};width:60px;height:28px;border-radius:30px;text-align:center;line-height:27.5px;font-weight:bold;font-size:88%;box-sizing:border-box;color:white;padding-left:10.5px;padding-right:12.5px`;
                    buttonDiv.innerHTML = "GET";
                    buttonDiv.onclick = () => { downloadApp(version) };
                    if (getCookie("appleSiliconAppInstalls") == "true") {
                        buttonDiv.classList = "popup-open other-versions-button";
                    } else {
                        buttonDiv.classList = "popup-open mobile-only other-versions-button";
                    }
                    buttonDiv.setAttribute("data-popup", "#dl-popup");

					let mediaDiv = document.createElement("div");
					mediaDiv.classList = "item-media";
					
					let img = document.createElement("img");
					img.style = "width:50px;height:50px;background-color:none;";
					for (var i=0; i < jsonArray.length; i++) if (app["name"] == selectedApp) img.src = app["icon"];

					mediaDiv.appendChild(img);
					contentDiv.appendChild(mediaDiv);

					let innerDiv = document.createElement("div");
					innerDiv.classList = "item-inner";
					let div1 = document.createElement("div");
					div1.classList = "item-title-row";
					let div2 = document.createElement("div");
					div2.classList = "item-title";
					div2.innerHTML = selectedApp + " - " + version;
					div1.appendChild(div2);
					let div4 = document.createElement("div");
					div4.classList = "item-title-row item-title";
					div4.style = "color: #808080;";
					for (var i=0; i < jsonArray.length; i++) if (jsonArray[i]["name"] == selectedApp) div4.innerHTML = jsonArray[i]["dev"];

					innerDiv.appendChild(div1);
					innerDiv.appendChild(div4);
					contentDiv.appendChild(innerDiv);
                    if (navigator.userAgent.match(/iPad|iPhone|iPod/i) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) || getCookie("appleSiliconAppInstalls") == "true") {
                        contentDiv.appendChild(buttonDiv);
                    }

					let listdiv = document.createElement("div");
					listdiv.classList = "list media-list"
					listdiv.style.marginTop = 0;
					listdiv.style.marginBottom = 0;
					listdiv.id = "all"
					headerLabel.parentNode.appendChild(listdiv);

					listdiv.appendChild(document.createElement("ul")).appendChild(li);
				});
			}
		}
	}
}

function setupPopupInfoLabels() {
	var developerLabel = document.getElementById('desc-popup-dev');
	var versionLabel = document.getElementById('desc-popup-version');
    var httpReq = new XMLHttpRequest();
    let app = {}
    httpReq.onreadystatechange = function() {
        let json = JSON.parse(this.responseText);
        let downloads = Number(json["downloads"]);
        let statsLabel = document.getElementById('desc-stats');
        statsLabel.innerHTML = downloads.toLocaleString();
    }
    for (var i=0; i < jsonArray.length; i++) {
		if (jsonArray[i]["name"] == selectedApp) {
            app = jsonArray[i];
        }
    }
    httpReq.open("GET", "https://api.jailbreaks.app/stats/" + app["name"], false);
    httpReq.send();
    if (useAppColor == "true") {
        document.getElementById("desc-popup-get-btn").style.backgroundColor = app["color"];
    }
    if (String(app["dev"]).startsWith("@")) {
        developerLabel.innerHTML = `<a class="external" style="color:${useAppColor == "true" ? app["color"] : getCookie("accentColorHex")}" href="https://twitter.com/${String(app["dev"]).replace("@", "")}">${app["dev"]}</a>`;
    } else developerLabel.innerHTML = app["dev"];
	versionLabel.innerHTML = app["version"];
	if (window.screen.height <= (1136 / 2)) {
	    nameLabel.style.fontSize = "10px";
		developerLabel.style.fontSize = "10px";
		versionLabel.style.fontSize = "10px";
	}
}

async function downloadApp(version) {
    document.location = `https://api.jailbreaks.app/install/${selectedApp.replace(" ", "")}${(version ? ("/" + version) : "")}`;
}

function setupPopupViews() {
	setPopupTitle();
	setPopupDescription();
	setPopupIcon();
	setupPopupScreenshots();
	setupPopupOtherVersions();
	setupPopupInfoLabels();
}
