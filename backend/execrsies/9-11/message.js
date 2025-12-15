const http = require('http');

const server = http.createServer((req, res) => {
    if(req.url === '/about'){
        console.log("this is the about page");
        res.writeHead(200);
        res.end("this is the about page");
    }else if(req.url === '/home'){
        console.log("this is the home page");
        res.writeHead(200);
        res.end("this is the home page")

    }else{
        res.writeHead(404);
        console.log("error: ");
        res.end("error");
    }
    
} );

server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000')
});
