const path = require('path');
const fs = require('fs');

const alreadyIncluded = [];

function grabFile (fileName, bundled = '') {
  const filePath = path.resolve(fileName);
  if (alreadyIncluded.includes(filePath)) {
    return bundled;
  }
  alreadyIncluded.push(filePath);

  let content = fs.readFileSync(filePath, 'utf8');

  const matches = content.matchAll(/^\s*@import\s+"(.*)";\s*$/mg);

  for (const match of matches) {
    const subFile = grabFile(path.resolve(path.dirname(fileName), match[1]));

    content = content.replace(match[0], subFile);
  }

  return bundled + '\n' + content;
}

module.exports = entryFile => grabFile(entryFile).trim();
