#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const minimist = require('minimist');

const cssbun = require('./');

const argv = minimist(process.argv);
const entryFile = argv._[2];

const result = cssbun(entryFile);

const outputFile = argv.o || argv.output;
const outputFilePath = outputFile && path.resolve(outputFile);

if (outputFilePath) {
  fs.writeFileSync(outputFilePath, result);
  console.log('Output successfully written to:', outputFilePath);
} else {
  console.log(result);
}
