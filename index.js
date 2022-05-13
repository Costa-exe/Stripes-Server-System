const http = require('http');
const os = require('os');
const fs = require('fs');
const storage = './stored/';
const html = fs.readFileSync('./fm.html');
const port = require('./port.json');
const ip = os.networkInterfaces().lo[0].address;

const server = http.createServer((req, res) => {
    console.log("New Request Received");
    res.statusCode = 200;
    fs.readdirSync(storage).forEach(file => {
        console.log(file);
    });
    res.setHeader('Content-type', 'html');
    res.write(html);
    res.end();
});

server.listen(port.port, ip, () => {
    console.log(`Server Listening on ${ip}:${port.port}`);
});

server.on('error', err => console.log(err));