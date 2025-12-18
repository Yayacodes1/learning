// Callback-based code (convert this to async/await)
const fs = require('fs').promises;
async  function readAndWrite () {

try{
   const read = await fs.readFile('data.txt', 'utf8');
   const write= await fs.writeFile('output.txt', read.toUpperCase());
   console.log('File content:', read);
   console.log('File written successfully!');
   return;
}catch(err){
   
        console.error('Error :', err);
            return;
    }
}

   
   readAndWrite();
    
