(function() {
  var vm = require('vm');

  process.on("message", function(data) {
    var loaded_module = vm.createScript(data.runCode);
    loaded_module.runInNewContext({
      console: console
    });
    process.exit();
  });
}).call(this);
