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
            let para = document.createElement("p");
            para.appendChild(document.createTextNode(result.distro + " " + result.release + " " + result.arch));
            document.getElementById("footer").appendChild(para);
        }
        req3.open("GET", '/ex/meminfo.json', true);
        req3.send();
        req3.onload = function () {
            const result = JSON.parse(req3.responseText);
            let para = document.createElement("p");
            if (result.free >= 1000000000000) {
                para.appendChild(document.createTextNode((result.free/1000000000000).toFixed(2) + " Tb Free in Server Storage "));
            } else if (result.free >= 1000000000) {
                para.appendChild(document.createTextNode((result.free/1000000000).toFixed(2) + " Gb Free in Server Storage "));
            } else if (result.free >= 1000000) {
                para.appendChild(document.createTextNode((result.free/1000000).toFixed(2) + " Mb Free in Server Storage "));
            } else if (result.free >= 1000) {
                para.appendChild(document.createTextNode((result.free/1000).toFixed(2) + " Kb Free in Server Storage "));
            } else {
                para.appendChild(document.createTextNode(result.free + " bytes Free in Server Storage "));
            }
            if (result.size >= 1000000000000) {
                para.appendChild(document.createTextNode("(" + (result.size/1000000000000).toFixed(2) + " Tb)"));
            } else if (result.size >= 1000000000) {
                para.appendChild(document.createTextNode("(" + (result.size/1000000000).toFixed(2) + " Gb)"));
            } else if (result.size >= 1000000) {
                para.appendChild(document.createTextNode("(" + (result.size/1000000).toFixed(2) + " Mb)"));
            } else if (result.size >= 1000) {
                para.appendChild(document.createTextNode("(" + (result.size/1000).toFixed(2) + " Kb)"));
            } else {
                para.appendChild(document.createTextNode("(" + result.size + " bytes)"));
            }
            document.getElementById("footer").appendChild(para);
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
                    div.appendChild(document.createTextNode(" " + (file.size/1000000000000).toFixed(2) + " Tb"));
                } else if (file.size >= 1000000000) {
                    div.appendChild(document.createTextNode(" " + (file.size/1000000000).toFixed(2) + " Gb"));
                } else if (file.size >= 1000000) {
                    div.appendChild(document.createTextNode(" " + (file.size/1000000).toFixed(2) + " Mb"));
                } else if (file.size >= 1000) {
                    div.appendChild(document.createTextNode(" " + (file.size/1000).toFixed(2) + " Kb"));
                } else {
                    div.appendChild(document.createTextNode(" (" + file.size + " bytes" + ")"));
                }
                countlvl++;
                folders(file.children, div);
                countlvl--;
                z.appendChild(div);
            } else {
                let div = document.createElement("div");
                div.setAttribute("class", "divUpLocFiles")
                let name = document.createElement("span");
                let nameText = document.createTextNode("- " + file.name);
                name.appendChild(nameText);
                name.setAttribute("id", file.path);
                name.setAttribute("class", "upLocF")
                div.appendChild(name);
                if (file.size >= 1000000000000) {
                    div.appendChild(document.createTextNode(" " + (file.size/1000000000000).toFixed(2) + " Tb"));
                } else if (file.size >= 1000000000) {
                    div.appendChild(document.createTextNode(" " + (file.size/1000000000).toFixed(2) + " Gb"));
                } else if (file.size >= 1000000) {
                    div.appendChild(document.createTextNode(" " + (file.size/1000000).toFixed(2) + " Mb"));
                } else if (file.size >= 1000) {
                    div.appendChild(document.createTextNode(" " + (file.size/1000).toFixed(2) + " Kb"));
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
        /* upload manager */
        for (let i = 0; i < spanUps.length; i++) {
            spanUps[i].onclick = function () {
                document.getElementById("finalloc").value = spanUps[i].innerHTML;
            }
        }
        /* menu */
        document.getElementById("menuIcon").onmouseover = function () {
            this.setAttribute("src", "./imgs/menu2.svg");
        }
        document.getElementById("menuIcon").onmouseout = function () {
            this.setAttribute("src", "./imgs/menu1.svg");
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
            document.getElementById("background-block").style.display = "block";
            document.getElementById("contain-form").style.display = "flex";
            document.getElementById("boxes").style.display = "block";
            document.getElementById("removing").style.display = "block";
            for (let i = 0; i < filesremove.length; i++) {
                filesremove[i].style.display = "block";
            }
        };
        /* checkboxes filter */
        document.getElementById("showfiles").onclick = function () {
            if (document.getElementById("showfiles").checked == true) {
                document.getElementById("showfolders").checked = false;
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
                document.getElementById("locDel").value = "";
                document.getElementById("typerem").value = "";
            }
        }
        document.getElementById("showfolders").onclick = function () {
            if (document.getElementById("showfolders").checked == true) {
                document.getElementById("showfiles").checked = false;
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
                document.getElementById("locDel").value = "";
                document.getElementById("typerem").value = "";
                
            }
        }
        for (let i = 0; i < spanUpsF.length; i++) {
            spanUpsF[i].onclick = function () {
                if ((document.getElementById("showfiles").checked == true) && (document.getElementById("showfolders").checked == false)) {
                    document.getElementById("locDelLabel").innerHTML = this.id;
                    document.getElementById("locDel").value = this.id;
                    document.getElementById("typerem").value = "file";
                }
            }
        }
        for (let i = 0; i < spanUps.length; i++) {
            spanUps[i].onclick = function () {
                if ((document.getElementById("showfiles").checked == false) && (document.getElementById("showfolders").checked == true)) {
                    document.getElementById("locDelLabel").innerHTML = this.innerHTML;
                    document.getElementById("locDel").value = this.innerHTML;
                    document.getElementById("typerem").value = "folder";
                }
            }
        }
        /* icon uploader menu */
        uploadico.onclick = function () {
            document.getElementById("background-block").style.display = "block";
            document.getElementById("contain-form").style.display = "flex";
            document.getElementById("uploading").style.display = "block";
            document.getElementById("finalloc").value = "stored/";
        };
        uploadbutton.onclick = function () {
            document.getElementById("background-block").style.display = "none";
            document.getElementById("contain-form").style.display = "none";
            document.getElementById("uploading").style.display = "none";
        };
        /* forms button close "X" */
        document.getElementById("closeActions").onclick = function () {
            document.getElementById("background-block").style.display = "none";
            document.getElementById("contain-form").style.display = "none";
            document.getElementById("uploading").style.display = "none";
            document.getElementById("boxes").style.display = "none";
            document.getElementById("removing").style.display = "none";
            document.getElementById("showfolders").checked = false;
            document.getElementById("showfiles").checked = false;
            document.getElementById("locDelLabel").innerHTML = "";
                    document.getElementById("locDel").value = "";
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