#!/usr/bin/env sh
set -e
echo -n "enter your project name:"
read name
# 获取绝对路径
project=$(dirname "$0")
echo 'project: '$project

# 执行版本选择
OBJECT=`node $project/../select-which-object/bin/select-which-object.js`

# 识别不同的类型
if test "$OBJECT" == "vue-system"; then 
# 字符串拼接
    source $project'/vue-system.sh' 
fi



