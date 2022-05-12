const http = require('http');
const os = require('os');
const port = require('./port.json');
const ip = os.networkInterfaces().lo[0].address;

const server = http.createServer((req, res) => {
    console.log("New Request Received");
});

server.listen(port.port, ip, () => {
    console.log(`Server Listening on ${ip}:${port.port}`);
});

server.on('error', err => console.log(err));