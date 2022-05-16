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

    function fileListing (x) {
        x.forEach(file => {
            if (file.type == "directory") {
                let name = document.createTextNode(file.name);
                let span = document.createElement("span");
                span.setAttribute("class", file.type);
                span.appendChild(name);
                span.appendChild(document.createElement("br"));
                container.appendChild(span);
                function subListing () {
                    let subdiv = document.createElement("div");
                    subdiv.setAttribute("class", "sub-dir");
                    file.children.forEach(child => {
                        if (child.type == "directory") {
                            let name = document.createTextNode(child.name);
                            let span = document.createElement("span");
                            span.setAttribute("class", child.type);
                            span.appendChild(name);
                            span.appendChild(document.createElement("br"));
                            subdiv.appendChild(span);
                            subListing();
                        } else {
                            let name = document.createTextNode(child.name);
                            let link = document.createElement("a");
                            link.setAttribute("href", child.path);
                            link.appendChild(name);
                            link.appendChild(document.createElement("br"));
                            subdiv.appendChild(link);
                        }
                    });
                    container.appendChild(subdiv);
                }
                subListing();
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