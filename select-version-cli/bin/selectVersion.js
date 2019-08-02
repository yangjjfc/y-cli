const fs = require('fs')
const path = require('path')
const inquirer = require('inquirer') //命令行交互的工具
const semver = require('semver')//语义化版本
console.log(process.stderr,'process.stderr')
// 不要使用 stdout，参考链接https://github.com/SBoudrias/Inquirer.js/issues/519
const prompt = inquirer.createPromptModule({ output: process.stderr })
console.log(prompt)
function getReleaseVersion() {
  return new Promise((resolve, reject) => {
    // const dir = path.resolve(process.cwd(), 'package.json') //获取package.json
    const dir = path.resolve(__dirname, '../../','package.json') //获取package.json
    if (!fs.existsSync(dir)) {
      reject(new Error(dir + 'doesn\'t exist'))
      return
    }
    const version = require(dir).version
    if (!version) {
      reject(new Error('no version in package.json'))
      return
    }
    const releaseType = ['patch', 'minor', 'major', 'prepatch', 'preminor', 'premajor', 'prerelease']
    const choices = releaseType.map(item => `${item}: ${semver.inc(version, item)}`) //处理版本
    prompt([
      {
        name: 'version',
        type: 'list',
        message: 'Select release version',
        choices: choices
      }
    ]).then(({ version }) => {
      const newVersion = version.split(':')[1].trim()
      resolve(newVersion)
    })
  })
}

module.exports = getReleaseVersion
