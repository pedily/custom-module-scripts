const request = require('request-promise-native');
const path = require('path');
const fs = require('fs');

const package = require(path.join(process.cwd(), 'package.json'));
const archiveLocation = path.join(process.cwd(), `${package.name}.zip`);
const deployconfigLocation = path.join(process.cwd(), 'deploy.json');
const gitignoreLocation = path.join(process.cwd(), '.gitignore');

const force = true;

if (!fs.existsSync(deployconfigLocation)) {
    console.log('Please set up a remote connection in the deploy.json i just created for you :)');
    const deployConfigTemplate = require('../templates/deploy.json');
    fs.writeFileSync(deployconfigLocation, JSON.stringify(deployConfigTemplate, null, 2));
    fs.appendFileSync(gitignoreLocation, '\ndeploy.json');
    process.exit(1);
}

const { apiUrl, apiKey } = require(deployconfigLocation);
if (!apiUrl) {
    console.log('Please configure an apiUrl in your deploy.json');
    process.exit(0);
}
if (!apiKey) {
    console.log('Please configure an apiKey in your deploy.json');
    process.exit(1);
}

if (!fs.existsSync(archiveLocation)) {
    console.log('there is no custom module archive. forgot to build?');
    process.exit(1);
}

const getRemoteModules = async () => {
    const response = await request(`${apiUrl}/custommodules`, {
        headers: {
            'x-api-key': apiKey
        }
    });

    return JSON.parse(response);
}

const getRemoteModule = async (name) => {
    const modules = await getRemoteModules();
    return modules.find(module => module.name === name)
}

const deleteRemoteModule = async (id) => {
    const response = await request.delete(`${apiUrl}/custommodules/${id}`, {
        headers: {
            'x-api-key': apiKey
        }
    });
}

const upload = async () => {
    const response = await request.post(`${apiUrl}/custommodules/upload`, {
        formData: {
            package: fs.createReadStream(archiveLocation)
        },
        headers: {
            'x-api-key': apiKey
        }
    });
}

const deploy = async (package) => {
    console.log('fetching custom modules from remote...')
    const remoteModule = await getRemoteModule(package.name);
    console.log('got costum modules from remote!');

    if (!!remoteModule) {
        console.log('an older version of this custom module already exists on the remote!')
        if (!force) {
            console.log('aborting. use the "force" to force updating the module on the remote');
            process.exit(1);
        }
        console.log('deleting old custom module from remote...');
        await deleteRemoteModule(remoteModule._id);
        console.log('old custom module was deleted from remote!');
        await new Promise(r => setTimeout(r, 3 * 1000));
    }

    console.log('uploading new custom module...');
    await upload();
    console.log('new custom module was uploaded to remote!');
}

(async () => {
    await deploy(package);
})();