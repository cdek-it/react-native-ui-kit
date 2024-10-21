#!/usr/bin/env node

const { exec } = require('child_process')

exec('rm -rf dist')
exec('npx yarn tsc -p tsconfig.json')
exec('mkdir -p dist/assets/fonts')
exec("cp -r assets/fonts dist/assets/fonts")
