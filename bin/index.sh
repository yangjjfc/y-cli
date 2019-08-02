#!/usr/bin/env sh
set -e
echo -n "enter your project name:"
read name

# 执行版本选择
OBJECT=`node ../select-which-object/bin/select-which-object.js`

if test "$OBJECT" == "vue-system"; then 
    source ./vue-system.sh 
fi



