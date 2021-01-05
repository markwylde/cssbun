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
