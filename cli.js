#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const minimist = require('minimist');
const chokidar = require('chokidar');

const cssbun = require('./');

const argv = minimist(process.argv);
const entryFile = argv._[2];

const outputFile = argv.o || argv.output;
const outputFilePath = outputFile && path.resolve(outputFile);

function run () {
  const result = cssbun(entryFile);

  if (outputFilePath) {
    fs.writeFileSync(outputFilePath, result);
    console.log('Output successfully written to:', outputFilePath);
  } else {
    console.log(result);
  }
}

const watch = argv.w || argv.watch;

if (watch) {
  if (!outputFilePath) {
    console.log('You must specify an --output (-o) when using --watch (-w) mode');
    process.exit(1);
  }

  chokidar.watch(watch === true ? '**/*.css' : watch, {
    ignored: outputFile
  }).on('change', (path, event) => {
    console.log('detected change', path);
    run();
  });

  run();
} else {
  run();
}
