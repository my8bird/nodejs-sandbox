(function() {
  var cp = require('child_process');

  /*
   * runSandboxed(code, timeout)
   *
   * Runs the provided string in the safest manner possible.  A new process 
   * and virtual machine are constructed to run the code and all input and 
   * output is handled through trusted handlers.
   *
   * XXX setup trusted handlers.
   *
   * code: string of javascript code
   *       or
   *       file path (XXX not impl) to javascript
   *       or 
   *       url (XXX not impl) to javascript source to run
   *
   * timeout: The amount of time to allow the source to run without requesting additional time.
   *          This is to prevent the downloaded source from getting into infinite loops and such.
   */
  exports.runSandboxed = function(code) {
    var proc = cp.fork(__dirname + '/_sandbox_runner.js');

    // Connect to be notified of messages
    // Messages will be sanitised prior to usage.
    proc.on("message", function(m) {
       // Look at the message and determine if anything can be done to satisfy it.
    });

    // XXX connect to be notified when the child finishes.

    // XXX Setup a timeout so that long running code can be killed.

    //  The setup is finsihed so pipe in the source code to start things off.
    return proc.send({
      "runCode": code
    });
  };

}).call(this);
