const fs = require("fs").promises;
const fileName = process.argv[2];
//read the file
async function backUp(fileToBackUp){
    try{

    
    const data = await fs.readFile(fileToBackUp, "utf-8");
    await fs.writeFile(fileName+'.backup', data);
    console.log("BAck up created succesfully!");

}catch(err){
    console.log("Error: ", err);
}
}


if(!fileName){
    console.log("Please enter correct file name");
}else{
    backUp(fileName);
}