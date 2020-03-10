const path = require('path');
const fs = require('fs');

const archiver = require('archiver');

const root = process.cwd();
const package = require(path.join(root, 'package.json'));

const createFiles = () => {
    const readmePath = path.join(process.cwd(), 'README.md');
    if (!fs.existsSync(readmePath))
        fs.writeFileSync(readmePath, 'About this module...');
}

const bundle = () => new Promise((resolve, reject) => {
    const output = fs.createWriteStream(`${package.name}.zip`);
    const archive = archiver('zip');

    output.on('close', () => {
        resolve();
    });

    archive.on('error', () => {
        console.log('error while creating package :/');
        reject();
    });

    archive.pipe(output);

    archive.file('package.json');
    archive.file('package-lock.json');
    archive.file('README.md');
    
    archive.file('icon.png');
    archive.file('icon-large.png');

    archive.directory(path.dirname(package.main));

    archive.finalize();
});

(async () => {
    createFiles();
    await bundle();
    console.log('Done!');
})();
