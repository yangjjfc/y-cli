#!/usr/bin/env node
const program = require('commander')
const selectVersion = require('./selectVersion')

const PACKAGE = require('../../package.json')
console.log(PACKAGE)
program.version(PACKAGE.version)

program.on('--help', () => {
  console.log('Select relase version using cli')
})

if (!process.argv.slice(2).length) {
  selectVersion().then((version) => {
    process.stdout.write(version)
  }).catch((err) => {
    console.error(err)
    process.exit(1)
  })
}

program.parse(process.argv)//解析命令行参数,参数定义完成后才能调用
