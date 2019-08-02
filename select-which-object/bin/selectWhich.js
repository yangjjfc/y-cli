const inquirer = require('inquirer') //命令行交互的工具
const releaseType = require('./version')
// 不要使用 stdout，参考链接https://github.com/SBoudrias/Inquirer.js/issues/519
const prompt = inquirer.createPromptModule({ output: process.stderr })

function getReleaseVersion() {
  return new Promise((resolve, reject) => {
    const choices = releaseType.map(item => `${item}`) //处理版本
    prompt([
      {
        name: 'version',
        type: 'list',
        message: 'Select release version',
        choices: choices
      }
    ]).then(({ version }) => {
      const newVersion = version.trim()
      resolve(newVersion)
    })
  })
}

module.exports = getReleaseVersion
