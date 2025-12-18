//2. Read multiple files sequentially and combine them

const fs = require('fs').promises;
let data1;
fs.readFile('data.txt', 'utf8')
.then(result=> {
    data1 = result;
    return fs.readFile('data2.txt', 'utf8');
})
.then(data2 =>{
    const combined = data1 + data2;
    console.log(combined);
})
.catch(err => {
    console.error('Error:', err);
})
