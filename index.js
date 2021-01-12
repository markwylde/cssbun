const path = require('path');
const fs = require('fs');

const resolve = require('resolve');

function grabFile (fileName, relativeDirectory, bundled, alreadyIncluded) {
  bundled = bundled || '';
  const filePath = resolve.sync(fileName, {
    includeCoreModules: false,
    basedir: path.resolve(relativeDirectory)
  });

  if (alreadyIncluded.includes(filePath)) {
    return bundled;
  }
  alreadyIncluded.push(filePath);

  let content = fs.readFileSync(filePath, 'utf8');

  const matches = content.matchAll(/^\s*@import\s+"(.*)";\s*$/mg);

  for (const match of matches) {
    const relativeSubDirectory = path.resolve(relativeDirectory, path.dirname(filePath));

    const absoluteSubPath = resolve.sync(match[1], {
      includeCoreModules: false,
      basedir: relativeSubDirectory
    });

    const subFile = grabFile(match[1], path.dirname(absoluteSubPath), '', alreadyIncluded);

    content = content.replace(match[0], subFile);
  }

  return bundled + '\n' + content;
}

module.exports = entryFile => {
  const fileName = './' + path.basename(entryFile);
  return grabFile(fileName, path.dirname(entryFile), '', []).trim();
};
