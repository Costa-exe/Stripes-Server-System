    function filesInfo () {
        const req = new XMLHttpRequest();
        req.open("GET",'./files.json',true);
        req.send();
        req.onload = function () {
            const result = JSON.parse(req.responseText);
            fileListing(result);
            console.log(result);/* da cancellare, serve per vedere il pattern delle chiavi */
        }
    }

    function list (y, z) {
        y.forEach(child => {
            if (child.type == "directory") {
                let subdiv = document.createElement("div");
                subdiv.setAttribute("id", child.name);
                let name = document.createTextNode(child.name);
                let span = document.createElement("span");
                span.setAttribute("class", child.type); 
                span.appendChild(name);
                span.appendChild(document.createElement("br"));
                subdiv.appendChild(span);
                z.appendChild(subdiv);
                list(child.children, subdiv);
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
                let div = document.createElement("div");
                let name = document.createTextNode(file.name);
                let span = document.createElement("span");
                span.setAttribute("class", file.type); 
                span.appendChild(name);
                span.appendChild(document.createElement("br"));
                div.appendChild(span);
                div.setAttribute("id", file.name);
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