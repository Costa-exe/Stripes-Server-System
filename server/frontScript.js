    function filesInfo () {
        const req = new XMLHttpRequest();
        req.open("GET",'./files.json',true);
        req.send();
        req.onload = function(){
            const json = JSON.parse(req.responseText);
            console.log(json);/* log da cancellare utile per i test (formato chiavi)*/
            json.forEach(file => {
                let name = document.createTextNode(file.name);
                let link = document.createElement("a");
                link.setAttribute("href", file.path);
                link.appendChild(name);
                link.appendChild(document.createElement("br"));
                container.appendChild(link);
            });    
        }
    }

    function mainLoader () {
        const container = document.getElementById("container");
        filesInfo();
    }



window.onload = mainLoader;