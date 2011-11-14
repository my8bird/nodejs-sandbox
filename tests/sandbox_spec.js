sandboxer = require(__dirname + '/../sandboxer.js');


describe('Sandbox', function () {
   var box, end_status, proc;
   
   // { Helpers
   function waitForSub() {
      waitsFor(function() {
         return end_status.err !== undefined; 
      }, 
      'sub script did not finish', // error message if timeout exceeds
      100                          // milliseconds to wait
      );
   };

   function runCode(codeStr, timeout) {
      // run the code async
      runs(function() { proc = box.runSandboxed(codeStr, timeout); });
      // wait for it to finish
      waitForSub();
   };

   function assertRanWithError(withError, msg) {
      runs(function() {
         expect(end_status.start).toEqual(true);
         expect(end_status.err).toEqual(withError);
         if (withError) {
            expect(end_status.msgs[0]).toEqual(msg);
         }
      });
   };
   // END Helpers

   beforeEach(function() {
      box = new sandboxer.Sandbox();
      end_status = {};

      box.on('finish', function(err, msgs) {
         end_status.err  = err;
         end_status.msgs = msgs;
      });

      box.on('start', function() {
         end_status.start = true;
      });
   });

   // TESTS
   it("works with valid code", function () {
      runCode('var a = 1;');
      assertRanWithError(false);
   });

   it("fails with invalid code", function () {
      // notice there is no open paren
      runCode('console.log"22");');
      assertRanWithError(true, "SyntaxError: Unexpected string");
   });

   it("fails if the timeout is passed", function() {
      // timeout set to happen after 0.1 seconds but the script will run for a full second.
      runCode("setTimeout(function(){var a = 1;}, 1000);", 10);
      assertRanWithError(true, "Timeout exceeded.");
   });

});

