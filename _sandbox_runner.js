(function() {
  var vm = require('vm');

  // This module runs as a child of the main process and recieves 
  // instructions through the message event.
  process.on("message", function(data) {
     if (data.runCode) {
        runUntrustedCode(data.runCode);
     }
  });

  function runUntrustedCode(codeStr) {
    // Parse the supplied code
    var loaded_module;
    
    try {
       loaded_module = vm.createScript(codeStr);
    } catch (ex) {
       process.send({
          err: '_parsing',
          msg: ex.toString()
       });

       process.exit(1);
    }

    try {
       loaded_module.runInNewContext({
          console:    console,
          setTimeout: setTimeout
       });
    } catch (ex) {
       process.send({
          err: '_running',
          msg: ex.toString()
       });

       process.exit(1);
    }

    process.exit(0);
  };

}).call(this);

