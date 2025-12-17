# Node.js Asynchronous Programming

## Understanding Async Code
Node.js is asynchronous by nature. Understanding callbacks, promises, and async/await is crucial.

## Key Concepts:

### 1. Callbacks
Functions passed as arguments that execute after an operation completes.

```javascript
const fs = require('fs');

// Callback example
fs.readFile('file.txt', 'utf8', (err, data) => {
    if (err) {
        console.error('Error:', err);
        return;
    }
    console.log(data);
});
```

**Callback hell (nested callbacks):**
```javascript
fs.readFile('file1.txt', 'utf8', (err, data1) => {
    if (err) return console.error(err);
    fs.readFile('file2.txt', 'utf8', (err, data2) => {
        if (err) return console.error(err);
        fs.writeFile('output.txt', data1 + data2, (err) => {
            if (err) return console.error(err);
            console.log('Done!');
        });
    });
});
```

### 2. Promises
Promises represent a value that will be available in the future.

**Creating a Promise:**
```javascript
const myPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('Success!');
        // or reject('Error!');
    }, 1000);
});

myPromise
    .then(result => console.log(result))
    .catch(error => console.error(error));
```

**Using fs.promises:**
```javascript
const fs = require('fs').promises;

fs.readFile('file.txt', 'utf8')
    .then(data => {
        console.log(data);
        return fs.readFile('file2.txt', 'utf8');
    })
    .then(data => console.log(data))
    .catch(err => console.error(err));
```

**Promise.all (run in parallel):**
```javascript
const fs = require('fs').promises;

Promise.all([
    fs.readFile('file1.txt', 'utf8'),
    fs.readFile('file2.txt', 'utf8')
])
    .then(([data1, data2]) => {
        console.log(data1, data2);
    })
    .catch(err => console.error(err));
```

### 3. Async/Await
Modern way to write asynchronous code - makes it look synchronous!

```javascript
const fs = require('fs').promises;

async function readFiles() {
    try {
        const data1 = await fs.readFile('file1.txt', 'utf8');
        const data2 = await fs.readFile('file2.txt', 'utf8');
        console.log(data1, data2);
    } catch (err) {
        console.error('Error:', err);
    }
}

readFiles();
```

**Multiple files in parallel:**
```javascript
async function readFilesParallel() {
    try {
        const [data1, data2] = await Promise.all([
            fs.readFile('file1.txt', 'utf8'),
            fs.readFile('file2.txt', 'utf8')
        ]);
        console.log(data1, data2);
    } catch (err) {
        console.error(err);
    }
}
```

### 4. Converting Callbacks to Promises
```javascript
const util = require('util');
const fs = require('fs');

// Convert callback to promise
const readFile = util.promisify(fs.readFile);

async function read() {
    try {
        const data = await readFile('file.txt', 'utf8');
        console.log(data);
    } catch (err) {
        console.error(err);
    }
}
```

### 5. Async in Express Routes
```javascript
const express = require('express');
const app = express();
const fs = require('fs').promises;

app.get('/data', async (req, res) => {
    try {
        const data = await fs.readFile('data.json', 'utf8');
        res.json(JSON.parse(data));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
```

### 6. Error Handling Patterns
```javascript
// Try-catch with async/await
async function example() {
    try {
        const result = await someAsyncOperation();
        return result;
    } catch (error) {
        console.error('Error:', error);
        throw error; // Re-throw if needed
    }
}

// Promise chain error handling
someAsyncOperation()
    .then(result => {
        // Success
    })
    .catch(error => {
        // Error
    });
```

### 7. Common Patterns

**Sequential operations:**
```javascript
async function sequential() {
    const result1 = await operation1();
    const result2 = await operation2(result1);
    return result2;
}
```

**Parallel operations:**
```javascript
async function parallel() {
    const [result1, result2] = await Promise.all([
        operation1(),
        operation2()
    ]);
    return { result1, result2 };
}
```

**Race condition (first to finish):**
```javascript
const result = await Promise.race([
    slowOperation(),
    fastOperation()
]);
```

## Practice:
1. Convert callback-based code to async/await
2. Read multiple files sequentially and combine them
3. Read multiple files in parallel and process results
4. Create an Express route that uses async/await
5. Handle errors properly in async functions
