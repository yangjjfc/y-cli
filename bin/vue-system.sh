#!/usr/bin/env sh
set -e

winpty vue.cmd  create $name

project=$(dirname "$0")
echo 'project: '$project
node $project'/../vue-system/config/index' $name