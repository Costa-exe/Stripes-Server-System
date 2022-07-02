const fs = require('fs');
const express = require('express');
const app = express();
const upload = require('express-fileupload');
const dirTree = require("directory-tree");
const storage = './stored/';
const si = require('systeminformation');
const chkdisk = require('check-disk-space').default;
const path = require('path');
const res = require('express/lib/response');
const fsext = require('fs-extra');
const zipLocal = require('zip-local');
const { zip } = require('zip-local');
const req = require('express/lib/request');

app.use(express.static(__dirname));
app.use(upload({
    useTempFiles: true,
    tempFileDir: "./tmp/"
}));

const perms = {};
const exts = [".tar.gz", ".tar.xz", ".tar.z", ".tar.7z", ".tar.bz2", ".tar.lz", ".tar.lz4", ".tar.lzma", ".tar.lzo", ".tar.zst", ".tar.br", ".tar.bz", ".tar.lpaq"];
var filesToDownalod = [];

function nameFiles(x) {
    x.forEach(element => {
        if (element.type == "file") {
            filesToDownalod.push(element.path);
        } else {
            nameFiles(element.children);
        }
    });
}

nameFiles(dirTree(storage, {attributes:['size', 'type', 'extension']}).children);

    function scanning () {
        const files = dirTree(storage, {attributes:['size', 'type', 'extension']});
        fs.writeFile('./ex/files.json', JSON.stringify(files.children), (err) => {
            if (err) {
                console.log(`ERROR : ${err}`);
            }
        });
        si.osInfo().then(data => {fs.writeFile('./ex/sysinfo.json', JSON.stringify(data), (err) => {
            if (err) {
                console.log(`ERROR : ${err}`);
            }
    
        })});
        chkdisk('/stored/').then(data => {fs.writeFile('./ex/meminfo.json', JSON.stringify(data), (err) => {
            if (err) {
                console.log(`ERROR : ${err}`);
            }
        })});
    }

    app.get('/', (req,res) => {
        if (perms[req.socket.remoteAddress] == 1 || perms[req.socket.remoteAddress] == 2) {
            scanning();
            fs.rmSync("./tmp", {recursive: true});
            fs.mkdirSync("./tmp");
            if (fs.existsSync("./temp")) {
                fs.rmSync("./temp", {recursive: true});
            }
            res.sendFile('./fm.html', {root : __dirname});
        } else {
            res.sendFile('./auth.html', {root: __dirname});
        }
    })

    app.post('/login', (req, res) => {
        if (JSON.parse(fs.readFileSync('./key.json')).admin == JSON.parse(fs.readFileSync('./key.json')).guest) {
            console.log("ERROR: admin and guest have the same password");
            perms[req.socket.remoteAddress] = 0;
            res.redirect('/');
        } else {
            if (req.body.password == JSON.parse(fs.readFileSync('./key.json')).guest){
                perms[req.socket.remoteAddress] = 1;
                console.log(req.socket.remoteAddress + " gained access to the server for this session as guest");
                let date = new Date();
                let year = date.getFullYear();
                let month = date.getMonth() + 1;
                if (month < 10) {
                    month = `0${month}`;
                }
                let day = date.getDate();
                if (day < 10) {
                    day = `0${day}`;
                }
                let hours = date.getHours();
                if (hours < 10) {
                    hours = `0${hours}`;
                }
                let minutes = date.getMinutes();
                if (minutes < 10) {
                    minutes = `0${minutes}`;
                }
                let seconds = date.getSeconds();
                if (seconds < 10) {
                    seconds = `0${seconds}`;
                }
                let tmparr = JSON.parse(fs.readFileSync('./ex/log.json'));
                let action = {[`${year} - ${month} - ${day}, ${hours}:${minutes}:${seconds}`] : `${req.socket.remoteAddress} gained access to the server for this session as guest.`};
                tmparr.unshift(action);
                fs.writeFileSync('./ex/log.json', JSON.stringify(tmparr));
                res.redirect('/');
            } else if (req.body.password == JSON.parse(fs.readFileSync('./key.json')).admin) {
                perms[req.socket.remoteAddress] = 2;
                console.log(req.socket.remoteAddress + " gained access to the server for this session as admin");
                let date = new Date();
                let year = date.getFullYear();
                let month = date.getMonth() + 1;
                if (month < 10) {
                    month = `0${month}`;
                }
                let day = date.getDate();
                if (day < 10) {
                    day = `0${day}`;
                }
                let hours = date.getHours();
                if (hours < 10) {
                    hours = `0${hours}`;
                }
                let minutes = date.getMinutes();
                if (minutes < 10) {
                    minutes = `0${minutes}`;
                }
                let seconds = date.getSeconds();
                if (seconds < 10) {
                    seconds = `0${seconds}`;
                }
                let tmparr = JSON.parse(fs.readFileSync('./ex/log.json'));
                let action = {[`${year} - ${month} - ${day}, ${hours}:${minutes}:${seconds}`] : `${req.socket.remoteAddress} gained access to the server for this session as admin.`};
                tmparr.unshift(action);
                fs.writeFileSync('./ex/log.json', JSON.stringify(tmparr));
                res.redirect('/');
            } else {
                perms[req.socket.remoteAddress] = 0;
                console.log("ACCESS DENIED");
                let date = new Date();
                let year = date.getFullYear();
                let month = date.getMonth() + 1;
                if (month < 10) {
                    month = `0${month}`;
                }
                let day = date.getDate();
                if (day < 10) {
                    day = `0${day}`;
                }
                let hours = date.getHours();
                if (hours < 10) {
                    hours = `0${hours}`;
                }
                let minutes = date.getMinutes();
                if (minutes < 10) {
                    minutes = `0${minutes}`;
                }
                let seconds = date.getSeconds();
                if (seconds < 10) {
                    seconds = `0${seconds}`;
                }
                let tmparr = JSON.parse(fs.readFileSync('./ex/log.json'));
                let action = {[`${year} - ${month} - ${day}, ${hours}:${minutes}:${seconds}`] : `Access denied for ${req.socket.remoteAddress}.`};
                tmparr.unshift(action);
                fs.writeFileSync('./ex/log.json', JSON.stringify(tmparr));
                res.redirect('/');
            }
        }
    })

    app.post('/logout', (req, res) => {
        perms[req.socket.remoteAddress] = 0;
        console.log(req.socket.remoteAddress + " logged out");
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        if (month < 10) {
            month = `0${month}`;
        }
        let day = date.getDate();
        if (day < 10) {
            day = `0${day}`;
        }
        let hours = date.getHours();
        if (hours < 10) {
            hours = `0${hours}`;
        }
        let minutes = date.getMinutes();
        if (minutes < 10) {
            minutes = `0${minutes}`;
        }
        let seconds = date.getSeconds();
        if (seconds < 10) {
            seconds = `0${seconds}`;
        }
        let tmparr = JSON.parse(fs.readFileSync('./ex/log.json'));
        let action = {[`${year} - ${month} - ${day}, ${hours}:${minutes}:${seconds}`] : `${req.socket.remoteAddress} logged out.`};
        tmparr.unshift(action);
        fs.writeFileSync('./ex/log.json', JSON.stringify(tmparr));
        res.redirect('/');
    })

