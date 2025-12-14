const path = require('path');
const fs = require('fs').promises;

async function list(dirPath) {
    try{
        const files = await fs.readdir(dirPath);
        
        for(let file of files){
            const filePath =  path.join(dirPath, file); 
            const size = await fs.stat(filePath);
            console.log("File: ", file, `is ${size} in size`);
            
        }
        
    }
    catch(err){
        console.log("Error message: ", err);
    }
}

list('.');