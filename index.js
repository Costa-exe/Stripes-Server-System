const os = require('os');
const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const upload = require('express-fileupload');
const dirTree = require("directory-tree");
const storage = './stored/';
const network = JSON.parse(fs.readFileSync('./netParams.json'));
const bodyParser = require('body-parser');
const si = require('systeminformation');
const chkdisk = require('check-disk-space').default;

app.use(express.static(__dirname));
app.use(upload());

app.get('/', (req, res) => {
    const files = dirTree(storage, {attributes:['size', 'type', 'extension']});
    console.log("New Request Received");
    res.sendFile('./fm.html', {root : __dirname});
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

app.post('/upload-data', (req, res) => {
    let finalLocation = req.body.location;
    let file = req.files.file;
    if (finalLocation.match(/\/$/)) {
        console.log("Path Format OK");
    } else {
        console.log("Validating Path Format...");
        finalLocation += "/";
        console.log("Path Format OK");
    }
    if (finalLocation.match(/^stored\//)) {
        if (fs.existsSync(finalLocation) == false) {
            fs.mkdirSync(finalLocation);
            console.log("Creating " + finalLocation);
        }
        file.mv(finalLocation + file.name, (err) => {
            if (err) {
                console.log(`ERROR : ${err}`);
            } else {
                console.log("Uploading...");
                console.log("Done");
                console.log("Refreshing...");
            }
        });
    } else {
        console.log("NOT ALLOWED");
    }
    res.redirect('back');
})

app.post('/remove-data', (req, res) => {
    let locationToRemove = req.body.locationremoved;
    let typeToRemove = req.body.typeremoved;
    if (locationToRemove.match(/^stored\//)) {
        if (locationToRemove == "stored/") {
            console.log("NOT ALLOWED");
        } else {
            if (typeToRemove == "file") {
                console.log("Removing " + locationToRemove);
                fs.unlinkSync(locationToRemove);
                console.log("Removed");
                console.log("Refreshing...");
            } else {
                console.log("Removing " + locationToRemove);
                fs.rmdirSync(locationToRemove);
                console.log("Removed");
                console.log("Refreshing...");
            }
        }
    } else {
        console.log("NOT ALLOWED");
    }
    res.redirect('back');
})

app.listen(network.port, network.ip, () => {
    console.log(`Server Listening on ${network.ip}:${network.port}`);
});

app.on('error', err => console.log(err));