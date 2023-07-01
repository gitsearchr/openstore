function setupCircle() {
    var httpReq = new XMLHttpRequest();
    httpReq.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let json = JSON.parse(this.responseText);
            let status = json["status"];
            if (status == "Signed") {
                document.getElementById("signed-status-image").classList.add("signed-dot");
            } else {
                document.getElementById("signed-status-image").classList.add("revoked-dot");
            }
            document.getElementById("signed-status-label").innerHTML = " " + status;

            if (status != "Signed") return;
            Array.from(document.getElementsByClassName("hide-if-signed")).forEach(div => {
                div.style = "display:none;";
            });
        }
    };
    httpReq.open("GET", "https://api.jailbreaks.app/status", true);
    httpReq.send();
}
