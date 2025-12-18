//3. Read multiple files in parallel and process results

const fs = require('fs').promises;

const promise1 = fs.readFile('data1.txt','utf8');

const promise2 = fs.readFile('data2.txt','utf8');

const promises =  [promise1, promise2];

Promise.all(promises)
.then(value => {
    console.log(data1); // First file
    console.log(data2); // Second file});
});
