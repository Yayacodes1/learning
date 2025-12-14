const fs = require('fs').promises;

async function countText() {
    try {
        const data = await fs.readFile('count.txt', 'utf-8');
        const dataLength = data.length;
        console.log(`this file has ${dataLength} chars`);
        
    } catch(err) {
        console.error('Error:', err);
    }
}

// Call the function
countText();