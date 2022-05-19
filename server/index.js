const os = require('os');
const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const dirTree = require("directory-tree");
const storage = './stored/';
const network = require('../netParams.json');

app.use(express.static(__dirname));

app.get('/', (req, res) => {
    const files = dirTree(storage, {attributes:['size', 'type', 'extension']});
    const filesToScan = './files.json';
    console.log("New Request Received");
    res.sendFile('./fm.html', {root : __dirname});
    fs.writeFile(filesToScan, JSON.stringify(files.children), (err) => {
        if(err) {
            console.log(`ERROR : ${err}`);
        } else {
            console.log("Files Ready");
        }
    });
})

app.listen(network.port, network.ip, () => {
    console.log(`Server Listening on ${network.ip}:${network.port}`);
});

app.on('error', err => console.log(err));