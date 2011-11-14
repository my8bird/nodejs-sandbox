// Load the sandboxer
var sandboxer = require('./sandboxer.js'),
    sandbox = new sandboxer.Sandbox();


sandbox.on('start', function() {
   console.log("Script Started");
});

sandbox.on('finish', function() {
   console.log("Script Ended");
});

// run some code in the sandboxer
sandbox.runSandboxed('console.log("adsfasdf");');

