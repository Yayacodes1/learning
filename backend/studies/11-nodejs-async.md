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
Promise.all([
    fs.readFile('file1.txt', 'utf8'),  // ← Starts reading immediately
    fs.readFile('file2.txt', 'utf8')   // ← Starts reading immediately (at the same time!)
])
.then(([data1, data2]) => {
    // This runs when BOTH files are done
    // data1 = file1.txt content
    // data2 = file2.txt content
    console.log(data1, data2);  // Prints both at once
})
.catch(err => {
    // If EITHER file fails, this runs
    console.error(err);
});
```

### 3. Async/Await
Modern way to write asynchronous code - makes it look synchronous!

```javascript
// Import the file system module with Promise-based methods
// fs.promises provides async functions that return Promises instead of using callbacks
const fs = require('fs').promises;

// Define an async function - this allows us to use 'await' inside
// Async functions automatically return a Promise
async function readFiles() {
    try {
        // Read file1.txt and wait for it to complete
        // 'await' pauses execution here until the file is read
        // data1 will contain the content of file1.txt
        const data1 = await fs.readFile('file1.txt', 'utf8');
        
        // After file1 is read, read file2.txt and wait for it to complete
        // Note: This reads files SEQUENTIALLY (one after another), not in parallel
        // data2 will contain the content of file2.txt
        const data2 = await fs.readFile('file2.txt', 'utf8');
        
        // Once both files are read, log their contents
        console.log(data1, data2);
    } catch (err) {
        // If ANY error occurs (file not found, permission denied, etc.), catch it here
        // This replaces the .catch() method from Promise chains
        console.error('Error:', err);
    }
}

// Call the async function to execute it
readFiles();
```

**Multiple files in parallel:**
```javascript
async function readFilesParallel() {
    try {
        // Promise.all starts BOTH file reads simultaneously
        const [data1, data2] = await Promise.all([
            fs.readFile('file1.txt', 'utf8'),  // ← Starts reading
            fs.readFile('file2.txt', 'utf8')   // ← Starts reading (at the same time!)
        ]);
        // ↑ Waits for BOTH to finish, then destructures the array
        // data1 = file1.txt content
        // data2 = file2.txt content
        
        // Log both file contents
        console.log(data1, data2);
    } catch (err) {
        // If EITHER file fails, this catches the error
        console.error(err);
    }
}
```

### 4. Converting Callbacks to Promises
```javascript
// Import the util module - provides utility functions including promisify
// util.promisify converts callback-based functions to Promise-based functions
const util = require('util');
// Import the file system module (callback-based version, not .promises)
const fs = require('fs');

// Convert callback-based fs.readFile to Promise-based readFile
// This allows us to use async/await instead of callbacks
// Before: fs.readFile('file.txt', 'utf8', (err, data) => { ... })
// After: await readFile('file.txt', 'utf8')
const readFile = util.promisify(fs.readFile);

// Define an async function - allows us to use 'await' inside
// Async functions automatically return a Promise
async function read() {
    try {
        // Read the file and wait for it to complete
        // 'await' pauses execution here until the file is read
        // The readFile function now returns a Promise (thanks to promisify)
        // data will contain the file content when reading is complete
        const data = await readFile('file.txt', 'utf8');
        
        // Log the file content after it's been read
        console.log(data);
    } catch (err) {
        // If an error occurs (file not found, permission denied, etc.)
        // catch block handles it - this replaces .catch() from Promise chains
        console.error(err);
    }
}
```

### 5. Async in Express Routes
```javascript
// Import Express framework to create a web server
const express = require('express');
// Create an Express application instance
const app = express();
// Import file system module with Promise-based methods (for async/await)
const fs = require('fs').promises;

// Define a GET route at '/data' endpoint
// The route handler is an async function to handle asynchronous file operations
app.get('/data', async (req, res) => {
    // req = request object (contains info about the incoming request)
    // res = response object (used to send data back to the client)
    try {
        // Read the data.json file asynchronously and wait for it to complete
        // 'await' pauses here until the file is read
        // The file content is returned as a string
        const data = await fs.readFile('data.json', 'utf8');
        
        // Parse the JSON string into a JavaScript object
        // JSON.parse() converts the string to an object
        // Then send it as JSON response to the browser/client
        res.json(JSON.parse(data));
    } catch (err) {
        // If an error occurs (file not found, invalid JSON, etc.)
        // Send a 500 Internal Server Error status with error message
        // res.status(500) sets the HTTP status code
        // res.json() sends the error as JSON response
        res.status(500).json({ error: err.message });
    }
});
```

### 6. Error Handling Patterns
```javascript
// Try-catch with async/await
// Try-catch with async/await
// This is the modern way to handle errors in async functions
async function example() {
    try {
        // Execute an async operation and wait for it to complete
        // 'someAsyncOperation()' is a placeholder - replace with actual async function
        // Examples: await fs.readFile(), await db.query(), await fetch()
        const result = await someAsyncOperation();
        
        // If successful, return the result
        return result;
    } catch (error) {
        // If an error occurs, catch it here
        // Log the error to console for debugging
        console.error('Error:', error);
        
        // Re-throw the error to let the caller handle it
        // This allows error handling to propagate up the call stack
        throw error; // Re-throw if needed
    }
}

// Promise chain error handling
// This is the older way to handle errors with Promises
// Same functionality as try-catch, just different syntax
someAsyncOperation()
    .then(result => {
        // This runs when the operation is successful
        // 'result' contains the data from the async operation
        // Success
    })
    .catch(error => {
        // This runs when an error occurs
        // 'error' contains the error information
        // Error
    });
```

### 7. Common Patterns
```javascript
**Sequential operations:**
// Sequential = operations run one after another (not at the same time)
// Each operation waits for the previous one to finish
async function sequential() {
    // Wait for operation1 to complete, then store result in result1
    // This pauses execution here until operation1 finishes
    const result1 = await operation1();
    
    // Wait for operation2 to complete, passing result1 as input
    // operation2 can use the result from operation1
    // This also pauses execution until operation2 finishes
    const result2 = await operation2(result1);
    
    // Return the final result after both operations complete
    return result2;
}
```
```javascript
**Parallel operations:**
// Parallel = operations run at the same time (simultaneously)
// Both operations start together and we wait for both to finish
// Faster than sequential because operations don't wait for each other
async function parallel() {
    // Promise.all runs both operations at the same time
    // operation1() and operation2() start simultaneously
    // If one finishes faster, we wait for the slower one
    // We get results when BOTH complete
    const [result1, result2] = await Promise.all([
        operation1(),  // Starts immediately
        operation2()   // Starts immediately (at the same time as operation1)
    ]);
    // Both operations have finished by this point
    // Results are in the same order as the array: [operation1 result, operation2 result]
    // Return both results as an object
    return { result1, result2 };
}
```
```javascript
**Race condition (first to finish):**
// Promise.race runs multiple operations and returns the FIRST one to finish
// Unlike Promise.all (waits for all), race only waits for the fastest one
// The slower operations still run, but we don't wait for them
const result = await Promise.race([
    slowOperation(),  // Takes longer (e.g., 5 seconds)
    fastOperation()   // Takes less time (e.g., 1 second)
]);
// Result = fastOperation's result (only the first to finish)
// slowOperation still runs in background, but we don't wait for it
// Use case: Timeout, fastest API response, first available resource
```

## Practice:
1. Convert callback-based code to async/await
2. Read multiple files sequentially and combine them
3. Read multiple files in parallel and process results
4. Create an Express route that uses async/await
5. Handle errors properly in async functions
