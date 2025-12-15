//an api that returns json data

const http = require('http');

const server = http.createServer((req, res) => {
const data = "this is text and it is turning to json";
const json = JSON.stringify(data);
res.writeHead(200, {'Content-Type': "application/json"});
res.end(json);
console.log("Returned Json Data");
})

server.listen(2000, () => {
    console.log("app is working at http://localhost:2000");
})
