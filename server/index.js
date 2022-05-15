const os = require('os');
const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const dirTree = require("directory-tree");
const storage = './stored/';
const files = dirTree(storage, {attributes:['size', 'type', 'extension']});
const filesToScan = './files.json';
const network = require('../netParams.json');

app.use(express.static(__dirname));

app.get('/', (req, res) => {
    console.log("New Request Received");
    res.sendFile('./fm.html', {root : __dirname});
})

app.listen(network.port, network.ip, () => {
    fs.writeFile(filesToScan, JSON.stringify(files.children), (err) => {
        if(err) {
            console.log(`ERROR : ${err}`);
        } else {
            console.log("Files Ready");
        }
    });
    console.log(`Server Listening on ${network.ip}:${network.port}`);
});

app.on('error', err => console.log(err));