/* assets for compiled version*/
app.get('/ex/files.json', (req,res) => {
    res.sendFile('./files.json', {root: './ex'});
});
app.get('/ex/meminfo.json', (req,res) => {
    res.sendFile('./meminfo.json', {root: './ex'});
});
app.get('/ex/sysinfo.json', (req,res) => {
    res.sendFile('./sysinfo.json', {root: './ex'});
});
app.get('/ex/log.json', (req,res) => {
    res.sendFile('./log.json', {root: './ex'});
});
for (let i = 0; i < filesToDownalod.length; i++) {
    let finalget = encodeURI(filesToDownalod[i]);
    app.get(`/${finalget}`, (req,res) => {
        let rootFile = filesToDownalod[i].split("/");
        rootFile.pop();
        res.sendFile(`./${filesToDownalod[i].split("/")[filesToDownalod[i].split("/").length - 1]}`, {root: `./${rootFile.join("/")}`});
    })
}


function extname (l) {
    for (let i = 0; i < exts.length; i++) {
        let tempext = new RegExp(`${exts[i]}$`); 
        if (l.match(tempext)) {
            let extension = exts[i];
            let name = l.replace(tempext, "");
            return [name, extension]
        }
    }
    let extension = path.parse(l).ext;
    let name = path.parse(l).name;
    return [name, extension]
}

let count = 0;
function autorename (a, b, c) {
    let name = extname(b.name)[0];
    let extension = extname(b.name)[1];
    if (fs.existsSync(a + b.name)) {
        count ++;
        if (fs.existsSync(a + name + " - Copy (" + count + ")" + extension)) {
            autorename(a, b, c);
        } else {
            console.log(b.name + " Already Exists, Renamed in : " + name + " - Copy (" + count +")" + extension);
            b.mv(a + name + " - Copy (" + count + ")" + extension, (err) => {
                if (err) {
                    console.log(`ERROR : ${err}`);
                }
            });
            let date = new Date();
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            if (month < 10) {
                month = `0${month}`;
            }
            let day = date.getDate();
            if (day < 10) {
                day = `0${day}`;
            }
            let hours = date.getHours();
            if (hours < 10) {
                hours = `0${hours}`;
            }
            let minutes = date.getMinutes();
            if (minutes < 10) {
                minutes = `0${minutes}`;
            }
            let seconds = date.getSeconds();
            if (seconds < 10) {
                seconds = `0${seconds}`;
            }
            let tmparr = JSON.parse(fs.readFileSync('./ex/log.json'));
            let action = {[`${year} - ${month} - ${day}, ${hours}:${minutes}:${seconds}`] : `${c} uploaded ${name} - Copy (${count})${extension} in ${a}.`};
            tmparr.unshift(action);
            fs.writeFileSync('./ex/log.json', JSON.stringify(tmparr));
            count = 0;
        }
    } else {
        b.mv(a + b.name, (err) => {
            if (err) {
                console.log(`ERROR : ${err}`);
            }
        });
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        if (month < 10) {
            month = `0${month}`;
        }
        let day = date.getDate();
        if (day < 10) {
            day = `0${day}`;
        }
        let hours = date.getHours();
        if (hours < 10) {
            hours = `0${hours}`;
        }
        let minutes = date.getMinutes();
        if (minutes < 10) {
            minutes = `0${minutes}`;
        }
        let seconds = date.getSeconds();
        if (seconds < 10) {
            seconds = `0${seconds}`;
        }
        let tmparr = JSON.parse(fs.readFileSync('./ex/log.json'));
        let action = {[`${year} - ${month} - ${day}, ${hours}:${minutes}:${seconds}`] : `${c} uploaded ${b.name} in ${a}.`};
        tmparr.unshift(action);
        fs.writeFileSync('./ex/log.json', JSON.stringify(tmparr));
    }
}

function copyrename(n, m, u, w) {
    count ++;
    if (fs.existsSync(m + u + " - Copy (" + count + ")/") == false) {
        console.log(u + " already exists, renamed to " + u + " - Copy (" + count + ")/");
        fsext.copySync(n, m + u + " - Copy (" + count + ")/");
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        if (month < 10) {
            month = `0${month}`;
        }
        let day = date.getDate();
        if (day < 10) {
            day = `0${day}`;
        }
        let hours = date.getHours();
        if (hours < 10) {
            hours = `0${hours}`;
        }
        let minutes = date.getMinutes();
        if (minutes < 10) {
            minutes = `0${minutes}`;
        }
        let seconds = date.getSeconds();
        if (seconds < 10) {
            seconds = `0${seconds}`;
        }
        let tmparr = JSON.parse(fs.readFileSync('./ex/log.json'));
        let action = {[`${year} - ${month} - ${day}, ${hours}:${minutes}:${seconds}`] : `${w} copied ${u} - Copy (${count}) in ${m}.`};
        tmparr.unshift(action);
        fs.writeFileSync('./ex/log.json', JSON.stringify(tmparr));
    } else {
        copyrename(n, m, u, w);
    }
    count = 0;
}

function copyrenameFiles (n, m, u, w) {
    count ++;
    let extension = extname(u)[1];
    let name = extname(u)[0];
    if (fs.existsSync(m + name + " - Copy (" + count + ")" + extension) == false) {
        console.log(u + " already exists, renamed to " + name + " - Copy (" + count + ")" + extension);
        fs.copyFileSync(n, m + name + " - Copy (" + count + ")" + extension);
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        if (month < 10) {
            month = `0${month}`;
        }
        let day = date.getDate();
        if (day < 10) {
            day = `0${day}`;
        }
        let hours = date.getHours();
        if (hours < 10) {
            hours = `0${hours}`;
        }
        let minutes = date.getMinutes();
        if (minutes < 10) {
            minutes = `0${minutes}`;
        }
        let seconds = date.getSeconds();
        if (seconds < 10) {
            seconds = `0${seconds}`;
        }
        let tmparr = JSON.parse(fs.readFileSync('./ex/log.json'));
        let action = {[`${year} - ${month} - ${day}, ${hours}:${minutes}:${seconds}`] : `${w} copied ${u} - Copy (${count})${extension} in ${m}.`};
        tmparr.unshift(action);
        fs.writeFileSync('./ex/log.json', JSON.stringify(tmparr));
        } else {
            copyrenameFiles(n, m, u, w);
        }
    count = 0;
}

