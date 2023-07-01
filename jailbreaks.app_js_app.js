var $$ = Dom7;

/*var w = document.createElement("canvas").getContext("webgl");
var d = w.getExtension('WEBGL_debug_renderer_info');
var g = d && w.getParameter(d.UNMASKED_RENDERER_WEBGL) || "";
if (navigator.userAgent.match(/iPad|iPhone|iPod/i) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) {
    if (g != "Apple GPU") {
        document.getElementById("settings-toggles").children[1].style.display = "none";
    }
} else {
    document.getElementById("settings-toggles").children[1].style.display = "none";
}*/
document.getElementById("settings-toggles").children[1].style.display = "none";

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

function setCookie(cname, cvalue) {
    document.cookie = cname + "=" + cvalue + ";path=/";
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

let colorMap = {
    "red": {
        "rgb": "225, 52, 74",
        "hex": "#e1344a"
    },
    "blue": {
        "rgb": "29, 161, 242",
        "hex": "#1da1f2"
    },
    "green": {
        "rgb": "2, 138, 15",
        "hex": "#028a0f"
    },
    "orange": {
        "rgb": "255, 165, 0",
        "hex": "#ffa500"
    },
    "blossom": {
        "rgb": "255, 192, 203",
        "hex": "#ffc0cb"
    },
    "purple": {
        "rgb": "106, 13, 173",
        "hex": "#6a0dad"
    },
    "teal": {
        "rgb": "0, 128, 128",
        "hex": "#008080"
    }
}

function changeColor() {
    // get cookie
    let color = getCookie("accentColor");
    // change meta tag
    document.querySelector('meta[name="theme-color"]').setAttribute("content", colorMap[color].hex);
    // change :root colors
    document.documentElement.style.setProperty("--f7-theme-color", colorMap[color].hex);
    document.documentElement.style.setProperty("--f7-theme-color-rgb", colorMap[color].rgb);
    // change link colors
    let links = document.getElementsByTagName("a");
    for (let i = 0; i < links.length; i++) {
        if (links[i].href && !links[i].classList.contains("button") && !links[i].classList.contains("tab-link") && !links[i].classList.contains("item-link") && links[i].getAttribute("data-popup") != "#desc-popup") {
            links[i].style.color = colorMap[color].hex;
        }
        if (links[i].classList.contains("dev-link")) links[i].style.color = colorMap[color].hex;
    }
    // change button colors
    let linkButtons = document.getElementsByClassName("button");
    for (var i = 0; i < linkButtons.length; i++) {
        linkButtons[i].style.backgroundColor = colorMap[color].hex;
    }
    document.getElementById("desc-popup-get-btn").style.backgroundColor = colorMap[color].hex;
    let buttons = document.getElementsByClassName("other-versions-button");
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].style.backgroundColor = colorMap[color].hex;
    }
}

var app = new Framework7({
	root: '#app',
	name: 'Jailbreaks',
	theme: 'ios'
});

// device info
var device = app.device;
var deviceType = '';
if (device.android) deviceType = "Android";
if (device.iphone) deviceType = 'iPhone';
if (device.ipad) deviceType = "iPad";
if (device.ipod) deviceType = "iPod Touch";
if (device.macos) deviceType = "Mac";
if (device.windows) deviceType = 'Windows';
if (deviceType == '') deviceType = 'Unknown';
document.getElementById("about-device").innerHTML = deviceType;

// status toggle
if (getCookie("statusCircle") == "") {
    setCookie("statusCircle", "true");
}
let statusCircleToggle = app.toggle.get('#status-circle-toggle');
if (getCookie("statusCircle") == "false") {
    statusCircleToggle.checked = false;
    document.getElementById("signed-status-image").style = "display:none";
}
statusCircleToggle.on('change', function (e) {
    if (statusCircleToggle.checked) {
        setCookie("statusCircle", "true");
        document.getElementById("signed-status-image").style.display = "block";
    } else {
        setCookie("statusCircle", "false");
        document.getElementById("signed-status-image").style = "display:none";
    }
})

// status toggle
if (getCookie("depictionAppColors") == "") {
    setCookie("depictionAppColors", "false");
}
let appColorToggle = app.toggle.get('#app-color-toggle');
if (getCookie("depictionAppColors") == "false") {
    appColorToggle.checked = false;
}
appColorToggle.on('change', function (e) {
    if (appColorToggle.checked) {
        setCookie("depictionAppColors", "true");
    } else {
        setCookie("depictionAppColors", "false");
    }
    app.dialog.confirm("You have toggled app colors in depictions. Refresh now to apply changes?", "Refresh",
        () => {
            location.reload();
        },
        () => {
            return
        }
    );
})

