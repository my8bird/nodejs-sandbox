sandboxer = require(__dirname + '/../sandboxer.js');



describe('Sandbox', function () {
   var box, end_status;
   
   // { TEST Helpers
   function waitForSub() {
      waitsFor(function() {
         return end_status.err !== undefined; 
      }, 
      'sub script did not finish', // error message if timeout exceeds
      200                          // milliseconds to wait
      );
   };

   function runCode(codeStr) {
      // run the code async
      runs(function() { box.runSandboxed(codeStr); });
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
   // END TEST Helpers

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
   it("valid code", function () {
      runCode('var a = 1;');
      assertRanWithError(false);
   });

   it("fails with invalid code", function () {
      // notice there is no open paren
      runCode('console.log"22");');
      assertRanWithError(true, "SyntaxError: Unexpected string");
   });

});

