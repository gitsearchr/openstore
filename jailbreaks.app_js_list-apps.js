function setupAppsWithCategory(category) {
    var httpReq = new XMLHttpRequest();
    httpReq.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) JSON.parse(this.responseText).forEach(element => {
            if (category != "featured" && element["category"] != category) return;
            if (category == "featured" && !element["featured"]) return;

            let li = document.createElement("li");
            let a = document.createElement("a");
            a.href = "#";
            a.style = "color: inherit";
            a.classList = "popup-open";
            a.setAttribute("data-popup", "#desc-popup");
            li.appendChild(a);

            let onclickDiv = document.createElement("div");
            onclickDiv.onclick = function() { setSelectedApp(`${element["name"]}`) };
            onclickDiv.classList = "item-content";
            a.appendChild(onclickDiv);

            let mediaDiv = document.createElement("div");
            mediaDiv.classList = "item-media";
            
            let img = document.createElement("img");
            img.style = "width:50px;height:50px;background-color:none;padding-top:7px;";
            img.src = element["icon"];

            mediaDiv.appendChild(img);
            onclickDiv.appendChild(mediaDiv);

            let innerDiv = document.createElement("div");
            innerDiv.classList = "item-inner";
            let div1 = document.createElement("div");
            div1.classList = "item-title-row";
            let div2 = document.createElement("div");
            div2.classList = "item-title";
            div2.innerHTML = element["name"];
            div1.appendChild(div2);
            let div3 = document.createElement("div");
            div3.classList = "item-title";
            div3.style = "color: #808080;";
            div3.innerHTML = element["version"];
            div1.appendChild(div3);
            let div4 = document.createElement("div");
            div4.classList = "item-title-row item-title";
            div4.style = "color: #808080";
            div4.innerHTML = element["dev"];
            let div5 = document.createElement("div");
            div5.classList = "item-title-row item-title";
            div5.style = "color: #808080; font-size: 14px;";
            div5.innerHTML = element["short-description"];
            innerDiv.appendChild(div1);
            innerDiv.appendChild(div4);
            innerDiv.appendChild(div5);
            onclickDiv.appendChild(innerDiv);

            let listContainer = "";
            if (category == "jailbreaks") listContainer = "jailbreaksAppsList";
            else if (category == "other") listContainer = "otherAppsList";
            else listContainer = "popularAppsList";
            document.getElementById(listContainer).appendChild(li);
        });
    };
    httpReq.open("GET", "./json/apps.json", true);
    httpReq.send();
}
