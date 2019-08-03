const fs = require("fs");
const path = require("path");
const { execSync } = require('child_process');
const copy = require("./copy");
const deleteFolder = require("./delete");
const config = require("./configuration");
let name = process.argv[2];
if (!name) {
  console.error("[组件名]必填 - Please enter new component name");
  process.exit(1);
}

const dirPro = path.resolve(process.cwd(), name); //目标文件
const dirTpm = path.resolve(__dirname, "../tpm"); //模板文件

//删除
config.delFile.forEach(item => {
  deleteFolder(dirPro + "/" + item);
});

//转化路径问题
let trasPath=(dir,item)=>{
  return path.normalize(path.resolve(dir,item))
}
//需要copy的文件
config.copyfile.forEach(item => {
  copy(trasPath(dirTpm,'./'+item  ) , trasPath(dirPro,'./'+item  ));
});

//注入内容
for (const key of Object.keys(config.inject)) {
  let data1=fs.readFileSync(path.resolve(__dirname, "../tpm/"+config.inject[key]), 'utf8').split(/\r\n|\n|\r/gm);
  let data2=fs.readFileSync(path.resolve(process.cwd(),name,'./'+key), 'utf8').split(/\r\n|\n|\r/gm);
  //展示写死 TODO
  if(data2.includes("import './registerServiceWorker';")){
    for (const [index,item] of data1.entries()) {
      if(!item.includes('import')){
        data1.splice(index,0,"import './registerServiceWorker';")
        break;
      }
    }
  }
  fs.writeFileSync(path.resolve(process.cwd(),name,'./'+key), data1.join('\r\n'))
}

//安装依赖
for (const key of Object.keys(config.yarn)) {
  config.yarn[key].forEach(item=>{
    console.log(item)
    if(key==='devDependencies'){
      execSync(`yarn add ${item} -D`,{cwd:dirPro})
    }else{
      execSync(`yarn add ${item} -S`,{cwd:dirPro})
    }
  })
}



