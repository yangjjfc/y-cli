const fs=require("fs");
const p=require("path");
const deleteFolder=(path) =>{
    let files = [];
    if( fs.existsSync(path) ) {
        if(fs.statSync(path).isFile()){
            fs.unlinkSync(path);
        }else{
            files = fs.readdirSync(path);
            files.forEach(function(file,index){
                let curPath = path + "/" + file;
                if(fs.statSync(curPath).isDirectory()) {
                    deleteFolder(curPath);
                } else {
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(path);
        }
       
    }
}

module.exports = deleteFolder;