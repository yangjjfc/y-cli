#!/usr/bin/env sh
set -e

winpty vue.cmd  create $name


node ../vue-system/config/index $name