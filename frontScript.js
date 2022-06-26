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
                name.dataset.foldername = file.name;
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
                let nameText = document.createTextNode(file.name);
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
                if (document.getElementById(this.id + "-folder" + this.dataset.pathid).style.display == 'block') {
                    document.getElementById(this.id + "-folder" + this.dataset.pathid).style.display = 'none';
                    folderstatus[i].src = "./imgs/expand.svg";
                    foldernames[i].style.backgroundColor = '#ffffff';
                    document.getElementsByClassName("path")[i].style.color = '#c0bbbb';
                } else {
                    document.getElementById(this.id + "-folder" + this.dataset.pathid).style.display = 'block';
                    folderstatus[i].src = "./imgs/minus.svg";
                    foldernames[i].style.backgroundColor = '#c0bbbb';
                    document.getElementsByClassName("path")[i].style.color = '#ffffff';
                }
                
            };
        }
        document.getElementById("close2").onmouseover = function () {
            document.getElementById("close2").setAttribute("src", "./imgs/closehover.svg");
        }
        document.getElementById("close2").onmouseout = function () {
            document.getElementById("close2").setAttribute("src", "./imgs/close2.svg");
        }
        document.getElementById("closeActions").onmouseover = function () {
            document.getElementById("closeActions").setAttribute("src", "./imgs/closehover.svg");
        }
        document.getElementById("closeActions").onmouseout = function () {
            document.getElementById("closeActions").setAttribute("src", "./imgs/close.svg");
        }
        document.getElementById("backlog").onmouseover = function () {
            document.getElementById("backlog").setAttribute("src", "./imgs/closehover.svg");
        }
        document.getElementById("backlog").onmouseout = function () {
            document.getElementById("backlog").setAttribute("src", "./imgs/close.svg");
        }
        document.getElementById("closeinfos").onmouseover = function () {
            document.getElementById("closeinfos").setAttribute("src", "./imgs/closehover.svg");
        }
        document.getElementById("closeinfos").onmouseout = function () {
            document.getElementById("closeinfos").setAttribute("src", "./imgs/close.svg");
        }
        document.getElementById("log").onclick = function () {
            let h3 = document.createElement("h3");
            h3.setAttribute("id", "logWarning");
            h3.appendChild(document.createTextNode("Date Format is YYYY - MM - DD, hr:min:sec"));
            document.getElementById("logs").appendChild(h3);
            let req4 = new XMLHttpRequest();
            req4.open("GET", '/ex/log.json', true);
            req4.send();
            req4.onload = function () {
                let result = JSON.parse(req4.responseText);
                result.forEach(action => {
                    for (const [key, value] of Object.entries(action)) {
                        let para = document.createElement("p");
                        let span = document.createElement("span");
                        span.setAttribute("class", "spanforlog");
                        let text1 = document.createTextNode(key + " ");
                        let text2 = document.createTextNode(value);
                        span.appendChild(text1);
                        para.appendChild(span);
                        para.appendChild(text2);
                        document.getElementById("logs").appendChild(para);
                    }
                })
            }
            document.getElementById("logcontents").style.display = "block";
        }
        document.getElementById("backlog").onclick = function () {
            document.getElementById("logcontents").style.display = "none";
            document.getElementById("logs").innerHTML = "";
        }
        document.getElementById("uploadpost").onclick = function () {
            document.getElementById("upload-screen").style.display = "block";
            document.getElementById("closeActions").style.display = "none";
            document.getElementById("location-box").style.display = "none";
            document.getElementById("uploading").style.display = "none";
        }
        document.getElementById("removepost").onclick = function () {
            document.getElementById("title-temp").innerHTML = "Deleting, Please Wait";
            document.getElementsByClassName("upload-screen-warning")[0].innerHTML = "Deleting time changes according to the size of the files";
            document.getElementById("boxes").style.display = "none";
            document.getElementById("upload-screen").style.display = "block";
            document.getElementById("closeActions").style.display = "none";
            document.getElementById("location-box").style.display = "none";
            document.getElementById("removing").style.display = "none";
        }
        document.getElementById("renameButton").onclick = function () {
            document.getElementById("title-temp").innerHTML = "Renaming, Please Wait";
            document.getElementsByClassName("upload-screen-warning")[0].innerHTML = "Renaming time changes according to the size of the files";
            document.getElementById("upload-screen").style.display = "block";
            document.getElementById("closeActions").style.display = "none";
            document.getElementById("location-box").style.display = "none";
            document.getElementById("renaming").style.display = "none";
        }
        document.getElementById("copybutton").onclick = function () {
            document.getElementById("title-temp").innerHTML = "Copying, Please Wait";
            document.getElementsByClassName("upload-screen-warning")[0].innerHTML = "Copying time changes according to the size of the files";
            document.getElementById("CheckToCopyPathPara").style.display = "none";
            document.getElementById("upload-screen").style.display = "block";
            document.getElementById("closeActions").style.display = "none";
            document.getElementById("location-box").style.display = "none";
            document.getElementById("copydata").style.display = "none";
        }
        document.getElementById("zipbutton").onclick = function () {
            document.getElementById("title-temp").innerHTML = "Zipping Files, Please Wait";
            document.getElementsByClassName("upload-screen-warning")[0].innerHTML = "Zipping time changes according to the size of the files";
            document.getElementById("upload-screen").style.display = "block";
            document.getElementById("closeActions").style.display = "none";
            document.getElementById("location-box").style.display = "none";
            document.getElementById("zipping").style.display = "none";
        }
        document.getElementById("movebutton").onclick = function () {
            document.getElementById("title-temp").innerHTML = "Moving Files, Please Wait";
            document.getElementsByClassName("upload-screen-warning")[0].innerHTML = "Moving time changes according to the size of the files";
            document.getElementById("CheckToMovePathPara").style.display = "none";
            document.getElementById("upload-screen").style.display = "block";
            document.getElementById("closeActions").style.display = "none";
            document.getElementById("location-box").style.display = "none";
            document.getElementById("moving").style.display = "none";
        }
        /* menu */
        document.getElementById("log").onmouseover = function () {
            this.setAttribute("src", "./imgs/log2.svg");
        }
        document.getElementById("log").onmouseout = function () {
            this.setAttribute("src", "./imgs/log1.svg");
        }
        document.getElementById("logout").onmouseover = function () {
            this.setAttribute("src", "./imgs/logout2.svg");
        }
        document.getElementById("logout").onmouseout = function () {
            this.setAttribute("src", "./imgs/logout1.svg");
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
            document.getElementById("close2-cont").style.display = "flex";
            document.getElementById("actions").style.display = "flex";
        }
        document.getElementById("close2").onclick = function () {
            document.getElementById("actionsback").style.display = "none";
            document.getElementById("close2-cont").style.display = "none";
            document.getElementById("actions").style.display = "none";
        }
        /* zip */
        document.getElementById("zip-icon-root").onclick = function () {
            for (let i = 0; i < filesremove.length; i++) {
                filesremove[i].style.display = "block";
            }
            document.getElementById("backgroundBlock").style.display = "block";
            document.getElementById("post-actions").style.display = "block";
            document.getElementById("zipping").style.display = "block";
        }
        /* move */
        document.getElementById("move-icon-root").onclick = function () {
            for (let i = 0; i < filesremove.length; i++) {
                filesremove[i].style.display = "block";
            }
            document.getElementById("backgroundBlock").style.display = "block";
            document.getElementById("post-actions").style.display = "block";
            document.getElementById("moving").style.display = "block";
            document.getElementById("CheckToMovePathPara").style.display = "block";
        }
        /* copy */
        document.getElementById("copy-icon-root").onclick = function () {
            for (let i = 0; i < filesremove.length; i++) {
                filesremove[i].style.display = "block";
            }
            document.getElementById("backgroundBlock").style.display = "block";
            document.getElementById("post-actions").style.display = "block";
            document.getElementById("copydata").style.display = "block";
            document.getElementById("CheckToCopyPathPara").style.display = "block";
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
        /* copy checkboxes */
        document.getElementById("CheckToCopyPath").onclick = function () {
            if (this.checked == false) {
                document.getElementById("copybutton").disabled = true;
                document.getElementById("pathcopy").disabled = true;
                for (let i = 0; i < document.getElementsByClassName("divUpLocFiles").length; i++) {
                    document.getElementsByClassName("divUpLocFiles")[i].style.display = "block";
                }
            } else {
                document.getElementById("copybutton").disabled = false;
                document.getElementById("pathcopy").disabled = false;
                for (let i = 0; i < document.getElementsByClassName("divUpLocFiles").length; i++) {
                    document.getElementsByClassName("divUpLocFiles")[i].style.display = "none";
                }
            }
        }
        /* move checkboxes */
        document.getElementById("CheckToMovePath").onclick = function () {
            if (this.checked == false) {
                document.getElementById("movebutton").disabled = true;
                document.getElementById("pathmove").disabled = true;
                for (let i = 0; i < document.getElementsByClassName("divUpLocFiles").length; i++) {
                    document.getElementsByClassName("divUpLocFiles")[i].style.display = "block";
                }
            } else {
                document.getElementById("movebutton").disabled = false;
                document.getElementById("pathmove").disabled = false;
                for (let i = 0; i < document.getElementsByClassName("divUpLocFiles").length; i++) {
                    document.getElementsByClassName("divUpLocFiles")[i].style.display = "none";
                }
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
                /* copy */
                if (document.getElementById("copydata").style.display == "block") {
                    if (document.getElementById("CheckToCopyPath").checked == false) {
                        if (this.dataset.visible == "true") {
                            this.dataset.visible = "false";
                            document.getElementById(this.id + "tocopyspan").remove();
                            document.getElementById(this.id + "-tocopy").remove();
                            document.getElementById(this.id + "-tocopyname").remove();
                        } else {
                            this.dataset.visible = "true";
                            let div = document.createElement("div");
                            let input = document.createElement("input");
                            input.setAttribute("type", "text");
                            input.setAttribute("name", "locationtocopy");
                            input.setAttribute("class", "filestocopy");
                            input.setAttribute("value", this.id);
                            input.setAttribute("id", this.id + "-tocopy");
                            let input2 = document.createElement("input");
                            input2.setAttribute("type", "text");
                            input2.setAttribute("name", "locationtocopyname");
                            input2.setAttribute("id", this.id + "-tocopyname");
                            input2.setAttribute("class", "filestocopy");
                            input2.setAttribute("value", this.innerHTML);
                            div.setAttribute("id", this.id + "tocopyspan");
                            div.setAttribute("class", "divcop");
                            let divtext = document.createTextNode(this.id);
                            div.appendChild(divtext);
                            document.getElementById("copyList").appendChild(div);
                            document.getElementById("copydata").appendChild(input);
                            document.getElementById("copydata").appendChild(input2);
                        }
                    }
                    if (document.getElementsByClassName("divcop").length > 0) {
                        document.getElementById("CheckToCopyPath").disabled = false;
                    } else {
                        document.getElementById("CheckToCopyPath").disabled = true;
                    }
                }
                /* zip */
                if (document.getElementById("zipping").style.display == "block") {
                    if (this.dataset.visible == "true") {
                        this.dataset.visible = "false";
                        document.getElementById(this.id + "-tozip").remove();
                        document.getElementById(this.id + "tozipspan").remove();
                        document.getElementById(this.id + "-tozipname").remove();
                    } else {
                        this.dataset.visible = "true";
                        let div = document.createElement("div");
                        let input2 = document.createElement("input");
                        input2.setAttribute("type", "text");
                        input2.setAttribute("name", "locationtozipname");
                        input2.setAttribute("class", "filestozip");
                        input2.setAttribute("value", this.innerHTML);
                        input2.setAttribute("id", this.id + "-tozipname");
                        let input = document.createElement("input");
                        input.setAttribute("type", "text");
                        input.setAttribute("name", "locationtozip");
                        input.setAttribute("class", "filestozip");
                        input.setAttribute("value", this.id);
                        input.setAttribute("id", this.id + "-tozip");
                        div.setAttribute("id", this.id + "tozipspan");
                        div.setAttribute("class", "divzip");
                        let divtext = document.createTextNode(this.id);
                        div.appendChild(divtext);
                        document.getElementById("zipList").appendChild(div);
                        document.getElementById("zipping").appendChild(input);
                        document.getElementById("zipping").appendChild(input2);
                    }
                    if (document.getElementsByClassName("filestozip").length > 0) {
                        document.getElementById("zipbutton").disabled = false;
                        document.getElementById("zipnamefinal").disabled = false;
                    } else {
                        document.getElementById("zipbutton").disabled = true;
                        document.getElementById("zipnamefinal").disabled = true;
                    }
                }
                /* moving */
                if (document.getElementById("moving").style.display == "block") {
                    if (this.dataset.visible == "true") {
                        this.dataset.visible = "false";
                        document.getElementById(this.id + "-tomove").remove();
                        document.getElementById(this.id + "tomovespan").remove();
                        document.getElementById(this.id + "-tomovename").remove();
                    } else {
                        this.dataset.visible = "true";
                        let div = document.createElement("div");
                        let input2 = document.createElement("input");
                        input2.setAttribute("type", "text");
                        input2.setAttribute("name", "locationtomovename");
                        input2.setAttribute("class", "filestomove");
                        input2.setAttribute("value", this.innerHTML);
                        input2.setAttribute("id", this.id + "-tomovename");
                        let input = document.createElement("input");
                        input.setAttribute("type", "text");
                        input.setAttribute("name", "locationtomove");
                        input.setAttribute("class", "filestomove");
                        input.setAttribute("value", this.id);
                        input.setAttribute("id", this.id + "-tomove");
                        div.setAttribute("id", this.id + "tomovespan");
                        div.setAttribute("class", "divmove");
                        let divtext = document.createTextNode(this.id);
                        div.appendChild(divtext);
                        document.getElementById("moveList").appendChild(div);
                        document.getElementById("moving").appendChild(input);
                        document.getElementById("moving").appendChild(input2);
                    }
                    if (document.getElementsByClassName("filestomove").length > 0) {
                        document.getElementById("CheckToMovePath").disabled = false;
                    } else {
                        document.getElementById("CheckToMovePath").disabled = true;
                    }
                }
                /* rename */
                if (document.getElementById("renaming").style.display == "block") {
                    document.getElementById("innerRename").innerHTML = this.id;
                    document.getElementById("namerem").value = this.innerHTML;
                    document.getElementById("pathToRename").value = this.id;
                    if (document.getElementById("innerRename").innerHTML == "") {
                        document.getElementById("nameRename").disabled = true;
                        document.getElementById("renameButton").disabled = true;
                    } else {
                        document.getElementById("nameRename").disabled = false;
                        document.getElementById("renameButton").disabled = false;
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
                /* copy */
                if (document.getElementById("copydata").style.display == "block") {
                    if (document.getElementById("CheckToCopyPath").checked == false) {
                        if (this.innerHTML != "stored/") {
                            if (this.dataset.visible == "true") {
                                this.dataset.visible = "false";
                                document.getElementById(this.innerHTML + "tocopyspan").remove();
                                document.getElementById(this.innerHTML + "-tocopy").remove();
                                document.getElementById(this.innerHTML + "-tocopyname").remove();
                            } else {
                                this.dataset.visible = "true";
                                let div = document.createElement("div");
                                let input = document.createElement("input");
                                input.setAttribute("type", "text");
                                input.setAttribute("name", "locationtocopy");
                                input.setAttribute("class", "filestocopy");
                                input.setAttribute("value", this.innerHTML);
                                input.setAttribute("id", this.innerHTML + "-tocopy");
                                let input2 = document.createElement("input");
                                input2.setAttribute("type", "text");
                                input2.setAttribute("name", "locationtocopyname");
                                input2.setAttribute("class", "filestocopy");
                                input2.setAttribute("value", this.dataset.foldername);
                                input2.setAttribute("id", this.innerHTML + "-tocopyname");
                                div.setAttribute("id", this.innerHTML + "tocopyspan");
                                div.setAttribute("class", "divcop");
                                let divtext = document.createTextNode(this.innerHTML);
                                div.appendChild(divtext);
                                document.getElementById("copyList").appendChild(div);
                                document.getElementById("copydata").appendChild(input);
                                document.getElementById("copydata").appendChild(input2);
                            }
                        }
                    } else {
                        document.getElementById("pathcopy").value = this.innerHTML;
                    }
                    if (document.getElementsByClassName("divcop").length > 0) {
                        document.getElementById("CheckToCopyPath").disabled = false;
                    } else {
                        document.getElementById("CheckToCopyPath").disabled = true;
                    }
                }
                /* zip */
                if (document.getElementById("zipping").style.display == "block") {
                    if (this.dataset.visible == "true") {
                        this.dataset.visible = "false";
                        document.getElementById(this.innerHTML + "-tozip").remove();
                        document.getElementById(this.innerHTML + "tozipspan").remove();
                        document.getElementById(this.innerHTML + "-tozipname").remove();
                    } else {
                        this.dataset.visible = "true";
                        let div = document.createElement("div");
                        let input2 = document.createElement("input");
                        input2.setAttribute("type", "text");
                        input2.setAttribute("name", "locationtozipname");
                        input2.setAttribute("class", "filestozip");
                        input2.setAttribute("value", this.dataset.foldername);
                        input2.setAttribute("id", this.innerHTML + "-tozipname");
                        let input = document.createElement("input");
                        input.setAttribute("type", "text");
                        input.setAttribute("name", "locationtozip");
                        input.setAttribute("class", "filestozip");
                        input.setAttribute("value", this.innerHTML);
                        input.setAttribute("id", this.innerHTML + "-tozip");
                        div.setAttribute("id", this.innerHTML + "tozipspan");
                        div.setAttribute("class", "divzip");
                        let divtext = document.createTextNode(this.innerHTML);
                        div.appendChild(divtext);
                        document.getElementById("zipList").appendChild(div);
                        document.getElementById("zipping").appendChild(input);
                        document.getElementById("zipping").appendChild(input2);
                    }
                    if (document.getElementsByClassName("filestozip").length > 0) {
                        document.getElementById("zipbutton").disabled = false;
                        document.getElementById("zipnamefinal").disabled = false;
                    } else {
                        document.getElementById("zipbutton").disabled = true;
                        document.getElementById("zipnamefinal").disabled = true;
                    }
                }
                /* moving */
                if (document.getElementById("moving").style.display == "block") {
                    if (document.getElementById("CheckToMovePath").checked == false) {
                        if (this.innerHTML != "stored/") {
                            if (this.dataset.visible == "true") {
                                this.dataset.visible = "false";
                                document.getElementById(this.innerHTML + "-tomove").remove();
                                document.getElementById(this.innerHTML + "tomovespan").remove();
                                document.getElementById(this.innerHTML + "-tomovename").remove();
                            } else {
                                this.dataset.visible = "true";
                                let div = document.createElement("div");
                                let input2 = document.createElement("input");
                                input2.setAttribute("type", "text");
                                input2.setAttribute("name", "locationtomovename");
                                input2.setAttribute("class", "filestomove");
                                input2.setAttribute("value", this.dataset.foldername);
                                input2.setAttribute("id", this.innerHTML + "-tomovename");
                                let input = document.createElement("input");
                                input.setAttribute("type", "text");
                                input.setAttribute("name", "locationtomove");
                                input.setAttribute("class", "filestomove");
                                input.setAttribute("value", this.innerHTML);
                                input.setAttribute("id", this.innerHTML + "-tomove");
                                div.setAttribute("id", this.innerHTML + "tomovespan");
                                div.setAttribute("class", "divmove");
                                let divtext = document.createTextNode(this.innerHTML);
                                div.appendChild(divtext);
                                document.getElementById("moveList").appendChild(div);
                                document.getElementById("moving").appendChild(input);
                                document.getElementById("moving").appendChild(input2);
                            }
                        }
                    } else {
                        document.getElementById("pathmove").value = this.innerHTML;
                    }
                    if (document.getElementsByClassName("filestomove").length > 0) {
                        document.getElementById("CheckToMovePath").disabled = false;
                    } else {
                        document.getElementById("CheckToMovePath").disabled = true;
                    }
                }
                /* rename */
                if (document.getElementById("renaming").style.display == "block") {
                    if (this.innerHTML == "stored/") {
                        document.getElementById("innerRename").innerHTML = "";
                        document.getElementById("namerem").value = "";
                        document.getElementById("pathToRename").value = "";
                    } else {
                        document.getElementById("innerRename").innerHTML = this.innerHTML;
                        document.getElementById("namerem").value = this.dataset.foldername;
                        document.getElementById("pathToRename").value = this.innerHTML;
                    }
                    if (document.getElementById("innerRename").innerHTML == "") {
                        document.getElementById("nameRename").disabled = true;
                        document.getElementById("renameButton").disabled = true;
                    } else {
                        document.getElementById("nameRename").disabled = false;
                        document.getElementById("renameButton").disabled = false;
                    }
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
        /* rename */
        document.getElementById("rename-icon-root").onclick = function () {
            document.getElementById("backgroundBlock").style.display = "block";
            document.getElementById("post-actions").style.display = "block";
            for (let i = 0; i < document.getElementsByClassName("divUpLocFiles").length; i++) {
                document.getElementsByClassName("divUpLocFiles")[i].style.display = "block";
            }
            document.getElementById("renaming").style.display = "block";
        }
        /* forms button close "X" */
        document.getElementById("closeActions").onclick = function () {
            for (let i = 0; i < spanUps.length; i++) {
                spanUps[i].dataset.visible = "false";
            }
            for (let i = 0; i < spanUpsF.length; i++) {
                spanUpsF[i].dataset.visible = "false";
            }
            if (document.getElementsByClassName("filestocopy").length > 0) {
                for (let i = document.getElementsByClassName("filestocopy").length - 1; i >= 0; i--) {
                    document.getElementsByClassName("filestocopy")[i].remove();
                }
            }
            if (document.getElementsByClassName("filestozip").length > 0) {
                for (let i = document.getElementsByClassName("filestozip").length - 1; i >= 0; i--) {
                    document.getElementsByClassName("filestozip")[i].remove();
                }
            }
            if (document.getElementsByClassName("filestomove").length > 0) {
                for (let i = document.getElementsByClassName("filestomove").length - 1; i >= 0; i--) {
                    document.getElementsByClassName("filestomove")[i].remove();
                }
            }
            if (document.getElementsByClassName("filesremoved").length > 0) {
                for (let i = document.getElementsByClassName("filesremoved").length - 1; i >= 0; i--) {
                    document.getElementsByClassName("filesremoved")[i].remove();
                }
            }
            document.getElementById("namerem").value = "";
            document.getElementById("CheckToMovePath").checked = false;
            document.getElementById("CheckToMovePath").disabled = true;
            document.getElementById("movebutton").disabled = true;
            document.getElementById("pathmove").disabled = true;
            document.getElementById("pathmove").value = "stored/";
            document.getElementById("moveList").innerHTML = "";
            document.getElementById("moving").style.display = "none";
            document.getElementById("CheckToMovePathPara").style.display = "none";
            document.getElementById("zipList").innerHTML = "";
            document.getElementById("zipnamefinal").value = "";
            document.getElementById("zipnamefinal").disabled = true;
            document.getElementById("zipping").style.display = "none";
            document.getElementById("pathcopy").value = "stored/";
            document.getElementById("CheckToCopyPath").checked = false;
            document.getElementById("CheckToCopyPath").disabled = true;
            document.getElementById("CheckToCopyPathPara").style.display = "none";
            document.getElementById("copyList").innerHTML = "";
            document.getElementById("pathcopy").disabled = true;
            document.getElementById("copybutton").disabled = true;
            document.getElementById("copydata").style.display = "none";
            document.getElementById("renaming").style.display = "none";
            for (let i = 0; i < document.getElementsByClassName("divUpLocFiles").length; i++) {
                document.getElementsByClassName("divUpLocFiles")[i].style.display = "none";
            }
            document.getElementById("innerRename").innerHTML = "";
            document.getElementById("renameButton").disabled = true;
            document.getElementById("nameRename").disabled = true;
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
                span.dataset.pathid = file.path + "(id)";
                p.appendChild(span);
                div.setAttribute("class", "folder");
                div.setAttribute("id", file.name + "-folder" + file.path + "(id)");
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