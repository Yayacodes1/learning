// Callback-based code (convert this to async/await)
const fs = require('fs');
async  function readAndWrite () {

try{
   const read = await fs.readFile('data.txt', 'utf8');
   const write= await fs.writeFile('output.txt', data.toUpperCase());
   console.log('File content:', data);
   console.log('File written successfully!');
   return;
}catch{
    if(err){
        console.error('Error :', err);
            return;
    }
}
}
   
   readAndWrite();
    
// Callback-based code (convert this to async/await)
const fs = require('fs').promises;

fs.readFile('data.txt', 'utf8', (err, data) => {
    if (err) {
        console.error('Error:', err);
        return;
    }
    console.log('File content:', data);
    
    fs.writeFile('output.txt', data.toUpperCase(), (err) => {
        if (err) {
            console.error('Error writing:', err);
            return;
        }
        console.log('File written successfully!');
    });
});