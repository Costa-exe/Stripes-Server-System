const fs = require('fs');
const express = require('express');
const app = express();
const upload = require('express-fileupload');
const dirTree = require("directory-tree");
const storage = './stored/';
const si = require('systeminformation');
const chkdisk = require('check-disk-space').default;

app.use(express.static(__dirname));
app.use(upload());
const perms = {};

    function scanning () {
        const files = dirTree(storage, {attributes:['size', 'type', 'extension']});
        console.log("New Request Received");
        fs.writeFile('./ex/files.json', JSON.stringify(files.children), (err) => {
            if (err) {
                console.log(`ERROR : ${err}`);
            } else {
                console.log("Files Ready");
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
        if (perms[req.socket.remoteAddress] == 1) {
            scanning();
            res.sendFile('./fm.html', {root : __dirname});
        } else {
            res.sendFile('./auth.html', {root: __dirname});
        }
    })

    app.post('/login', (req, res) => {
        if (req.body.password == JSON.parse(fs.readFileSync('./key.json')).key){
            perms[req.socket.remoteAddress] = 1;
            console.log(req.socket.remoteAddress + " has access to the server for this session");
            res.redirect('/');
        } else {
            perms[req.socket.remoteAddress] = 0;
            console.log("ACCESS DENIED");
            res.redirect('/');
        }
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

let count = 0;
function autorename (a, b) {
    if (fs.existsSync(a + b.name)) {
        count ++;
        if (fs.existsSync(a + b.name + " - Copy (" + count + ")")) {
            autorename(a, b);
        } else {
            console.log(b.name + " Already Exists, Renamed in : " + b.name + " - Copy (" + count +")");
            b.mv(a + b.name + " - Copy (" + count + ")", (err) => {
                if (err) {
                    console.log(`ERROR : ${err}`);
                }
            });
            count = 0;
        }
    } else {
        b.mv(a + b.name, (err) => {
            if (err) {
                console.log(`ERROR : ${err}`);
            }
        });
    }
}

app.post('/upload-data', (req, res) => {
    if (perms[req.socket.remoteAddress] == 1) {
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
                    autorename(finalLocation, file[i]);
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
                autorename(finalLocation, file);
            } else {
                console.log("NOT ALLOWED");
            }
        }
        console.log("Done");
        console.log("Refreshing...");
        res.redirect('back');
    } else {
        console.log("CONNECTION LOST");
        res.redirect('/');
    }
})

app.post('/format-data', (req, res) => {
    if (perms[req.socket.remoteAddress] == 1) {
        fs.rmSync("./stored", {recursive: true});
        fs.mkdirSync("./stored");
        console.log("Formatting Server Storage...");
        console.log("Done");
        res.redirect('/');
    } else {
        console.log("CONNECTION LOST");
        res.redirect('/');
    }
})

app.post('/remove-data', (req, res) => {
    if (perms[req.socket.remoteAddress] == 1) {
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
                    } else {
                        console.log("Removing " + locationToRemove[i]);
                        fs.rmSync(locationToRemove[i], {recursive: true});
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
                    } else {
                        console.log("Removing " + locationToRemove);
                        fs.rmSync(locationToRemove, {recursive: true});
                    }
                }
            } else {
                console.log("NOT ALLOWED");
            }
        }
        console.log("Done");
        console.log("Refreshing...");
        res.redirect('back');
    } else {
        console.log("CONNECTION LOST");
        res.redirect('/');
    }
})

app.listen(JSON.parse(fs.readFileSync('./netParams.json')).port, JSON.parse(fs.readFileSync('./netParams.json')).ip, () => {
    console.log(`Server Listening on ${JSON.parse(fs.readFileSync('./netParams.json')).ip}:${JSON.parse(fs.readFileSync('./netParams.json')).port}`);
});

app.on('error', err => console.log(err));