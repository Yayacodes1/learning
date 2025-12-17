# Node.js Modules and NPM

## What are Modules?
Modules let you split code into separate files and reuse code across your project.

## Key Concepts:

### 1. Creating Your Own Modules
**Export a module:**
```javascript
// math.js
function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

module.exports = {
    add,
    subtract
};
```

**Import a module:**
```javascript
// app.js
const math = require('./math.js');

console.log(math.add(5, 3)); // 8
console.log(math.subtract(10, 4)); // 6
```

### 2. Different Export Styles

**Export multiple things:**
```javascript
// utils.js
module.exports.add = (a, b) => a + b;
module.exports.multiply = (a, b) => a * b;
```

**Export a single function:** to
```javascript
// greet.js
module.exports = function(name) {
    return `Hello, ${name}!`;
};
```

**Using ES6 destructuring:**
```javascript

// app.js
const { add, multiply } = require('./utils.js');
```

### 3. Built-in Node.js Modules
Node.js comes with many built-in modules:

**fs (File System):**
```javascript
const fs = require('fs');
```

**path:**
```javascript
const path = require('path');
const filePath = path.join(__dirname, 'data', 'file.txt');
```

**http:**
```javascript
const http = require('http');
```

**os:**
```javascript
const os = require('os');
console.log(os.platform()); // 'darwin', 'win32', 'linux'
```

### 4. NPM (Node Package Manager)
NPM is the package manager for Node.js.

**Initialize a project:**
```bash
npm init
# or
npm init -y  # skip questions, use defaults
```

**Install a package:**
```bash
npm install express
# or short form
npm i express
```

**Install as dev dependency:**
```bash
npm install --save-dev nodemon
```

**package.json** - tracks your dependencies:
```json
{
  "name": "my-app",
  "version": "1.0.0",
  "dependencies": {
    "express": "^5.2.1"
  }
}
```

**Install all dependencies:**
```bash
npm install
```

**Uninstall a package:**
```bash
npm uninstall express
```

### 5. Using Installed Packages
```javascript
// app.js
const express = require('express');
const app = express();
```

### 6. NPM Scripts
Add scripts to `package.json`:
```json
{
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js"
  }
}
```

Run scripts:
```bash
npm start
npm run dev
```

## Practice:
1. Create a module with utility functions (capitalize, reverse string)
2. Import and use it in another file
3. Install a package like `colors` and use it to color your console output
4. Create an NPM script that runs your app


