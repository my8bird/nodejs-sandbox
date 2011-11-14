(function() {
  var cp     = require('child_process'),
      util   = require('util'),
      events = require("events");

  /* Sandbox
   *
   * A container that we will be able to run untrusted code in.
   *
   * Events:
   * start:  Meta event for detecting when the untrusted code starts running
   *         ()
   * finish: Meta event for when the untrusted code finishes running.
   *         (err, [errors])
   */
  var Sandbox = function(){
     events.EventEmitter.call(this);
  }
  util.inherits(Sandbox, events.EventEmitter);

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
   *          XXX (not impl)
   */
  Sandbox.prototype.runSandboxed = function(code) {
    var proc = cp.fork(__dirname + '/_sandbox_runner.js');

    // Connect to be notified of messages
    // Messages will be sanitised prior to usage.
    proc.on("message", function(m) {
       // Look at the message and determine if anything can be done to satisfy it.
       if (m.err) {
          if (m.err['0'] === '_') {
             proc.errors = proc.errors || [];
             proc.errors.push(m.msg);
          }
       }
    });

    // XXX Setup a timeout so that long running code can be killed.

    // Detect when the child has finished
    proc.addListener('exit', (function(statusCode) {
       this.emit('finish', statusCode === 1, proc.errors);
    }).bind(this));

    //  The setup is finsihed so pipe in the source code to start things off.
    this.emit('start');
    return proc.send({
      "runCode": code
    });
  };


  exports.Sandbox = Sandbox
}).call(this);

