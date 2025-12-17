# Node.js HTTP Server

## Creating Web Servers
Node.js can create HTTP servers to handle web requests.

## Key Concepts:

### 1. Basic HTTP Server
```javascript
const http = require('http');

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello, World!');
});

server.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
```

### 2. Handling Different Routes
```javascript
const http = require('http');

const server = http.createServer((req, res) => {
    if (req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<h1>Home Page</h1>');
    } else if (req.url === '/about') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<h1>About Page</h1>');
    } else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 - Not Found</h1>');
    }
});

server.listen(3000);
```

### 3. Reading Request Data
```javascript
const http = require('http');

const server = http.createServer((req, res) => {
    // Get request method and print it out
    console.log('Method:', req.method);
    
    // Get request URL and print it out. 
    console.log('URL:', req.url);
    
    // Get headers and print  it out. 
    console.log('Headers:', req.headers);
    
    // Read request body (for POST requests). Since the body is going to be something that's going to get streamed if you don't get it at once, that's why we need to do extra stuff on it. 
    let body = '';
    //This basically means it will let the body as an empty. 
    req.on('data', chunk => {
        //req.on('data', ...) listens for data chunks as they arrive. The callback function receives each chunk of data. This event can fire multiple times if the body is large.
        body += chunk.toString();
        //Each chunk is converted to a string and appended to body. Chunks come as Buffer objects, so we use .toString() to convert them to strings.
    });
    
    req.on('end', () => {
        //This is going to listen for the streaming event ending. And then there's an anonymous function that's made. 
        console.log('Body:', body);
        //And then on the log console, we'll see body, and we're also going to see body shown as strengths. 
        res.writeHead(200, { 'Content-Type': 'application/json' });
        //Sets the HTTP status code to 200 (success) and sets the Content-Type header to application/json, which tells the browser the response is JSON.
        res.end(JSON.stringify({ received: true }));
        //Converts the object to a JSON string and sends it as the response body. res.end() closes the connection and sends the data to the browser. Note: res.end() (response method) is different from req.on('end', ...) (request event listener).
    });
});

server.listen(3000);
//And this is basically running the function which listens for my program at port 3000. 
```

### 4. Sending JSON Responses
```javascript
const http = require('http');

// This is basically going to create an HTTP server
const server = http.createServer((req, res) => {
    // It will save inside data a message
    const data = {
        message: 'Hello, World!',
        // Also, the timestamp is going to be the time where the server is being called
        timestamp: new Date().toISOString()
    };
    
    // It will set a success message (200 status code)
    // Content type would be updated to application/json
    res.writeHead(200, { 'Content-Type': 'application/json' });
    // On the browser, you will see data as in JSON format showing up, and it will show "Hello World" and it will show the time that the message, the current time actually
    res.end(JSON.stringify(data));
});

server.listen(3000);
```

### 5. Serving Static Files
```javascript
const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
    let filePath = '.' + req.url;
    if (filePath === './') filePath = './index.html';
    
    const extname = path.extname(filePath);
    const contentType = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json'
    }[extname] || 'text/plain';
    
    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(404);
            res.end('File not found');
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        }
    });
});

server.listen(3000);
```

### 6. URL Parsing
```javascript
const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    //Url.parse() instead of giving us a string it will give us an object because we specified using trye

    const query = parsedUrl.query;
    //takes the query which is the part of the url after ? and saves it into 
    // query
    console.log('Path:', parsedUrl.pathname);
    //logs the pathname portion of the URL to the console" or "logs the URL pathname to the console
    console.log('Query:', query);
        //logs the query parameters (everything after ? in the URL) to the console

    
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    //makes the header say text/plain
    res.end(`Path: ${parsedUrl.pathname}`);
    //shows inn the browser the path name of the URL. 
});

server.listen(3000);
```

### 7. Request Methods
```javascript
const http = require('http');

const server = http.createServer((req, res) => {
    if (req.method === 'GET') {
        res.writeHead(200);
        res.end('GET request');
    } else if (req.method === 'POST') {
        res.writeHead(200);
        res.end('POST request');
    } else {
        res.writeHead(405);
        res.end('Method not allowed');
    }
});

server.listen(3000);
```

## Practice:
1. Create a server that responds with different messages for different routes
2. Create a simple API that returns JSON data
3. Build a server that serves HTML files
4. Handle POST requests and log the data
