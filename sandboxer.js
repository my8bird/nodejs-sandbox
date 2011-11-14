(function() {
  var cp     = require('child_process'),
      util   = require('util'),
      events = require('events'),
      fs     = require('fs');

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
   * file: Path to javascript file to run
   * url:  (XXX not impl) to javascript source to run
   *
   * timeout: The amount of time to allow the source to run without requesting additional time.
   *          This is to prevent the downloaded source from getting into infinite loops and such.
   */
  Sandbox.prototype.runSandboxed = function(/* object */ params) {
    if (params.file !== undefined) {
       fs.readFile(params.file, (function(err, buf) {
          if (err) { throw err; }
          return this._runCode(buf.toString(), params.timeout);
       }).bind(this));
    }
    else {
       return this._runCode(params.code, params.timeout);
    }
  }

  Sandbox.prototype._runCode = function(code, timeout) {
    var proc = cp.fork(__dirname + '/_sandbox_runner.js'),
        timer;

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

    // Detect when the child has finished
    proc.addListener('exit', (function(statusCode) {
       this.emit('finish', proc.timedOut || (statusCode > 0), proc.errors);
    }).bind(this));

    //  The setup is finsihed so pipe in the source code to start things off.
    this.emit('start');
    proc.send( {runCode: code });

    // set a timer to remind us to kill this proccess if it runs to long
    if (timeout) {
       timer = setTimeout(function() {
          proc.timedOut = true;
          proc.errors = proc.errors || [];
          proc.errors.push('Timeout exceeded.');

          proc.kill();
       }, timeout);
    }

    return proc;
  };


  exports.Sandbox = Sandbox
}).call(this);

