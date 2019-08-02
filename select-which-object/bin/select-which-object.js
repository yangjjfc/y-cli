#!/usr/bin/env node
const program = require('commander')
const selectWhich = require('./selectWhich')

program.on('--help', () => {
  console.log('Select relase version using cli')
})

if (!process.argv.slice(2).length) {
  selectWhich().then((version) => {
    process.stdout.write(version)
  }).catch((err) => {
    console.error(err)
    process.exit(1)
  })
}

program.parse(process.argv)//解析命令行参数,参数定义完成后才能调用
