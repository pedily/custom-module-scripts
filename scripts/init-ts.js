const path = require('path');
const fs = require('fs');
const util = require('util');
const { execSync } = require('child_process');
const copyfiles = util.promisify(require('copyfiles'));

const templateFolder = path.join(__dirname, '../templates/typescript');
const projectFolder = process.cwd();
const packageFile = path.join(projectFolder, 'package.json');
const projectName = path.basename(projectFolder);

(async () => {
    console.log('copying boilerplate project files...');
    process.chdir(templateFolder);
    await copyfiles([`**/*`, projectFolder], {
        all: true,
        soft: true
    });
    process.chdir(projectFolder);
    console.log('project files were copied!');

    console.log('applying project name...');
    const package = require(packageFile);
    package.name = projectName;
    fs.writeFileSync(packageFile, JSON.stringify(package, null, 2));
    console.log('project name applied!')

    console.log('installing dependencies...');
    await execSync('npm i');
    await execSync('npm install --save-dev @toasta/custom-module-scripts');
    console.log('dependencies successfully installed!')


    console.log('done!');
    console.log('run "npm run build" to build your custom module.');
    console.log('you can deploy your custom module with "npm run deploy"')
})();