    function filesInfo () {
        const container = document.getElementById("container");
        const uploadfolders = document.getElementById("location-box");
        const req = new XMLHttpRequest();
        const req2 = new XMLHttpRequest();
        const req3 = new XMLHttpRequest();
        req.open("GET", '/ex/files.json',true);
        req.send();
        req.onload = function () {
            const result = JSON.parse(req.responseText);
            fileListing(result, container);
            folders(result, uploadfolders);
            secondaryLoader();
        }
        req2.open("GET", '/ex/sysinfo.json', true);
        req2.send();
        req2.onload = function () {
            const result = JSON.parse(req2.responseText);
            document.getElementById("platinfo").appendChild(document.createTextNode(result.distro + " " + result.release + " " + result.arch));
        }
        req3.open("GET", '/ex/meminfo.json', true);
        req3.send();
        req3.onload = function () {
            const result = JSON.parse(req3.responseText);
            let sizeused;
            let sizefree;
            if (result.free >= 1000000000000) {
                sizefree = (result.free/1000000000000).toFixed(2) + " Tb";
            } else if (result.free >= 1000000000) {
                sizefree = (result.free/1000000000).toFixed(2) + " Gb";
            } else if (result.free >= 1000000) {
                sizefree = (result.free/1000000).toFixed(2) + " Mb";
            } else if (result.free >= 1000) {
                sizefree = (result.free/1000).toFixed(2) + " Kb";
            } else {
                sizefree = result.free + " bytes";
            }
            if (result.size >= 1000000000000) {
                sizeused = ((result.size-result.free)/1000000000000).toFixed(2) + " Tb";
            } else if (result.size >= 1000000000) {
                sizeused = ((result.size-result.free)/1000000000).toFixed(2) + " Gb";
            } else if (result.size >= 1000000) {
                sizeused = ((result.size-result.free)/1000000).toFixed(2) + " Mb";
            } else if (result.size >= 1000) {
                sizeused = ((result.size-result.free)/1000).toFixed(2) + " Kb";
            } else {
                sizeused = (result.size-result.free) + " bytes";
            }
            document.getElementById("storageused").style.width = (((result.size-result.free) * 100)/result.size) + "%";
            document.getElementById("usedtext").innerHTML = sizeused;
            document.getElementById("freetext").innerHTML = sizefree;
        }
    }

    var countlvl = 1;

    function folders (o, z) {
        o.forEach(file => {
            if (file.type == "directory"){
                let divf = document.createElement("div");
                let div = document.createElement("div");
                div.setAttribute("class", "divUpLoc")
                let name = document.createElement("span");
                let nameText = document.createTextNode(file.path + "/");
                let lvl = document.createElement("span");
                let lvltxt = document.createTextNode("Lv " + countlvl + "- ");
                lvl.appendChild(lvltxt);
                name.appendChild(nameText);
                name.setAttribute("class", "upLoc");
                div.appendChild(lvl);
                div.appendChild(name);
                if (file.size >= 1000000000000) {
                    div.appendChild(document.createTextNode(" (" + (file.size/1000000000000).toFixed(2) + " Tb)"));
                } else if (file.size >= 1000000000) {
                    div.appendChild(document.createTextNode(" (" + (file.size/1000000000).toFixed(2) + " Gb)"));
                } else if (file.size >= 1000000) {
                    div.appendChild(document.createTextNode(" (" + (file.size/1000000).toFixed(2) + " Mb)"));
                } else if (file.size >= 1000) {
                    div.appendChild(document.createTextNode(" (" + (file.size/1000).toFixed(2) + " Kb)"));
                } else {
                    div.appendChild(document.createTextNode(" (" + file.size + " bytes" + ")"));
                }
                countlvl++;
                folders(file.children, div);
                countlvl--;
                z.appendChild(div);
            } else {
                let div = document.createElement("div");
                div.setAttribute("class", "divUpLocFiles");
                let name = document.createElement("span");
                let nameText = document.createTextNode("- " + file.name);
                name.appendChild(nameText);
                name.setAttribute("id", file.path);
                name.setAttribute("class", "upLocF");
                div.appendChild(name);
                if (file.size >= 1000000000000) {
                    div.appendChild(document.createTextNode(" (" + (file.size/1000000000000).toFixed(2) + " Tb)"));
                } else if (file.size >= 1000000000) {
                    div.appendChild(document.createTextNode(" (" + (file.size/1000000000).toFixed(2) + " Gb)"));
                } else if (file.size >= 1000000) {
                    div.appendChild(document.createTextNode(" (" + (file.size/1000000).toFixed(2) + " Mb)"));
                } else if (file.size >= 1000) {
                    div.appendChild(document.createTextNode(" (" + (file.size/1000).toFixed(2) + " Kb)"));
                } else {
                    div.appendChild(document.createTextNode(" (" + file.size + " bytes" + ")"));
                }
                z.appendChild(div);
            }
        });
    }

    function secondaryLoader() {
        const uploadico = document.getElementById("upload-icon-root");
        const uploadbutton = document.getElementById("uploadpost");
        const foldernames = document.getElementsByClassName("foldtitle");
        const folderstatus = document.getElementsByClassName("folderstatus");
        const spanUps = document.getElementsByClassName("upLoc");
        const spanUpsF = document.getElementsByClassName("upLocF");
        const removeico = document.getElementById("remove-icon-root");
        const filesremove = document.getElementsByClassName("divUpLocFiles");
    
        /* loader folders */
        for (let i = 0; i < foldernames.length; i++) {
            foldernames[i].onclick = function () {
                if (document.getElementById(this.id + "-folder").style.display == 'block') {
                    document.getElementById(this.id + "-folder").style.display = 'none';
                    folderstatus[i].src = "./imgs/expand.svg";
                    foldernames[i].style.backgroundColor = '#ffffff';
                    document.getElementsByClassName("path")[i].style.color = '#c0bbbb';
                } else {
                    document.getElementById(this.id + "-folder").style.display = 'block';
                    folderstatus[i].src = "./imgs/minus.svg";
                    foldernames[i].style.backgroundColor = '#c0bbbb';
                    document.getElementsByClassName("path")[i].style.color = '#ffffff';
                }
                
            };
        }
        for (let i = 0; i < document.getElementsByClassName("closehover").length; i++) {
            let actual;
            document.getElementsByClassName("closehover")[i].onmouseover = function () {
                actual = this.getAttributeNode("src").value;
                this.setAttribute("src", "./imgs/closehover.svg");
            }
            document.getElementsByClassName("closehover")[i].onmouseout = function () {
                this.setAttribute("src", actual);
            }
        }
        /* menu */
        document.getElementById("daynight").onmouseover = function () {
            this.setAttribute("src", "./imgs/daynight2.svg");
        }
        document.getElementById("daynight").onmouseout = function () {
            this.setAttribute("src", "./imgs/daynight.svg");
        }
        document.getElementById("menuIcon").onmouseover = function () {
            this.setAttribute("src", "./imgs/menu2.svg");
        }
        document.getElementById("menuIcon").onmouseout = function () {
            this.setAttribute("src", "./imgs/menu1.svg");
        }
        document.getElementById("infosmenu").onmouseover = function () {
            this.setAttribute("src", "./imgs/info2.svg");
        }
        document.getElementById("infosmenu").onmouseout = function () {
            this.setAttribute("src", "./imgs/info.svg");
        }
        document.getElementById("infosmenu").onclick = function () {
            document.getElementById("infos").style.display = 'block';
        }
        document.getElementById("closeinfos").onclick = function () {
            document.getElementById("infos").style.display = 'none';
        }
        document.getElementById("menuIcon").onclick = function () {
            document.getElementById("actionsback").style.display = "flex";
            document.getElementById("close2").style.display = "block";
            document.getElementById("actions").style.display = "flex";
        }
        document.getElementById("close2").onclick = function () {
            document.getElementById("actionsback").style.display = "none";
            document.getElementById("close2").style.display = "none";
            document.getElementById("actions").style.display = "none";
        }
        /* remove */
        removeico.onclick = function () {
            document.getElementById("backgroundBlock").style.display = "block";
            document.getElementById("post-actions").style.display = "block";
            document.getElementById("boxes").style.display = "block";
            document.getElementById("removing").style.display = "block";
            for (let i = 0; i < filesremove.length; i++) {
                filesremove[i].style.display = "block";
            }
        };
        /* format */
        document.getElementById("formatdata").onclick = function () {
            document.getElementById("blockformat").style.display = "block";
            document.getElementById("formatcontainer").style.display = "flex";
        }
        document.getElementById("closeformat").onclick = function () {
            document.getElementById("blockformat").style.display = "none";
            document.getElementById("formatcontainer").style.display = "none";
        }
        /* checkboxes filter */
        document.getElementById("showfiles").onclick = function () {
            if (document.getElementById("showfiles").checked == true) {
                document.getElementById("showfolders").checked = false;
                document.getElementById("showfolders").disabled = true;
                for (let i = 0; i < spanUps.length; i++) {
                    spanUps[i].style.color = '#c0bbbb';
                    spanUps[i].style.cursor = 'auto';
                    spanUps[i].onmouseover = function () {
                        this.style.backgroundColor = "#ffffff";
                    }
                    spanUps[i].onmouseout = function () {
                        this.style.color = '#c0bbbb';
                        this.style.cursor = 'auto';
                    }
                }
                for (let i = 0; i < spanUpsF.length; i++) {
                    spanUpsF[i].style.color = '#000000';
                    spanUpsF[i].style.cursor = 'pointer';
                    spanUpsF[i].onmouseover = function () {
                        this.style.backgroundColor = '#aca8a8';
                        this.style.color = '#ffffff';
                    }
                    spanUpsF[i].onmouseout = function () {
                        this.style.backgroundColor = '#ffffff';
                        this.style.color = '#000000';
                    }
                }
            }
            if ((document.getElementById("showfiles").checked == false) && (document.getElementById("showfolders").checked == false)){
                document.getElementById("showfolders").disabled = false;
                for (let i = 0; i < spanUps.length; i++) {
                    spanUps[i].style.color = '#000000';
                    spanUps[i].style.cursor = 'pointer';
                }
                for (let i = 0; i < spanUpsF.length; i++) {
                    spanUpsF[i].style.color = '#000000';
                    spanUpsF[i].style.cursor = 'pointer';
                }
                for (let i = 0; i < spanUps.length; i++) {
                    spanUps[i].onmouseover = function () {
                        this.style.backgroundColor = '#aca8a8';
                        this.style.color = '#ffffff';
                    }
                    spanUps[i].onmouseout = function () {
                        this.style.backgroundColor = '#ffffff';
                        this.style.color = '#000000';
                    }
                }
                for (let i = 0; i < spanUpsF.length; i++) {
                    spanUpsF[i].onmouseover = function () {
                        this.style.backgroundColor = '#aca8a8';
                        this.style.color = '#ffffff';
                    }
                    spanUpsF[i].onmouseout = function () {
                        this.style.backgroundColor = '#ffffff';
                        this.style.color = '#000000';
                    }
                    
                }
                document.getElementById("locDelLabel").innerHTML = "";
                document.getElementById("typerem").value = "";
                document.getElementById("removepost").disabled = true;
            }
        }
        document.getElementById("showfolders").onclick = function () {
            if (document.getElementById("showfolders").checked == true) {
                document.getElementById("showfiles").checked = false;
                document.getElementById("showfiles").disabled = true;
                for (let i = 0; i < spanUps.length; i++) {
                    spanUps[i].style.color = '#000000';
                    spanUps[i].style.cursor = 'pointer';
                    spanUps[i].onmouseover = function () {
                        this.style.backgroundColor = '#aca8a8';
                        this.style.color = '#ffffff';
                    }
                    spanUps[i].onmouseout = function () {
                        this.style.backgroundColor = '#ffffff';
                        this.style.color = '#000000';
                    }
                }
                for (let i = 0; i < spanUpsF.length; i++) {
                    spanUpsF[i].style.color = '#c0bbbb';
                    spanUpsF[i].style.cursor = 'auto';
                    spanUpsF[i].onmouseover = function () {
                        this.style.backgroundColor = "#ffffff";
                    }
                    spanUpsF[i].onmouseout = function () {
                        this.style.color = '#c0bbbb';
                        this.style.cursor = 'auto';
                    }
                }
            }
            if ((document.getElementById("showfolders").checked == false) && (document.getElementById("showfiles").checked == false)){
                document.getElementById("showfiles").disabled = false;
                for (let i = 0; i < spanUps.length; i++) {
                    spanUps[i].style.color = '#000000';
                    spanUps[i].style.cursor = 'pointer';
                }
                for (let i = 0; i < spanUpsF.length; i++) {
                    spanUpsF[i].style.color = '#000000';
                    spanUpsF[i].style.cursor = 'pointer';
                }
                for (let i = 0; i < spanUps.length; i++) {
                    spanUps[i].onmouseover = function () {
                        this.style.backgroundColor = '#aca8a8';
                        this.style.color = '#ffffff';
                    }
                    spanUps[i].onmouseout = function () {
                        this.style.backgroundColor = '#ffffff';
                        this.style.color = '#000000';
                    }
                }
                for (let i = 0; i < spanUpsF.length; i++) {
                    spanUpsF[i].onmouseover = function () {
                        this.style.backgroundColor = '#aca8a8';
                        this.style.color = '#ffffff';
                    }
                    spanUpsF[i].onmouseout = function () {
                        this.style.backgroundColor = '#ffffff';
                        this.style.color = '#000000';
                    }
                    
                }
                document.getElementById("locDelLabel").innerHTML = "";
                document.getElementById("typerem").value = "";
                document.getElementById("removepost").disabled = true;
                
            }
        }
        for (let i = 0; i < spanUpsF.length; i++) {
            spanUpsF[i].onclick = function () {
                if ((document.getElementById("showfiles").checked == true) && (document.getElementById("showfolders").checked == false)) {
                    if (this.dataset.visible == "true") {
                        this.dataset.visible = "false";
                        document.getElementById(this.id + "toEliminate").remove();
                        document.getElementById(this.id + "-input").remove();
                    } else {
                        this.dataset.visible = "true";
                        let div = document.createElement("div");
                        let input = document.createElement("input");
                        input.setAttribute("type", "text");
                        input.setAttribute("name", "locationremoved");
                        input.setAttribute("class", "filesremoved");
                        input.setAttribute("value", this.id);
                        input.setAttribute("id", this.id + "-input");
                        div.setAttribute("id", this.id + "toEliminate");
                        div.setAttribute("class", "divdel");
                        let divtext = document.createTextNode(this.id);
                        div.appendChild(divtext);
                        document.getElementById("locDelLabel").appendChild(div);
                        document.getElementById("removing").appendChild(input);
                    }
                    if (document.getElementsByClassName("divdel").length > 0) {
                        document.getElementById("typerem").value = "file";
                        document.getElementById("removepost").disabled = false;
                    } else {
                        document.getElementById("typerem").value = "";
                        document.getElementById("removepost").disabled = true;
                    }
                }
            }
        }
        for (let i = 0; i < spanUps.length; i++) {
            spanUps[i].onclick = function () {
                if ((document.getElementById("showfiles").checked == false) && (document.getElementById("showfolders").checked == true)) {
                    if (this.dataset.visible == "true") {
                        this.dataset.visible = "false";
                        document.getElementById(this.innerHTML + "toEliminate").remove();
                        document.getElementById(this.innerHTML + "-input").remove();
                    } else {
                        this.dataset.visible = "true";
                        let div = document.createElement("div");
                        div.setAttribute("id", this.innerHTML + "toEliminate");
                        div.setAttribute("class", "divdel");
                        let divtext = document.createTextNode(this.innerHTML);
                        div.appendChild(divtext);
                        document.getElementById("locDelLabel").appendChild(div);
                        let input = document.createElement("input");
                        input.setAttribute("type", "text");
                        input.setAttribute("name", "locationremoved");
                        input.setAttribute("class", "filesremoved");
                        input.setAttribute("value", this.innerHTML);
                        input.setAttribute("id", this.innerHTML + "-input");
                        document.getElementById("removing").appendChild(input);
                    }
                    if (document.getElementsByClassName("divdel").length > 0) {
                        document.getElementById("typerem").value = "folder";
                        document.getElementById("removepost").disabled = false;
                    } else {
                        document.getElementById("typerem").value = "";
                        document.getElementById("removepost").disabled = true;
                    }
                }
                /* uploader -- do not modify */
                if (document.getElementById("uploading").style.display == "block") {
                    document.getElementById("finalloc").value = this.innerHTML;
                }
            }
        }
        /* icon uploader menu */
        uploadico.onclick = function () {
            document.getElementById("post-actions").style.display = "block";
            document.getElementById("uploading").style.display = "block";
            document.getElementById("backgroundBlock").style.display = "block";
            document.getElementById("finalloc").value = "stored/";
        };
        document.getElementById("fileselector").onchange = function () {
            if (this.files.length > 0) {
                uploadbutton.disabled = false;
            } else {
                uploadbutton.disabled = true;
            }
        }
        /* forms button close "X" */
        document.getElementById("closeActions").onclick = function () {
            for (let i = 0; i < document.getElementsByClassName("divUpLocFiles").length; i++) {
                document.getElementsByClassName("divUpLocFiles")[i].style.display = "none";
            }
            document.getElementById("showfolders").disabled = false;
            document.getElementById("showfiles").disabled = false;
            document.getElementById("removepost").disabled = true;
            document.getElementById("backgroundBlock").style.display = "none";
            document.getElementById("post-actions").style.display = "none";
            document.getElementById("uploading").style.display = "none";
            document.getElementById("boxes").style.display = "none";
            document.getElementById("removing").style.display = "none";
            document.getElementById("showfolders").checked = false;
            document.getElementById("showfiles").checked = false;
            document.getElementById("locDelLabel").innerHTML = "";
            for (let i = 0; i < filesremove.length; i++) {
                filesremove[i].style.display = "none";
            }
            for (let i = 0; i < spanUps.length; i++) {
                spanUps[i].style.color = '#000000';
                spanUps[i].style.cursor = 'pointer';
            }
            for (let i = 0; i < spanUpsF.length; i++) {
                spanUpsF[i].style.color = '#000000';
                spanUpsF[i].style.cursor = 'pointer';
            }
            for (let i = 0; i < spanUps.length; i++) {
                spanUps[i].onmouseover = function () {
                    this.style.backgroundColor = '#aca8a8';
                    this.style.color = '#ffffff';
                }
                spanUps[i].onmouseout = function () {
                    this.style.backgroundColor = '#ffffff';
                    this.style.color = '#000000';
                }
            }
            for (let i = 0; i < spanUpsF.length; i++) {
                spanUpsF[i].onmouseover = function () {
                    this.style.backgroundColor = '#aca8a8';
                    this.style.color = '#ffffff';
                }
                spanUpsF[i].onmouseout = function () {
                    this.style.backgroundColor = '#ffffff';
                    this.style.color = '#000000';
                }
                
            }
    
        }
    }

    function fileListing (x,p) {
        x.forEach(file => {
            if (file.type == "directory") {
                let span = document.createElement("div");
                let div = document.createElement("div");
                let name = document.createTextNode(file.name);
                let statusfolder = document.createElement("img");
                let path = document.createElement("span");
                if (file.size >= 1000000000000) {
                    path.appendChild(document.createTextNode(file.path + ", " + (file.size/1000000000000).toFixed(2) + " Tb"));
                } else if (file.size >= 1000000000) {
                    path.appendChild(document.createTextNode(file.path + ", " + (file.size/1000000000).toFixed(2) + " Gb"));
                } else if (file.size >= 1000000) {
                    path.appendChild(document.createTextNode(file.path + ", " + (file.size/1000000).toFixed(2) + " Mb"));
                } else if (file.size >= 1000) {
                    path.appendChild(document.createTextNode(file.path + ", " + (file.size/1000).toFixed(2) + " Kb"));
                } else {
                    path.appendChild(document.createTextNode(file.path + ", " + file.size + " bytes"));
                }
                path.setAttribute("id", file.path);
                path.setAttribute("class", "path");
                statusfolder.setAttribute("class", "folderstatus");
                statusfolder.setAttribute("src", "./imgs/expand.svg");
                let icon = document.createElement("img");
                icon.setAttribute("class", "folderico");
                icon.setAttribute("src", "./imgs/folder.svg");
                span.appendChild(statusfolder);
                span.appendChild(document.createTextNode(" | "));
                span.appendChild(icon);
                span.appendChild(name);
                span.appendChild(path);
                span.setAttribute("id", file.name);
                span.setAttribute("class", "foldtitle");
                p.appendChild(span);
                div.setAttribute("class", "folder");
                div.setAttribute("id", file.name + "-folder");
                fileListing(file.children, div);
                p.appendChild(div);
            } else {
                let name = document.createTextNode(file.name);;
                let link = document.createElement("a");
                let div = document.createElement("div");
                let size = document.createElement("span");
                if (file.size >= 1000000000000) {
                    size.appendChild(document.createTextNode((file.size/1000000000000).toFixed(2) + " Tb"));
                } else if (file.size >= 1000000000) {
                    size.appendChild(document.createTextNode((file.size/1000000000).toFixed(2) + " Gb"));
                } else if (file.size >= 1000000) {
                    size.appendChild(document.createTextNode((file.size/1000000).toFixed(2) + " Mb"));
                } else if (file.size >= 1000) {
                    size.appendChild(document.createTextNode((file.size/1000).toFixed(2) + " Kb"));
                } else {
                    size.appendChild(document.createTextNode(file.size + " bytes"));
                }
                div.setAttribute("class", "file");
                link.setAttribute("href", file.path);
                link.appendChild(name);
                link.setAttribute("class", "textfile");
                div.appendChild(link);
                size.setAttribute("class", "sizes");
                div.appendChild(size);
                p.appendChild(div);
            }
        });
    }

window.onload = filesInfo;