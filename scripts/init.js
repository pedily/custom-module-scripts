const path = require('path');
const fs = require('fs');
const util = require('util');
const { execSync } = require('child_process');
const copyfiles = util.promisify(require('copyfiles'));

const templateFolder = path.join(__dirname, '../templates/javascript');
const projectFolder = process.cwd();

(async () => {
    console.log('copying boilerplate project files...');
    process.chdir(templateFolder);
    await copyfiles([`**/*`, projectFolder], {
        all: true,
        soft: true
    });
    process.chdir(projectFolder);
    console.log('project files were copied!');

    console.log('installing dependencies...');
    await execSync('npm install --save-dev @strafbier/custom-module-scripts');
    console.log('dependencies successfully installed!')


    console.log('done!');
    console.log('run "npm run build" to build your custom module.');
    console.log('you can deploy your custom module with "npm run deploy"')
})();