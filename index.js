const http = require('http');
const os = require('os');
const port = 3001;
const ip = os.networkInterfaces().lo[0].address;

const server = http.createServer((req, res) => {
    console.log("New Request Received");
});

server.listen(port, ip, () => {
    console.log(`Server Listening on ${ip}:${port}`);
});

server.on('error', err => console.log(err));