const http = require('http');

const server = http.createServer((req, res) => {

console.log('Method: ', req.method);

console.log('Url: ', req.url);

console.log('Headers: ', req.headers);


let body = '';
req.on('data', chunk =>{
    body += chunk.toString();
});

req.on('end', ()=> {
    console.log('Body:', body);
    res.writeHead(200,('Content-Type', 'application/json'))
})
});



server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});



