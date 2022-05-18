    function filesInfo () {
        const req = new XMLHttpRequest();
        req.open("GET",'./files.json',true);
        req.send();
        req.onload = function () {
            const result = JSON.parse(req.responseText);
            fileListing(result);
            secondaryLoader();
        }
    }

    function secondaryLoader() {
        const foldernames = document.getElementsByClassName("foldtitle");
        /* loader folders */
        for (let i = 0; i < foldernames.length; i++) {
            foldernames[i].onclick = function () {
                if (document.getElementById(this.id + "-folder").style.display == 'block') {
                    document.getElementById(this.id + "-folder").style.display = 'none';
                } else {
                    document.getElementById(this.id + "-folder").style.display = 'block';
                }
                
            };
        }
    }

    function list (y, z) {
        y.forEach(child => {
            if (child.type == "directory") {
                let subdiv = document.createElement("div");
                subdiv.setAttribute("id", child.name + "-folder");
                subdiv.setAttribute("class", "folder");
                let name = document.createTextNode(" + " + child.name);
                let span = document.createElement("span");
                span.appendChild(name);
                span.appendChild(document.createElement("br"));
                span.setAttribute("id", child.name);
                span.setAttribute("class", "foldtitle");
                z.appendChild(span);
                list(child.children, subdiv);
                z.appendChild(subdiv);
            } else {
                let name = document.createTextNode(child.name);
                let link = document.createElement("a");
                link.setAttribute("href", child.path);
                link.appendChild(name);
                link.appendChild(document.createElement("br"));
                z.appendChild(link);
            }
        });
    }

    function fileListing (x) {
        x.forEach(file => {
            if (file.type == "directory") {
                let span = document.createElement("span");
                let div = document.createElement("div");
                let name = document.createTextNode(" + " + file.name);
                span.appendChild(name);
                span.appendChild(document.createElement("br"));
                span.setAttribute("id", file.name);
                span.setAttribute("class", "foldtitle");
                container.appendChild(span);
                div.setAttribute("class", "folder");
                div.setAttribute("id", file.name + "-folder");
                list(file.children, div);
                container.appendChild(div);
            } else {
                let name = document.createTextNode(file.name);
                let link = document.createElement("a");
                link.setAttribute("href", file.path);
                link.appendChild(name);
                link.appendChild(document.createElement("br"));
                container.appendChild(link);
            }
        });
    }

    function mainLoader () {
        const container = document.getElementById("container");
        filesInfo();
    }



window.onload = mainLoader;