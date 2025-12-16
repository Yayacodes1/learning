//4. Handle POST requests and log the data

const http = require('http');
const server = http.createServer((req, res) => {
if(req.method === 'POST'){
   

    let body = "";
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', () => {
        console.log('Body:', body);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ received: true }));



    });

}else {
    // Tell them "Hey, I only accept POST requests!"
    res.writeHead(405);
    res.end('Method not allowed');
}
});

server.listen(8000, () =>{
    console.log('Server is running on http://localhost:8000');

})