# Node.js Asynchronous Programming

## Understanding Async Code
Node.js is asynchronous by nature. Understanding callbacks, promises, and async/await is crucial.

## Key Concepts:

### 1. Callbacks
Functions passed as arguments that execute after an operation completes.

```javascript
// This demonstrates "callback hell" - nested callbacks that are hard to read
// Step 1: Read the first file
fs.readFile('file1.txt', 'utf8', (err, data1) => {
    // err: error from reading file1.txt
    // data1: content of file1.txt (if successful)
    if (err) return console.error(err); // Exit if file1 couldn't be read
    
    // Step 2: Read the second file (nested inside first callback)
    fs.readFile('file2.txt', 'utf8', (err, data2) => {
        // err: error from reading file2.txt
        // data2: content of file2.txt (if successful)
        if (err) return console.error(err); // Exit if file2 couldn't be read
        
        // Step 3: Write combined content to output file (nested inside second callback)
        fs.writeFile('output.txt', data1 + data2, (err) => {
            // err: error from writing output.txt
            // Note: writeFile callback only has err parameter (no data returned)
            if (err) return console.error(err); // Exit if write failed
            
            // Step 4: Success! All operations completed
            console.log('Done!');
        });
    });
});
```

### 2. Promises
Promises represent a value that will be available in the future.

**Creating a Promise:**
```javascript
// Step 1: Create a new Promise
const myPromise = new Promise((resolve, reject) => {
    // Step 2: Set a timer for 1000 milliseconds (1 second)
    setTimeout(() => {
        // Step 3: After 1 second, call resolve with 'Success!'
        resolve('Success!');
        // The line below is just a comment - it doesn't actually run
        // or reject('Error!');
    }, 1000);
    // ↑ This means: wait 1000ms (1 second), then run the function
});

// Step 4: Handle the Promise result
myPromise
    .then(result => {
        // This runs when resolve() is called (after 1 second)
        // result = 'Success!' (the value passed to resolve)
        console.log(result);  // Prints: "Success!"
    })
    .catch(error => {
        // This would run if reject() was called (but it's not in this code)
        // error = whatever was passed to reject()
        console.error(error);
    });
```

**Using fs.promises:**
```javascript
const fs = require('fs').promises;
// ↑ Gets Promise-based version of fs methods

fs.readFile('file.txt', 'utf8')
    // Step 1: Read file.txt
    .then(data => {
        // Step 2: When file.txt is read successfully
        // data = content of file.txt
        console.log(data);  // Print file.txt content
        
        // Step 3: Return another Promise (read file2.txt)
        return fs.readFile('file2.txt', 'utf8');
        // ↑ This starts reading file2.txt
        // ↑ The next .then() will wait for this to finish
    })
    .then(data => {
        // Step 4: When file2.txt is read successfully
        // data = content of file2.txt (NOT both files!)
        console.log(data);  // Print file2.txt content
    })
    .catch(err => {
        // Step 5: If ANY step fails (file1 OR file2)
        console.error(err);
    });
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
