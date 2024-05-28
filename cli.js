#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import minimist from 'minimist';
import chokidar from 'chokidar';
import cssbun from './index.js';

const argv = minimist(process.argv.slice(2));
const entryFile = argv._[0];

const outputFile = argv.o || argv.output;
const outputFilePath = outputFile && path.resolve(outputFile);

function run() {
  if (!entryFile) {
    console.log('You must provide an entryFile as the first argument')
    console.log('\n  cssbun -o bundled.css css/index.css')
    process.exit(1);
  }

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
  }).on('change', (path) => {
    console.log('detected change', path);
    run();
  });

  run();
} else {
  run();
}