// apple silicon toggle
if (getCookie("appleSiliconAppInstalls") == "") {
    setCookie("appleSiliconAppInstalls", "false");
}
let appleSiliconToggle = app.toggle.get('#apple-silicon-toggle');
if (getCookie("appleSiliconAppInstalls") == "false") {
    appleSiliconToggle.checked = false;
}
appleSiliconToggle.on('change', function (e) {
    if (appleSiliconToggle.checked) {
        setCookie("appleSiliconAppInstalls", "true");
        $$(".desktop-install-stop").hide();
        $$("#desc-popup-get-btn").show();
    } else {
        setCookie("appleSiliconAppInstalls", "false");
        $$(".desktop-install-stop").show();
        $$("#desc-popup-get-btn").hide();
    }
})

// accent color toggle
if (getCookie("accentColor") == "") {
    setCookie("accentColor", "red");
    setCookie("accentColorHex", colorMap["red"].hex);
}
let currentColor = getCookie("accentColor");
let colorChanged = false
let picker = app.picker.create({
    inputEl: "#accent-color-picker",
    cols: [
        {
            textAlign: "center",
            values: ["Red", "Blue", "Green", "Orange", "Blossom", "Purple", "Teal"],
            onChange: function (picker, color) {
                setCookie("accentColorHex", colorMap[String(color).toLowerCase()].hex);
                setCookie("accentColor", String(color).toLowerCase());
                colorChanged = true;
            }
        },
    ],
});

picker.on("closed", (picker) => {
    if (colorChanged && getCookie("accentColor") != currentColor) {
        app.dialog.confirm("You have changed the accent color. Refresh now to apply changes?", "Refresh",
            () => {
                changeColor();
                location.reload();
            },
            () => {
                return
            }
        );
    }
})

if (getCookie("accentColor") != "red") {
    changeColor();
}

picker.setValue([capitalizeFirstLetter(String(getCookie("accentColor")))]);

// Fuck ethicalads - all my homies hate ethicalads
// var fixLinks = setInterval(function() {
// 	$("a").each(function() {
// 		if ($(this).attr('href').includes("ethicalads")) $(this).addClass("external");
// 	});
// }, 100);


if (navigator.userAgent.match(/iPad|iPhone|iPod/i) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) {
	$$('.desktop-only').hide();
    $$('.desktop-install-stop').hide();
    $$("#desc-popup-get-btn").show();
	if ('standalone' in navigator && !navigator.standalone && (/iPhone|iPod|iPad/i).test(navigator.platform) && (/Safari/i).test(navigator.appVersion)) $$('.tip').show();

	let version = (navigator.userAgent).match(/OS (\d)?\d_\d(_\d)?/i)[0].split('_')[0].replace("OS ","");

	if (version < 11) window.location.href = "legacy.html";
	if (version >= 13) {
        document.getElementById("settings-toggles").children[2].style.display = "none";

		if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
			$$('#toggle-dark').prop('checked', true);
			$$('#app').addClass('theme-dark');
		} else {
			$$('#toggle-dark').prop('checked', false);
			$$('#app').removeClass('theme-dark');
		}
	} else {
		if (localStorage.getItem('dark')) {
			$$('#toggle-dark').prop('checked', true);
			$$('#app').addClass('theme-dark');
		} else {
			$$('#toggle-dark').prop('checked', false);
			$$('#app').removeClass('theme-dark');
		}

		$$('#toggle-dark').on('change', function () {
			if ($$('#toggle-dark').prop('checked')) {
				$$('#app').addClass('theme-dark');
				localStorage.setItem('dark', 'dark');
			} else {
				$$('#app').removeClass('theme-dark');
				localStorage.removeItem('dark');
			}
		});
	}
} else {
    if (device.macos) {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            $$('#toggle-dark').prop('checked', true);
            $$('#app').addClass('theme-dark');
        } else {
            $$('#toggle-dark').prop('checked', false);
            $$('#app').removeClass('theme-dark');
        }
    }
    if (getCookie("appleSiliconAppInstalls") == "true") {
        $$(".desktop-install-stop").hide();
        $$("#desc-popup-get-btn").show();
    } else {
        $$(".desktop-install-stop").show();
        $$("#desc-popup-get-btn").hide();
    }
    $$(".tip").hide();
	$$('.mobile-only').hide();
	document.getElementById('desc-popup-icon').style.verticalAlign = "middle";
	document.getElementById('desc-popup-info1').style.verticalAlign = "middle";
	document.getElementById('desc-popup-info2').style.verticalAlign = "middle";
    document.getElementById("settings-toggles").children[2].style.display = "none";
	//$$('.toolbar').hide();
	//$$('.popularApps').hide();
}

window.matchMedia('(prefers-color-scheme: dark)').addEventListener("change", event => {
	var newColorScheme = event.matches ? "dark" : "light";
	if (newColorScheme == "dark") {
		$$('#toggle-dark').prop('checked', true);
		$$('#app').addClass('theme-dark');
	} else {
		$$('#toggle-dark').prop('checked', false);
		$$('#app').removeClass('theme-dark');
	}
});
