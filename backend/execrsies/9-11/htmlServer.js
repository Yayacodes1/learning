// Build a server that serves HTML files

const http = require('http');
const fs = require('fs');

const server = http.createServer((req,res) => {
    
    const file = '.'+ req.url;

fs.readFile(file, (err, content) => {
    if(err){
        res.writeHead(404);
        res.end('File not found');

    }else{
        res.writeHead(200, { 'Content-Type': "text/html" });
            res.end(content);
    }
});

});
server.listen(9000, () => {
    console.log('Server is running on http://localhost:9000');
});