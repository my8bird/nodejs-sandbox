Install
-------
git clone git@github.com:my8bird/nodejs-sandbox.git 
cd nodejs-sandbox
npm link

Usage
-----
var sandbox = require("nodejs-sandbox");
sandbox.runSandboxed('console.log("fubar");');

