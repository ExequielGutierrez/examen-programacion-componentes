#!/usr/bin/env node
const fs = require('fs')
const path = require('path')

const file = path.join('platforms', 'android', 'gradle.properties')
if (!fs.existsSync(file)) process.exit(0)

const text = fs.readFileSync(file, 'utf8')
if (!text.includes('android.overridePathCheck')) {
  fs.appendFileSync(file, '\nandroid.overridePathCheck=true\n')
}
