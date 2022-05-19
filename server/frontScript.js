    function filesInfo () {
        const req = new XMLHttpRequest();
        req.open("GET",'./files.json',true);
        req.send();
        req.onload = function () {
            const result = JSON.parse(req.responseText);
            fileListing(result, container);
            secondaryLoader();
        }
    }

    function secondaryLoader() {
        const foldernames = document.getElementsByClassName("foldtitle");
        const folderstatus = document.getElementsByClassName("folderstatus");
        /* loader folders */
        for (let i = 0; i < foldernames.length; i++) {
            foldernames[i].onclick = function () {
                if (document.getElementById(this.id + "-folder").style.display == 'block') {
                    document.getElementById(this.id + "-folder").style.display = 'none';
                    folderstatus[i].src = "./imgs/expand.svg";
                } else {
                    document.getElementById(this.id + "-folder").style.display = 'block';
                    folderstatus[i].src = "./imgs/minus.svg";
                }
                
            };
        }
    }

    function fileListing (x,p) {
        x.forEach(file => {
            if (file.type == "directory") {
                let span = document.createElement("span");
                let div = document.createElement("div");
                let name = document.createTextNode(file.name);
                let statusfolder = document.createElement("img");
                statusfolder.setAttribute("class", "folderstatus");
                statusfolder.setAttribute("src", "./imgs/expand.svg");
                let icon = document.createElement("img");
                icon.setAttribute("class", "folderico");
                icon.setAttribute("src", "./imgs/folder.svg");
                span.appendChild(statusfolder);
                span.appendChild(document.createTextNode(" | "));
                span.appendChild(icon);
                span.appendChild(document.createTextNode(" "));
                span.appendChild(name);
                span.setAttribute("id", file.name);
                span.setAttribute("class", "foldtitle");
                p.appendChild(span);
                p.appendChild(document.createElement("br"));
                div.setAttribute("class", "folder");
                div.setAttribute("id", file.name + "-folder");
                fileListing(file.children, div);
                p.appendChild(div);
            } else {
                let name = document.createTextNode(file.name);
                let link = document.createElement("a");
                link.setAttribute("href", file.path);
                link.appendChild(name);
                link.appendChild(document.createElement("br"));
                p.appendChild(link);
            }
        });
    }

    function mainLoader () {
        const container = document.getElementById("container");
        filesInfo();
    }



window.onload = mainLoader;