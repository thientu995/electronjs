const params = process.argv.slice(2);
const cmdRun = params[0];
const createName = params[1];
const fileRequire = require('./' + cmdRun);

new fileRequire(createName);
