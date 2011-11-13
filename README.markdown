Install
-------
    git clone git@github.com:my8bird/nodejs-sandbox.git 
    cd nodejs-sandbox
    npm link

Usage
-----
    var sandboxer = require("nodejs-sandbox");
    var sandbox = new sandbox.Sandbox();
    sandbox.runSandboxed('console.log("fubar");');

    // To detect phases
    sandbox.on('start',  function() {console.log('start'); });
    sandbox.on('finish', function() {console.log('finish'); });

