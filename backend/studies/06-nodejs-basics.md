# Node.js Basics

## What is Node.js?
Node.js is JavaScript running on the server-side. It lets you build backend applications, APIs, and servers using JavaScript.

## Key Concepts:

### 1. Why Node.js?
- **Same language**: Use JavaScript for both frontend and backend
- **Fast**: Built on Chrome's V8 engine
- **Non-blocking**: Handles many requests efficiently
- **Huge ecosystem**: Millions of packages via NPM

### 2. Installation
Check if Node.js is installed:
```bash
node --version
npm --version
```

### 3. Running JavaScript Files
Create a file `app.js`:
```javascript
console.log("Hello from Node.js!");
```

Run it:
```bash
node app.js
```

### 4. Node.js vs Browser JavaScript
**Differences:**
- **No `window` or `document`** - Node.js doesn't have a browser
- **Global object is `global`** (not `window`)
- **Can access file system** - read/write files
- **Can create servers** - handle HTTP requests

### 5. Common Node.js Globals
- `console` - logging (same as browser)
- `process` - information about the Node.js process
- `__dirname` - current directory path
- `__filename` - current file path
- `require()` - import modules
- `module.exports` - export modules

### Example:
```javascript
// app.js
console.log("Current directory:", __dirname);
console.log("Current file:", __filename);
console.log("Node version:", process.version);
```

### 6. Your First Node.js Program
```javascript
// greet.js
const name = process.argv[2] || "World";
console.log(`Hello, ${name}!`);
```

Run: `node greet.js Yahya` → "Hello, Yahya!"

## Practice:
1. Create a file that prints your name
2. Create a file that uses `process.argv` to accept command-line arguments
3. Print `__dirname` and `__filename` to see what they contain
