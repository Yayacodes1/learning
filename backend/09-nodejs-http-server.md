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
    // Get request method
    console.log('Method:', req.method);
    
    // Get request URL
    console.log('URL:', req.url);
    
    // Get headers
    console.log('Headers:', req.headers);
    
    // Read request body (for POST requests)
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    
    req.on('end', () => {
        console.log('Body:', body);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ received: true }));
    });
});

server.listen(3000);
```

### 4. Sending JSON Responses
```javascript
const http = require('http');

const server = http.createServer((req, res) => {
    const data = {
        message: 'Hello, World!',
        timestamp: new Date().toISOString()
    };
    
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
});

server.listen(3000);
```

### 5. Serving Static Files
```javascript
const http = require('http');
const fs = require('fs');
const path = require('path');

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
    const query = parsedUrl.query;
    
    console.log('Path:', parsedUrl.pathname);
    console.log('Query:', query);
    
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(`Path: ${parsedUrl.pathname}`);
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
