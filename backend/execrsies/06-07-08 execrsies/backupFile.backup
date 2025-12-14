const fs =require('fs');

fs.writeFile("logFile.txt",'This is the log file text\n', (err) => {

    if(err){
        console.log("Error: " ,err);
        return;
    }
    console.log("log file written successfully");
    
    const now = new Date();
    fs.appendFile('logFile.txt', `${now}\n` , (err) => {
        if (err) console.error(err);
});
} );