app.post('/copy-data', (req,res) => {
    if (perms[req.socket.remoteAddress] == 2) {
        if (req.body.copypath[req.body.copypath.length - 1] == "/") {
            console.log("Path Format OK");
        } else {
            console.log("Validating Path Format...");
            req.body.copypath += "/"; 
            console.log("Path Format OK");
        }
        if (Array.isArray(req.body.locationtocopy)) {
            console.log("Copying files...");
            for (let i = 0; i < req.body.locationtocopy.length; i++) {
                if (req.body.locationtocopy[i].match(/^stored\//)) {
                    if (req.body.locationtocopy[i] == "stored/") {
                        console.log("NOT ALOWED");
                        res.redirect('/');
                    } else {
                        if (req.body.copypath.match(/^stored\//))  {
                            if (req.body.locationtocopy[i][req.body.locationtocopy[i].length - 1] == "/") {
                                if (req.body.locationtocopy[i] == req.body.copypath + req.body.locationtocopyname[i] + "/") {
                                    copyrename(req.body.locationtocopy[i], req.body.copypath, req.body.locationtocopyname[i], req.socket.remoteAddress);
                                } else {
                                    if (fs.existsSync(req.body.copypath + req.body.locationtocopyname[i] + "/") == false) {
                                        fsext.copySync(req.body.locationtocopy[i], req.body.copypath + req.body.locationtocopyname[i] + "/");
                                    } else {
                                        fsext.copySync(req.body.locationtocopy[i], req.body.copypath + req.body.locationtocopyname[i] + "/", {overwrite: true});
                                    }
                                    let date = new Date();
                                    let year = date.getFullYear();
                                    let month = date.getMonth() + 1;
                                    if (month < 10) {
                                        month = `0${month}`;
                                    }
                                    let day = date.getDate();
                                    if (day < 10) {
                                        day = `0${day}`;
                                    }
                                    let hours = date.getHours();
                                    if (hours < 10) {
                                        hours = `0${hours}`;
                                    }
                                    let minutes = date.getMinutes();
                                    if (minutes < 10) {
                                        minutes = `0${minutes}`;
                                    }
                                    let seconds = date.getSeconds();
                                    if (seconds < 10) {
                                        seconds = `0${seconds}`;
                                    }
                                    let tmparr = JSON.parse(fs.readFileSync('./ex/log.json'));
                                    let action = { [`${year} - ${month} - ${day}, ${hours}:${minutes}:${seconds}`]: `${req.socket.remoteAddress} copied ${req.body.locationtocopyname[i]} in ${req.body.copypath}.` };
                                    tmparr.unshift(action);
                                    fs.writeFileSync('./ex/log.json', JSON.stringify(tmparr));
                                }
                            } else {
                                if (fs.existsSync(req.body.copypath) == false) {
                                    fs.mkdirSync(req.body.copypath);
                                }
                                if (fs.existsSync(req.body.copypath + req.body.locationtocopyname[i]) == false) {
                                    fs.copyFileSync(req.body.locationtocopy[i], req.body.copypath + req.body.locationtocopyname[i]);
                                    let date = new Date();
                                    let year = date.getFullYear();
                                    let month = date.getMonth() + 1;
                                    if (month < 10) {
                                        month = `0${month}`;
                                    }
                                    let day = date.getDate();
                                    if (day < 10) {
                                        day = `0${day}`;
                                    }
                                    let hours = date.getHours();
                                    if (hours < 10) {
                                        hours = `0${hours}`;
                                    }
                                    let minutes = date.getMinutes();
                                    if (minutes < 10) {
                                        minutes = `0${minutes}`;
                                    }
                                    let seconds = date.getSeconds();
                                    if (seconds < 10) {
                                        seconds = `0${seconds}`;
                                    }
                                    let tmparr = JSON.parse(fs.readFileSync('./ex/log.json'));
                                    let action = { [`${year} - ${month} - ${day}, ${hours}:${minutes}:${seconds}`]: `${req.socket.remoteAddress} copied ${req.body.locationtocopyname[i]} in ${req.body.copypath}.` };
                                    tmparr.unshift(action);
                                    fs.writeFileSync('./ex/log.json', JSON.stringify(tmparr));
                                } else {
                                    copyrenameFiles(req.body.locationtocopy[i], req.body.copypath, req.body.locationtocopyname[i], req.socket.remoteAddress);
                                }
                            }
                        } else {
                            console.log("NOT ALLOWED");
                            res.redirect('/');
                        }
                    }
                } else {
                    console.log("NOT ALLOWED");
                    res.redirect('/');
                }
            }
        } else {
            console.log("Copying file...");
            if (req.body.locationtocopy.match(/^stored\//)) {
                    if (req.body.locationtocopy == "stored/") {
                        console.log("NOT ALOWED");
                        res.redirect('/');
                    } else {
                        if (req.body.copypath.match(/^stored\//))  {
                            if (req.body.locationtocopy[req.body.locationtocopy.length - 1] == "/") {
                                if (req.body.locationtocopy == req.body.copypath + req.body.locationtocopyname + "/") {
                                    copyrename(req.body.locationtocopy, req.body.copypath, req.body.locationtocopyname, req.socket.remoteAddress);
                                } else {
                                    if (fs.existsSync(req.body.copypath + req.body.locationtocopyname + "/") == false) {
                                        fsext.copySync(req.body.locationtocopy, req.body.copypath + req.body.locationtocopyname + "/");
                                    } else {
                                        fsext.copySync(req.body.locationtocopy, req.body.copypath + req.body.locationtocopyname + "/", {overwrite: true});
                                    }
                                    let date = new Date();
                                    let year = date.getFullYear();
                                    let month = date.getMonth() + 1;
                                    if (month < 10) {
                                        month = `0${month}`;
                                    }
                                    let day = date.getDate();
                                    if (day < 10) {
                                        day = `0${day}`;
                                    }
                                    let hours = date.getHours();
                                    if (hours < 10) {
                                        hours = `0${hours}`;
                                    }
                                    let minutes = date.getMinutes();
                                    if (minutes < 10) {
                                        minutes = `0${minutes}`;
                                    }
                                    let seconds = date.getSeconds();
                                    if (seconds < 10) {
                                        seconds = `0${seconds}`;
                                    }
                                    let tmparr = JSON.parse(fs.readFileSync('./ex/log.json'));
                                    let action = { [`${year} - ${month} - ${day}, ${hours}:${minutes}:${seconds}`]: `${req.socket.remoteAddress} copied ${req.body.locationtocopyname} in ${req.body.copypath}.` };
                                    tmparr.unshift(action);
                                    fs.writeFileSync('./ex/log.json', JSON.stringify(tmparr));
                                }
                            } else {
                                if (fs.existsSync(req.body.copypath) == false) {
                                    fs.mkdirSync(req.body.copypath);
                                }
                                if (fs.existsSync(req.body.copypath + req.body.locationtocopyname) == false) {
                                    fs.copyFileSync(req.body.locationtocopy, req.body.copypath + req.body.locationtocopyname);
                                    let date = new Date();
                                    let year = date.getFullYear();
                                    let month = date.getMonth() + 1;
                                    if (month < 10) {
                                        month = `0${month}`;
                                    }
                                    let day = date.getDate();
                                    if (day < 10) {
                                        day = `0${day}`;
                                    }
                                    let hours = date.getHours();
                                    if (hours < 10) {
                                        hours = `0${hours}`;
                                    }
                                    let minutes = date.getMinutes();
                                    if (minutes < 10) {
                                        minutes = `0${minutes}`;
                                    }
                                    let seconds = date.getSeconds();
                                    if (seconds < 10) {
                                        seconds = `0${seconds}`;
                                    }
                                    let tmparr = JSON.parse(fs.readFileSync('./ex/log.json'));
                                    let action = { [`${year} - ${month} - ${day}, ${hours}:${minutes}:${seconds}`]: `${req.socket.remoteAddress} copied ${req.body.locationtocopyname} in ${req.body.copypath}.` };
                                    tmparr.unshift(action);
                                    fs.writeFileSync('./ex/log.json', JSON.stringify(tmparr));
                                } else {
                                    copyrenameFiles(req.body.locationtocopy, req.body.copypath, req.body.locationtocopyname, req.socket.remoteAddress);
                                }
                            }
                        } else {
                            console.log("NOT ALLOWED");
                            res.redirect('/');
                        }
                    }
                } else {
                    console.log("NOT ALLOWED");
                    res.redirect('/');
                }
        }
        console.log("Done");
        res.redirect('/');
    } else if (perms[req.socket.remoteAddress] == 1) {
        console.log("NOT ALLOWED");
        console.log(req.socket.remoteAddress + " is not an admin");
        res.redirect('/');
    } else {
        console.log("CONNECTION LOST");
        res.redirect('/');
    }
})

function renamemovefold(t, j, y, v) {
    count ++;
    if (fs.existsSync(j + y + " (" + count + ")/")) {
        renamemovefold(t, j, y);
    } else {
        console.log("renamed to " + y + " - Copy (" + count + ")/");
        try {
            fsext.moveSync(t, j + y + " - Copy (" + count + ")/");
            let date = new Date();
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            if (month < 10) {
                month = `0${month}`;
            }
            let day = date.getDate();
            if (day < 10) {
                day = `0${day}`;
            }
            let hours = date.getHours();
            if (hours < 10) {
                hours = `0${hours}`;
            }
            let minutes = date.getMinutes();
            if (minutes < 10) {
                minutes = `0${minutes}`;
            }
            let seconds = date.getSeconds();
            if (seconds < 10) {
                seconds = `0${seconds}`;
            }
            let tmparr = JSON.parse(fs.readFileSync('./ex/log.json'));
            let action = { [`${year} - ${month} - ${day}, ${hours}:${minutes}:${seconds}`]: `${v} moved ${y} - Copy (${count}) in ${j}.` };
            tmparr.unshift(action);
            fs.writeFileSync('./ex/log.json', JSON.stringify(tmparr));
        } catch(error) {
            console.log(`ERROR ${error}`);
        }
    }
    count = 0;
}

function renamemovefil(t, j, y, v) {
    count ++;
    let name = extname(y)[0];
    let extension = extname(y)[1];
    if (fs.existsSync(j + name + " - Copy (" + count + ")" + extension)) {
        renamemovefil(t, j, y);
    } else {
        console.log("renamed to " + name + " - Copy (" + count + ")" + extension);
        try {
            fsext.moveSync(t, j + name + " - Copy (" + count + ")" + extension);
            let date = new Date();
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            if (month < 10) {
                month = `0${month}`;
            }
            let day = date.getDate();
            if (day < 10) {
                day = `0${day}`;
            }
            let hours = date.getHours();
            if (hours < 10) {
                hours = `0${hours}`;
            }
            let minutes = date.getMinutes();
            if (minutes < 10) {
                minutes = `0${minutes}`;
            }
            let seconds = date.getSeconds();
            if (seconds < 10) {
                seconds = `0${seconds}`;
            }
            let tmparr = JSON.parse(fs.readFileSync('./ex/log.json'));
            let action = { [`${year} - ${month} - ${day}, ${hours}:${minutes}:${seconds}`]: `${v} moved ${y} - Copy (${count})${extension} in ${j}.` };
            tmparr.unshift(action);
            fs.writeFileSync('./ex/log.json', JSON.stringify(tmparr));
        } catch(error) {
            console.log(`ERROR ${error}`);
        }
    }
    count = 0;
}

app.post('/move-data', (req, res) => {
    if (perms[req.socket.remoteAddress] == 2) {
        if (req.body.movepath[req.body.movepath.length - 1] == "/") {
            console.log("Path Format OK");
        } else {
            console.log("Validating Path Format...");
            req.body.movepath += "/";
            console.log("Path Format OK");
        }
        if (Array.isArray(req.body.locationtomove)) {
            console.log("Moving files...");
            for (i = 0; i < req.body.locationtomove.length; i++) {
                if (req.body.locationtomove[i].match(/^stored\//)) {
                    if (req.body.locationtomove[i] == "stored/") {
                        console.log("NOT ALLOWED");
                        res.redirect('/');
                    } else {
                        if (req.body.movepath.match(/^stored\//)) {
                            if (req.body.locationtomove[i][req.body.locationtomove[i] - 1] == "/") {
                                if (fs.existsSync(req.body.movepath + req.body.locationtomovename[i] + "/")) {
                                    console.log(req.body.locationtomovename[i] + " already exists");
                                    renamemovefold(req.body.locationtomove[i], req.body.movepath, locationtomovename[i], req.socket.remoteAddress);
                                } else {
                                    try {
                                        fsext.moveSync(req.body.locationtomove[i], req.body.movepath + req.body.locationtomovename[i] + "/");
                                        let date = new Date();
                                        let year = date.getFullYear();
                                        let month = date.getMonth() + 1;
                                        if (month < 10) {
                                            month = `0${month}`;
                                        }
                                        let day = date.getDate();
                                        if (day < 10) {
                                            day = `0${day}`;
                                        }
                                        let hours = date.getHours();
                                        if (hours < 10) {
                                            hours = `0${hours}`;
                                        }
                                        let minutes = date.getMinutes();
                                        if (minutes < 10) {
                                            minutes = `0${minutes}`;
                                        }
                                        let seconds = date.getSeconds();
                                        if (seconds < 10) {
                                            seconds = `0${seconds}`;
                                        }
                                        let tmparr = JSON.parse(fs.readFileSync('./ex/log.json'));
                                        let action = { [`${year} - ${month} - ${day}, ${hours}:${minutes}:${seconds}`]: `${req.socket.remoteAddress} moved ${req.body.locationtomovename[i]} in ${req.body.movepath}.` };
                                        tmparr.unshift(action);
                                        fs.writeFileSync('./ex/log.json', JSON.stringify(tmparr));
                                    } catch (error) {
                                        console.log(`ERROR : ${error}`);
                                    }
                                }
                            } else {
                                if (fs.existsSync(req.body.movepath + req.body.locationtomovename[i])) {
                                    console.log(req.body.locationtomovename[i] + " already exists");
                                    renamemovefil(req.body.locationtomove[i], req.body.movepath, req.body.locationtomovename[i], req.socket.remoteAddress);
                                } else {
                                    try {
                                        fsext.moveSync(req.body.locationtomove[i], req.body.movepath + req.body.locationtomovename[i]);
                                        let date = new Date();
                                        let year = date.getFullYear();
                                        let month = date.getMonth() + 1;
                                        if (month < 10) {
                                            month = `0${month}`;
                                        }
                                        let day = date.getDate();
                                        if (day < 10) {
                                            day = `0${day}`;
                                        }
                                        let hours = date.getHours();
                                        if (hours < 10) {
                                            hours = `0${hours}`;
                                        }
                                        let minutes = date.getMinutes();
                                        if (minutes < 10) {
                                            minutes = `0${minutes}`;
                                        }
                                        let seconds = date.getSeconds();
                                        if (seconds < 10) {
                                            seconds = `0${seconds}`;
                                        }
                                        let tmparr = JSON.parse(fs.readFileSync('./ex/log.json'));
                                        let action = { [`${year} - ${month} - ${day}, ${hours}:${minutes}:${seconds}`]: `${req.socket.remoteAddress} moved ${req.body.locationtomovename[i]} in ${req.body.movepath}.` };
                                        tmparr.unshift(action);
                                        fs.writeFileSync('./ex/log.json', JSON.stringify(tmparr));
                                    } catch (error) {
                                        console.log(`ERROR : ${error}`)
                                    }
                                }
                            }
                        } else {
                            console.log("NOT ALLOWED");
                            res.redirect('/');
                        }
                    }
                } else {
                    console.log("NOT ALLOWED");
                    res.redirect('/');
                }
            }
        } else {
            console.log("Moving file...");
            if (req.body.locationtomove.match(/^stored\//)) {
                    if (req.body.locationtomove == "stored/") {
                        console.log("NOT ALLOWED");
                        res.redirect('/');
                    } else {
                        if (req.body.movepath.match(/^stored\//)) {
                            if (req.body.locationtomove[req.body.locationtomove - 1] == "/") {
                                if (fs.existsSync(req.body.movepath + req.body.locationtomovename + "/")) {
                                    console.log(req.body.locationtomovename + " already exists");
                                    renamemovefold(req.body.locationtomove, req.body.movepath, locationtomovename, req.socket.remoteAddress);
                                } else {
                                    try {
                                        fsext.moveSync(req.body.locationtomove, req.body.movepath + req.body.locationtomovename + "/");
                                        let date = new Date();
                                        let year = date.getFullYear();
                                        let month = date.getMonth() + 1;
                                        if (month < 10) {
                                            month = `0${month}`;
                                        }
                                        let day = date.getDate();
                                        if (day < 10) {
                                            day = `0${day}`;
                                        }
                                        let hours = date.getHours();
                                        if (hours < 10) {
                                            hours = `0${hours}`;
                                        }
                                        let minutes = date.getMinutes();
                                        if (minutes < 10) {
                                            minutes = `0${minutes}`;
                                        }
                                        let seconds = date.getSeconds();
                                        if (seconds < 10) {
                                            seconds = `0${seconds}`;
                                        }
                                        let tmparr = JSON.parse(fs.readFileSync('./ex/log.json'));
                                        let action = { [`${year} - ${month} - ${day}, ${hours}:${minutes}:${seconds}`]: `${req.socket.remoteAddress} moved ${req.body.locationtomovename} in ${req.body.movepath}.` };
                                        tmparr.unshift(action);
                                        fs.writeFileSync('./ex/log.json', JSON.stringify(tmparr));
                                    } catch (error) {
                                        console.log(`ERROR : ${error}`);
                                    }
                                }
                            } else {
                                if (fs.existsSync(req.body.movepath + req.body.locationtomovename)) {
                                    console.log(req.body.locationtomovename + " already exists");
                                    renamemovefil(req.body.locationtomove, req.body.movepath, req.body.locationtomovename, req.socket.remoteAddress);
                                } else {
                                    try {
                                        fsext.moveSync(req.body.locationtomove, req.body.movepath + req.body.locationtomovename);
                                        let date = new Date();
                                        let year = date.getFullYear();
                                        let month = date.getMonth() + 1;
                                        if (month < 10) {
                                            month = `0${month}`;
                                        }
                                        let day = date.getDate();
                                        if (day < 10) {
                                            day = `0${day}`;
                                        }
                                        let hours = date.getHours();
                                        if (hours < 10) {
                                            hours = `0${hours}`;
                                        }
                                        let minutes = date.getMinutes();
                                        if (minutes < 10) {
                                            minutes = `0${minutes}`;
                                        }
                                        let seconds = date.getSeconds();
                                        if (seconds < 10) {
                                            seconds = `0${seconds}`;
                                        }
                                        let tmparr = JSON.parse(fs.readFileSync('./ex/log.json'));
                                        let action = { [`${year} - ${month} - ${day}, ${hours}:${minutes}:${seconds}`]: `${req.socket.remoteAddress} moved ${req.body.locationtomovename} in ${req.body.movepath}.` };
                                        tmparr.unshift(action);
                                        fs.writeFileSync('./ex/log.json', JSON.stringify(tmparr));
                                    } catch(error) {
                                        console.log(`ERROR ${error}`);
                                    }
                                }
                            }
                        } else {
                            console.log("NOT ALLOWED");
                            res.redirect('/');
                        }
                    }
                } else {
                    console.log("NOT ALLOWED");
                    res.redirect('/');
                }
        }
        console.log("Done");
        console.log("Refreshing...");
        res.redirect('/');
    } else if (perms[req.socket.remoteAddress] == 1) {
        console.log("NOT ALLOWED");
        console.log(req.socket.remoteAddress + " is not an admin");
        res.redirect('/');
    } else {
        console.log("CONNECTION LOST");
        res.redirect('/');
    }
})

app.post('/rename-data', (req, res) => {
    if (perms[req.socket.remoteAddress] == 2) {
        if (req.body.renamedData == "") {
            console.log("ERROR: no name specified");
        } else {
            if (req.body.renamedData.match(/\//)) {
                req.body.renamedData = req.body.renamedData.replaceAll("/", "-");
            }
            if (req.body.renamedata.match(/^stored\//)) {
                if (req.body.renamedata == "stored/") {
                    console.log("NOT ALLOWED");
                } else {
                    let splitted = req.body.renamedata.split("/");
                    if (splitted[splitted.length - 1] == "") {
                        splitted.pop();
                        splitted[splitted.length-1] = req.body.renamedData + "/";
                        let final = splitted.join("/");
                        if (fs.existsSync(final)) {
                            console.log("ERROR: " + final  + " already exists, cannot rename");
                            console.log("Choose another name");
                        } else {
                            fs.renameSync(req.body.renamedata, final);
                            console.log("Renamed folder from " + req.body.renamedata.split("/")[req.body.renamedata.split("/").length - 2] + ", to " + req.body.renamedData);
                            let date = new Date();
                            let year = date.getFullYear();
                            let month = date.getMonth() + 1;
                            if (month < 10) {
                                month = `0${month}`;
                            }
                            let day = date.getDate();
                            if (day < 10) {
                                day = `0${day}`;
                            }
                            let hours = date.getHours();
                            if (hours < 10) {
                                hours = `0${hours}`;
                            }
                            let minutes = date.getMinutes();
                            if (minutes < 10) {
                                minutes = `0${minutes}`;
                            }
                            let seconds = date.getSeconds();
                            if (seconds < 10) {
                                seconds = `0${seconds}`;
                            }
                            let tmparr = JSON.parse(fs.readFileSync('./ex/log.json'));
                            let action = { [`${year} - ${month} - ${day}, ${hours}:${minutes}:${seconds}`]: `${req.socket.remoteAddress} renamed ${req.body.renamedata.split("/")[req.body.renamedata.split("/").length - 2]} to ${req.body.renamedData}.` };
                            tmparr.unshift(action);
                            fs.writeFileSync('./ex/log.json', JSON.stringify(tmparr));
                        }
                    } else {
                        let extension = extname(req.body.renamedata.split("/")[req.body.renamedata.split("/").length - 1])[1];
                        splitted[splitted.length-1] = req.body.renamedData + extension;
                        let final = splitted.join("/");
                        if (fs.existsSync(final)) {
                            console.log("ERROR: " + final  + " already exists, cannot rename");
                            console.log("Choose another name");
                        } else {
                            fs.renameSync(req.body.renamedata, final);
                            console.log("Renamed file from " + req.body.renamedata.split("/")[req.body.renamedata.split("/").length - 1] + ", to " + req.body.renamedData);
                            let date = new Date();
                            let year = date.getFullYear();
                            let month = date.getMonth() + 1;
                            if (month < 10) {
                                month = `0${month}`;
                            }
                            let day = date.getDate();
                            if (day < 10) {
                                day = `0${day}`;
                            }
                            let hours = date.getHours();
                            if (hours < 10) {
                                hours = `0${hours}`;
                            }
                            let minutes = date.getMinutes();
                            if (minutes < 10) {
                                minutes = `0${minutes}`;
                            }
                            let seconds = date.getSeconds();
                            if (seconds < 10) {
                                seconds = `0${seconds}`;
                            }
                            let tmparr = JSON.parse(fs.readFileSync('./ex/log.json'));
                            let action = { [`${year} - ${month} - ${day}, ${hours}:${minutes}:${seconds}`]: `${req.socket.remoteAddress} renamed ${req.body.renamedata.split("/")[req.body.renamedata.split("/").length - 1]} to ${req.body.renamedData}${extension}.` };
                            tmparr.unshift(action);
                            fs.writeFileSync('./ex/log.json', JSON.stringify(tmparr));
                        }
                    }
                }
            } else {
                console.log("NOT ALLOWED");
            }
        }
        res.redirect('/');
    } else if (perms[req.socket.remoteAddress] == 1) {
        console.log("NOT ALLOWED");
        console.log(req.socket.remoteAddress + " is not an admin");
        res.redirect('/');
    } else {
        console.log("CONNECTION LOST");
        res.redirect('/');
    }
})

app.post('/upload-data', (req, res) => {
    if (perms[req.socket.remoteAddress] == 2) {
        let finalLocation = req.body.location;
        let file = req.files.file;
        if (finalLocation.match(/\/$/)) {
            console.log("Path Format OK");
        } else {
            console.log("Validating Path Format...");
            finalLocation += "/";
            console.log("Path Format OK");
        }
        if (file.length > 1) {
            for (let i = 0; i < file.length; i++) {
                if (finalLocation.match(/^stored\//)) {
                    if (fs.existsSync(finalLocation) == false) {
                        fs.mkdirSync(finalLocation);
                        console.log("Creating " + finalLocation);
                    }
                    console.log("Uploading " + file[i].name);
                    autorename(finalLocation, file[i], req.socket.remoteAddress);
                } else {
                    console.log("NOT ALLOWED");
                }
            }
        } else {
            if (finalLocation.match(/^stored\//)) {
                if (fs.existsSync(finalLocation) == false) {
                    fs.mkdirSync(finalLocation);
                    console.log("Creating " + finalLocation);
                }
                console.log("Uploading " + file.name);
                autorename(finalLocation, file, req.socket.remoteAddress);
            } else {
                console.log("NOT ALLOWED");
            }
        }
        console.log("Done");
        console.log("Refreshing...");
        res.redirect('/');
    } else if (perms[req.socket.remoteAddress] == 1) {
        console.log("NOT ALLOWED");
        console.log(req.socket.remoteAddress + " is not an admin");
        fs.rmSync("./tmp", {recursive: true});
        fs.mkdirSync("./tmp");
        res.redirect('/');
    } else {
        console.log("CONNECTION LOST");
        fs.rmSync("./tmp", {recursive: true});
        fs.mkdirSync("./tmp");
        res.redirect('/');
    }
})

app.post('/format-data', (req, res) => {
    if (perms[req.socket.remoteAddress] == 2) {
        fs.rmSync("./stored", {recursive: true});
        fs.mkdirSync("./stored");
        console.log("Formatting Server Storage...");
        console.log("Done");
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        if (month < 10) {
            month = `0${month}`;
        }
        let day = date.getDate();
        if (day < 10) {
            day = `0${day}`;
        }
        let hours = date.getHours();
        if (hours < 10) {
            hours = `0${hours}`;
        }
        let minutes = date.getMinutes();
        if (minutes < 10) {
            minutes = `0${minutes}`;
        }
        let seconds = date.getSeconds();
        if (seconds < 10) {
            seconds = `0${seconds}`;
        }
        let tmparr = JSON.parse(fs.readFileSync('./ex/log.json'));
        let action = { [`${year} - ${month} - ${day}, ${hours}:${minutes}:${seconds}`]: `${req.socket.remoteAddress} formatted the server data` };
        tmparr.unshift(action);
        fs.writeFileSync('./ex/log.json', JSON.stringify(tmparr));
        res.redirect('/');
    } else if (perms[req.socket.remoteAddress] == 1) {
        console.log("NOT ALLOWED");
        console.log(req.socket.remoteAddress + " is not an admin");
        res.redirect('/');
    } else {
        console.log("CONNECTION LOST");
        res.redirect('/');
    }
})

function zipperRename(p, h) {
    count++;
    if (fs.existsSync('./stored/' + p + " (" + count + ").zip")) {
        zipperRename(p);
    } else {
        console.log("Zip file renamed in " + p + " (" + count + ").zip");
        try {
            zipLocal.sync.zip("./temp/my-zipped-files").compress().save('./stored/' + p + " (" + count + ").zip");
            let date = new Date();
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            if (month < 10) {
                month = `0${month}`;
            }
            let day = date.getDate();
            if (day < 10) {
                day = `0${day}`;
            }
            let hours = date.getHours();
            if (hours < 10) {
                hours = `0${hours}`;
            }
            let minutes = date.getMinutes();
            if (minutes < 10) {
                minutes = `0${minutes}`;
            }
            let seconds = date.getSeconds();
            if (seconds < 10) {
                seconds = `0${seconds}`;
            }
            let tmparr = JSON.parse(fs.readFileSync('./ex/log.json'));
            let action = { [`${year} - ${month} - ${day}, ${hours}:${minutes}:${seconds}`]: `${h} created ${p} (${count}).zip in stored/.` };
            tmparr.unshift(action);
            fs.writeFileSync('./ex/log.json', JSON.stringify(tmparr));
        } catch (err) {
            console.log(`ERROR : ${err}`);
        }
    }
    count = 0;
}

app.post('/zip-data', (req, res) => {
    if (perms[req.socket.remoteAddress] == 2) {
        fs.mkdirSync('./temp/');
        fs.mkdirSync('./temp/my-zipped-files');
        console.log("Zipping...");
        if (Array.isArray(req.body.locationtozip)) {
            for (let i = 0; i < req.body.locationtozip.length; i++) {
                if (req.body.locationtozip[i].match(/^stored\//)) {
                    if (req.body.locationtozip[i][req.body.locationtozip[i].length - 1] == "/") {
                        fsext.copySync(req.body.locationtozip[i], './temp/my-zipped-files/' + req.body.locationtozipname[i] + "/");
                    } else {
                        fs.copyFileSync(req.body.locationtozip[i], './temp/my-zipped-files/' + req.body.locationtozipname[i]);
                    }
                } else {
                    console.log("NOT ALLOWED");
                }
            }
        } else {
            if (req.body.locationtozip.match(/^stored\//)) {
                    if (req.body.locationtozip[req.body.locationtozip.length - 1] == "/") {
                        fsext.copySync(req.body.locationtozip, './temp/my-zipped-files/' + req.body.locationtozipname + "/");
                    } else {
                        fs.copyFileSync(req.body.locationtozip, './temp/my-zipped-files/' + req.body.locationtozipname);
                    }
                } else {
                    console.log("NOT ALLOWED");
                }
        }
        if (req.body.finalzipname == "") {
            req.body.finalzipname = "my-zipped-files";
        }
        if (req.body.finalzipname.match(/\//)) {
            req.body.finalzipname = req.body.finalzipname.replaceAll("/", "-");
        }
        if (fs.existsSync('./stored/' + req.body.finalzipname + '.zip')) {
            console.log("Zip file already exists, renaming...");
            zipperRename(req.body.finalzipname, req.socket.remoteAddress);
        } else {
            try {
                zipLocal.sync.zip("./temp/my-zipped-files").compress().save("./stored/" + req.body.finalzipname + ".zip");
                let date = new Date();
                let year = date.getFullYear();
                let month = date.getMonth() + 1;
                if (month < 10) {
                    month = `0${month}`;
                }
                let day = date.getDate();
                if (day < 10) {
                    day = `0${day}`;
                }
                let hours = date.getHours();
                if (hours < 10) {
                    hours = `0${hours}`;
                }
                let minutes = date.getMinutes();
                if (minutes < 10) {
                    minutes = `0${minutes}`;
                }
                let seconds = date.getSeconds();
                if (seconds < 10) {
                    seconds = `0${seconds}`;
                }
                let tmparr = JSON.parse(fs.readFileSync('./ex/log.json'));
                let action = { [`${year} - ${month} - ${day}, ${hours}:${minutes}:${seconds}`]: `${req.socket.remoteAddress} created ${req.body.finalzipname}.zip in stored/.` };
                tmparr.unshift(action);
                fs.writeFileSync('./ex/log.json', JSON.stringify(tmparr));
                console.log("Zip file created");
            } catch (err) {
                console.log(`ERROR : ${err}`);
            }
        }
        fs.rmSync('./temp', {recursive: true});
        console.log("Refreshing...");
        res.redirect('/');
    } else if (perms[req.socket.remoteAddress] == 1) {
        console.log("NOT ALLOWED");
        console.log(req.socket.remoteAddress + " is not an admin");
        res.redirect('/');
    } else {
        console.log("CONNECTION LOST");
        res.redirect('/');
    }
})

app.post('/remove-data', (req, res) => {
    if (perms[req.socket.remoteAddress] == 2) {
        let locationToRemove = req.body.locationremoved;
        let typeToRemove = req.body.typeremoved;
        if (Array.isArray(locationToRemove)) {
            for (let i = 0; i < locationToRemove.length; i++) {
                if (locationToRemove[i].match(/^stored\//)) {
                if (locationToRemove[i] == "stored/") {
                    console.log("NOT ALLOWED");
                } else {
                    if (typeToRemove == "file") {
                        console.log("Removing " + locationToRemove[i]);
                        fs.unlinkSync(locationToRemove[i]);
                        let date = new Date();
                        let year = date.getFullYear();
                        let month = date.getMonth() + 1;
                        if (month < 10) {
                            month = `0${month}`;
                        }
                        let day = date.getDate();
                        if (day < 10) {
                            day = `0${day}`;
                        }
                        let hours = date.getHours();
                        if (hours < 10) {
                            hours = `0${hours}`;
                        }
                        let minutes = date.getMinutes();
                        if (minutes < 10) {
                            minutes = `0${minutes}`;
                        }
                        let seconds = date.getSeconds();
                        if (seconds < 10) {
                            seconds = `0${seconds}`;
                        }
                        let tmparr = JSON.parse(fs.readFileSync('./ex/log.json'));
                        let splitted = locationToRemove[i].split("/");
                        splitted.pop();
                        let finalsplit = splitted.join("/");
                        let action = { [`${year} - ${month} - ${day}, ${hours}:${minutes}:${seconds}`]: `${req.socket.remoteAddress} removed ${locationToRemove[i].split("/")[locationToRemove[i].split("/").length - 1]} in ${finalsplit}/.` };
                        tmparr.unshift(action);
                        fs.writeFileSync('./ex/log.json', JSON.stringify(tmparr));
                    } else {
                        console.log("Removing " + locationToRemove[i]);
                        fs.rmSync(locationToRemove[i], {recursive: true});
                        let date = new Date();
                        let year = date.getFullYear();
                        let month = date.getMonth() + 1;
                        if (month < 10) {
                            month = `0${month}`;
                        }
                        let day = date.getDate();
                        if (day < 10) {
                            day = `0${day}`;
                        }
                        let hours = date.getHours();
                        if (hours < 10) {
                            hours = `0${hours}`;
                        }
                        let minutes = date.getMinutes();
                        if (minutes < 10) {
                            minutes = `0${minutes}`;
                        }
                        let seconds = date.getSeconds();
                        if (seconds < 10) {
                            seconds = `0${seconds}`;
                        }
                        let tmparr = JSON.parse(fs.readFileSync('./ex/log.json'));
                        let splitted = locationToRemove[i].split("/");
                        splitted.pop();
                        splitted.pop();
                        let finalsplit = splitted.join("/");
                        let action = { [`${year} - ${month} - ${day}, ${hours}:${minutes}:${seconds}`]: `${req.socket.remoteAddress} removed ${locationToRemove[i].split("/")[locationToRemove[i].split("/").length - 2]} in ${finalsplit}/.` };
                        tmparr.unshift(action);
                        fs.writeFileSync('./ex/log.json', JSON.stringify(tmparr));
                    }
                }
            } else {
                console.log("NOT ALLOWED");
            }
            }
        } else {
            if (locationToRemove.match(/^stored\//)) {
                if (locationToRemove == "stored/") {
                    console.log("NOT ALLOWED");
                } else {
                    if (typeToRemove == "file") {
                        console.log("Removing " + locationToRemove);
                        fs.unlinkSync(locationToRemove);
                        let date = new Date();
                        let year = date.getFullYear();
                        let month = date.getMonth() + 1;
                        if (month < 10) {
                            month = `0${month}`;
                        }
                        let day = date.getDate();
                        if (day < 10) {
                            day = `0${day}`;
                        }
                        let hours = date.getHours();
                        if (hours < 10) {
                            hours = `0${hours}`;
                        }
                        let minutes = date.getMinutes();
                        if (minutes < 10) {
                            minutes = `0${minutes}`;
                        }
                        let seconds = date.getSeconds();
                        if (seconds < 10) {
                            seconds = `0${seconds}`;
                        }
                        let tmparr = JSON.parse(fs.readFileSync('./ex/log.json'));
                        let splitted = locationToRemove.split("/");
                        splitted.pop();
                        let finalsplit = splitted.join("/");
                        let action = { [`${year} - ${month} - ${day}, ${hours}:${minutes}:${seconds}`]: `${req.socket.remoteAddress} removed ${locationToRemove.split("/")[locationToRemove.split("/").length - 1]} in ${finalsplit}/.` };
                        tmparr.unshift(action);
                        fs.writeFileSync('./ex/log.json', JSON.stringify(tmparr));
                    } else {
                        console.log("Removing " + locationToRemove);
                        fs.rmSync(locationToRemove, {recursive: true});
                        let date = new Date();
                        let year = date.getFullYear();
                        let month = date.getMonth() + 1;
                        if (month < 10) {
                            month = `0${month}`;
                        }
                        let day = date.getDate();
                        if (day < 10) {
                            day = `0${day}`;
                        }
                        let hours = date.getHours();
                        if (hours < 10) {
                            hours = `0${hours}`;
                        }
                        let minutes = date.getMinutes();
                        if (minutes < 10) {
                            minutes = `0${minutes}`;
                        }
                        let seconds = date.getSeconds();
                        if (seconds < 10) {
                            seconds = `0${seconds}`;
                        }
                        let tmparr = JSON.parse(fs.readFileSync('./ex/log.json'));
                        let splitted = locationToRemove.split("/");
                        splitted.pop();
                        splitted.pop();
                        let finalsplit = splitted.join("/");
                        let action = { [`${year} - ${month} - ${day}, ${hours}:${minutes}:${seconds}`]: `${req.socket.remoteAddress} removed ${locationToRemove.split("/")[locationToRemove.split("/").length - 2]} in ${finalsplit}/.` };
                        tmparr.unshift(action);
                        fs.writeFileSync('./ex/log.json', JSON.stringify(tmparr));
                    }
                }
            } else {
                console.log("NOT ALLOWED");
            }
        }
        console.log("Done");
        console.log("Refreshing...");
        res.redirect('/');
    } else if (perms[req.socket.remoteAddress] == 1) {
        console.log("NOT ALLOWED");
        console.log(req.socket.remoteAddress + " is not an admin");
        res.redirect('/');
    } else {
        console.log("CONNECTION LOST");
        res.redirect('/');
    }
})

app.listen(JSON.parse(fs.readFileSync('./netParams.json')).port, JSON.parse(fs.readFileSync('./netParams.json')).ip, () => {
    console.log(`Server Listening on ${JSON.parse(fs.readFileSync('./netParams.json')).ip}:${JSON.parse(fs.readFileSync('./netParams.json')).port}`);
});

app.on('error', err => console.log(err));