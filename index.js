import path from 'node:path';
import fs from 'node:fs';
import resolve from 'resolve';

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

  const matches = content.matchAll(/^@import\s+"(.*)";(\r?\n?)$/mg);

  for (const match of matches) {
    const relativeSubDirectory = path.resolve(relativeDirectory, path.dirname(filePath));

    const subFile = grabFile(match[1], relativeSubDirectory, '', alreadyIncluded);

    content = content.replace(match[0], subFile);
  }

  return bundled + content;
}

export default entryFile => {
  const fileName = './' + path.basename(entryFile);
  return grabFile(fileName, path.dirname(entryFile), '', []);
};
