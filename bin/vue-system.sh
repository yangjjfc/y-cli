#!/usr/bin/env sh
set -e

vue create "$name"

cd "$name"

'node ./config.js $name' 

