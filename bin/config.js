const fs = require('fs')
const path = require('path')
const copy = require('copy.js')

let name = process.argv[2];
if (!dir) {
    console.error('[组件名]必填 - Please enter new component name');
    process.exit(1);
}

const dirPro = path.resolve(process.cwd(), name)
const dirTpm = path.resolve(__dirname, '../vue-system-tpm')
copy(dirTpm+'src',dirPro+'src')
