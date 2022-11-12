const test = require('basictap');
const cssmin = require('../');

test('bundle single file', t => {
  t.plan(1);

  const result = cssmin('./test/scenarios/single/index.css');

  t.equal(result, [
    'body {',
    '  background-color: red;',
    '}'
  ].join('\n'));
});

test('bundle multiple file', t => {
  t.plan(1);

  const result = cssmin('./test/scenarios/multiple/index.css');

  t.equal(result, [
    '.subTest {',
    '  background-color: pink;',
    '}',
    '',
    '.test {',
    '  background-color: blue;',
    '}',
    '',
    'body {',
    '  background-color: red;',
    '}'
  ].join('\n'));
});

test('bundle file from sub directory', t => {
  t.plan(1);

  const result = cssmin('./test/scenarios/subdirectory/index.css');

  t.equal(result, [
    '.subTest {',
    '  background-color: pink;',
    '}',
    '',
    '.test {',
    '  background-color: blue;',
    '}',
    '',
    'body {',
    '  background-color: red;',
    '}'
  ].join('\n'));
});

test('bundle dependency in sub directory', t => {
  t.plan(1);

  const result = cssmin('./test/scenarios/dependencysub/index.css');

  t.equal(result, [
    'mui-text-input input:focus {',
    '  border-color: blue;',
    '  outline: none;',
    '}',
    'mui-text-input input {',
    '  display: block;',
    '  font-family: arial;',
    '  font-weight: bold;',
    '  font-size: 100%;',
    '  width: 100%;',
    '  border: 2px solid black;',
    '  padding: var(--input-padding);',
    '}',
    '',
    'body {',
    '  background-color: red;',
    '}'
  ].join('\n'));
});

test('bundle from dependency', t => {
  t.plan(1);

  const result = cssmin('./test/scenarios/dependency/index.css');

  t.equal(result, [
    'mui-text-input input:focus {',
    '  border-color: blue;',
    '  outline: none;',
    '}',
    'mui-text-input input {',
    '  display: block;',
    '  font-family: arial;',
    '  font-weight: bold;',
    '  font-size: 100%;',
    '  width: 100%;',
    '  border: 2px solid black;',
    '  padding: var(--input-padding);',
    '}',
    '',
    'body {',
    '  background-color: red;',
    '}'
  ].join('\n'));
});

test('bundle same file twice', t => {
  t.plan(1);

  const result = cssmin('./test/scenarios/sameFileTwice/index.css');

  t.equal(result, [
    '.test {',
    '  background-color: blue;',
    '}',
    '',
    'body {',
    '  background-color: red;',
    '}'
  ].join('\n'));
});
