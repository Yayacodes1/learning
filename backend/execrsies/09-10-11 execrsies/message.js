const http = 'http';

const server = http.createServer((req, res) => {
    if(req.url === './about'){
        console.log("this is the about page");
    }else if(req.url === './home'){
        console.log("this is the home page");

    }else{
        console.log("error: ", Error);
    }
    
} );

server.listen(3000);