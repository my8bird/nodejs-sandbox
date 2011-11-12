(function() {
  var cp;

  cp = require('child_process');

  exports.runSandboxed = function(code) {
    var proc;
    proc = cp.fork(__dirname + '/_sandbox_runner.js');
    proc.on("message", function(m) {
      return console.log("mess " + m);
    });
    return proc.send({
      "runCode": code
    });
  };

}).call(this);
