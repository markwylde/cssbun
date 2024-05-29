import path from 'node:path';
import fs from 'node:fs';
import resolve from 'resolve';

export default function (entryFile) {
  let fileName = './' + path.basename(entryFile);
  let referrer = path.resolve(entryFile);
  return grabFile(fileName, referrer, [], []);
}

function grabFile(fileName, referrer, alreadyIncluded, stack) {
  let filePath;
  let baseDir = path.dirname(referrer);
  if (fileName.startsWith('./') || fileName.startsWith('../')) {
    filePath = path.resolve(baseDir, fileName);
  } else {
    filePath = resolve.sync(fileName, {includeCoreModules: false, basedir: baseDir});
  }

  if (stack.includes(filePath)) {
    console.warn(`Ignore resursive import "${fileName}" found in file "${referrer}"`);
    return '';
  }
  if (alreadyIncluded.includes(filePath)) {
    console.warn(`Ignore duplicated import "${fileName}" found in file "${referrer}"`);
    return '';
  }
  stack.push(filePath);
  alreadyIncluded.push(filePath);

  let content = fs.readFileSync(filePath, {encoding: 'utf-8'});
  return content.replace(/^@import\s+"([^"]+)"(?:[^;]+)?;(\r?\n?)/mg, (match, href, eol) => {
    let rule;
    try {
      rule = parseImportRule(match.trim().replace(/\r?\n/g, ' '));
    } catch(e) {
      if (e.name === 'SyntaxError') {
        console.warn(`Skip unexpected import syntax ${match.trimEnd()} found in file "${referrer}"`);
      } else {
        console.error(e);
      }
      return match;
    }
    if (rule === null || /^(https?|data):/.test(href)) // unexpected @import syntax or @import url
      return match;
    let stackLevel = stack.length;
    let depContent = grabFile(href, filePath, alreadyIncluded, stack);
    if (stack.length > stackLevel) {
      stack.pop();
    }
    let {media, supportsText, layerName} = rule;
    if ((media || supportsText || layerName) && depContent) {
      return wrapWithAtRule(depContent, rule, eol || '\n');
    }
    return depContent;
  });
}

function wrapWithAtRule(cssText, cssImportRule, eol = '\n') {
  let content = '';
  let stack = [];

  let {media, supportsText, layerName} = cssImportRule;
  if (media) {
    content += `@media ${media} {`+eol;
    stack.push('}'+eol);
  }
  if (supportsText) {
    content += `@supports (${supportsText}) {` + eol;
    stack.push('}' + eol);
  }
  if (layerName) {
    content += `@layer ${layerName} {`+eol;
    stack.push('}'+eol);
  }

  content += cssText;

  while (stack.length > 0) {
    content += stack.pop();
  }
  return content;
}

function parseImportRule(str) {
  let href = '';
  let media = null;
  let supportsText = null;
  let layerName = null;

  let len = str.length;
  let cur = 0;
  let m = str.match(/@import "([^"]+)"/);
  if (m) {
    href = m[1];
    cur = m[0].length;
    for (let i = cur; i < len; i++) {
      if (str.charCodeAt(i) === 32) cur += 1;
      else break;
    }
  } else {
    return null;
  }

  if (str.startsWith('layer(', cur)) { // seek layerName
    str.slice(cur).replace(/^layer\(([\w-]+(?:\.[\w-]+)*)\)/, ($0, $1) => {
      layerName = $1;
      cur += $0.length;
      for (let i = cur; i < len; i++) {
        if (str.charCodeAt(i) === 32) cur += 1;
        else break;
      }
    });
  }

  if (str.startsWith('supports(', cur)) { // seek supportsText
    let end = seekParenthesesToEnd(str, cur);
    if (end !== -1) {
      supportsText = str.slice(cur + 9, end - 1);
      cur = end;
      for (let i = cur; i < len; i++) {
        if (str.charCodeAt(i) === 32) cur += 1;
        else break;
      }
    }
  }

  if (!str.startsWith(';')) { // seek media list
    let end = cur;
    for (let i = cur; i < len; i++) {
      if (str.charCodeAt(i) !== 59) end += 1;
    }
    if (end > cur) {
      media = str.slice(cur, end);
    }
  }

  return {href, media, supportsText, layerName};
}

let seekParenthesesToEnd = (s, offset) => {
  let stack = [];
  for (let i = offset, c; i < s.length; i++) {
    c = s.charAt(i);
    switch (c) {
      case '(':
        stack.push(c);
        break;
      case ')':
        if (stack.pop() !== '(')
          throw new SyntaxError('Unexpected token ")" at ' + i);
        if (stack.length === 0)
          return i + 1;
        break;
    }
  }
  return -1;
};
