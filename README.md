[![Build Status](https://secure.travis-ci.org/my8bird/nodejs-sandbox.png?branch=master)](http://travis-ci.org/my8bird/nodejs-sandbox)


Install
-------
    git clone git@github.com:my8bird/nodejs-sandbox.git
    cd nodejs-sandbox
    npm link

Usage
-----
    var sandboxer = require("nodejs-sandbox");
    var sandbox = new sandbox.Sandbox();
    sandbox.runSandboxed({code: 'console.log("fubar");'});

    // To detect phases
    sandbox.on('start',  function() {console.log('start'); });
    sandbox.on('finish', function() {console.log('finish'); });

@see _example.js for running code.
