sandboxer = require(__dirname + '/../sandboxer.js');



describe('Sandbox', function () {
   var box, end_status;
   
   function waitForSub() {
      waitsFor(function() {
         return end_status.err !== undefined; 
      }, 
      'sub script did not finish', // error message if timeout exceeds
      200 // milliseconds to wait
      );
   };

   function runCode(codeStr) {
      // run the code async
      runs(function() { box.runSandboxed(codeStr); });
      // wait for it to finish
      waitForSub();
   };

   beforeEach(function() {
      box = new sandboxer.Sandbox();
      end_status = {};

      box.on('finish', function(err) {
         end_status.err = err
      });
   });

   it("valid code", function () {
      runCode('var a = 1;');

      runs(function() {
         expect(end_status).toEqual({err: false});
      });

   });

   it("fails with invalid code", function () {
      // notice there is no open paren
      runCode('console.log"22");');
      runs(function() {
         expect(end_status).toEqual({err: true});
      });
   });

});

