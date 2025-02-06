const { exec } = require('node:child_process');
const { version } = require('../package.json');

exec(
    `git tag v${version} && git push origin v${version}`,
    (err) => err && console.log(err),
);
