//4. Create an Express route that uses async/await


const express = require('express');

const app  = express();

     app.get('/', async (req, res) => {
        try{
            const data = await fs.readFile('data.txt', 'utf8');  // ← Actual async operation

        res.send(data);
        }catch(err){
            console.error('Error:', err);
        res.status(500).send('Error occurred');
        }
}) ;

app.listen(3000, () => {
    console.log('Server running on port 3000');
});