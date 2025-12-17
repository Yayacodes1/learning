# Node.js File System

## Working with Files
The `fs` module lets you read, write, and manipulate files.

## Key Concepts:

### 1. Reading Files

**Synchronous (blocking):**
```javascript
const fs = require('fs');

const data = fs.readFileSync('file.txt', 'utf8');
console.log(data);
```

**Asynchronous (non-blocking):**
```javascript
const fs = require('fs');

fs.readFile('file.txt', 'utf8', (err, data) => {
    if (err) {
        console.error('Error:', err);
        return;
    }
    console.log(data);
});
```

**Using Promises (fs.promises):**
```javascript
const fs = require('fs').promises;

async function readFile() {
    try {
        const data =  await fs.readFile('file.txt', 'utf8');
        console.log(data);
    } catch (err) {
        console.error('Error:', err);
    }
}

 readFile();
```

### 2. Writing Files

**Synchronous:**
```javascript
const fs = require('fs');

fs.writeFileSync('output.txt', 'Hello, World!');
```

**Asynchronous:**
```javascript
const fs = require('fs');

fs.writeFile('output.txt', 'Hello, World!', (err) => {
    if (err) {
        console.error('Error:', err);
        return;
    }
    console.log('File written successfully!');
});
```

**Appending to a file:**
```javascript
fs.appendFile('log.txt', 'New log entry\n', (err) => {
    if (err) console.error(err);
});
```

### 3. Checking if File Exists
```javascript
const fs = require('fs');

if (fs.existsSync('file.txt')) {
    console.log('File exists!');
}
```



### 4. Working with Directories

**Create directory:**
```javascript
fs.mkdir('new-folder', (err) => {
    if (err) console.error(err);
});
```

**Read directory:**
```javascript
fs.readdir('.', (err, files) => {
    if (err) console.error(err);
    console.log('Files:', files);
});
```

**Remove file:**
```javascript
fs.unlink('file.txt', (err) => {
    if (err) console.error(err);
});
```

**Remove directory:**
```javascript
fs.rmdir('folder', (err) => {
    if (err) console.error(err);
});
```

### 5. File Stats
```javascript
const fs = require('fs');

fs.stat('file.txt', (err, stats) => {
    if (err) console.error(err);
    console.log('Is file?', stats.isFile());
    console.log('Size:', stats.size);
    console.log('Created:', stats.birthtime);
});
```

### 6. Path Module
```javascript
const path = require('path');

// Join paths (handles different OS)
const filePath = path.join(__dirname, 'data', 'file.txt');

// Get file extension
const ext = path.extname('file.txt'); // '.txt'

// Get filename
const name = path.basename('data/file.txt'); // 'file.txt'

// Get directory
const dir = path.dirname('data/file.txt'); // 'data'
```

## Practice:
1. Create a program that reads a text file and counts the words
2. Write a program that creates a log file and appends timestamps
3. List all files in a directory and their sizes
4. Create a simple file backup script
