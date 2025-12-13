const fs = require('fs').promises;

async function countText() {
    try {
        // Read the file
        const data = await fs.readFile('count.txt', 'utf8');
        
        // Count words (split by spaces and filter out empty strings)
        const words = data.split(/\s+/).filter(word => word.length > 0);
        const wordCount = words.length;
        
        console.log(`Word count: ${wordCount}`);
        return wordCount;
    } catch(err) {
        console.error('Error:', err);
    }
}

// Call the function
countText();