const fs = require('fs-extra')
const path = require('path')
const chalk = require('chalk')
const { execSync } = require('child_process');
//安装哪个项目
const selectWhichObject = require('../select-which-object/select-which-object.js')
const create = (name,options)=> {
    const dirPro = path.resolve(process.cwd(), name); //目标文件
    console.log(dirPro)
    selectWhichObject().then(version=>{
        switch (version) {
            case 'vue-system':
            const operation = require('../vue-system/config/index')
            execSync(`vue create  ${name}`,{cwd:process.cwd()})
            //copy,del等配置操作
            // operation(name)
                break;
            default:
                break;
        }
    })
}


module.exports = create