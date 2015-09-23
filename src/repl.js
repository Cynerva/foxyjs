var readline = require("readline");

var Reader = require("./reader");
var eval = require("./eval");

var prefix = "=> ";

function repl() {
  var reader = new Reader();

  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true
  });

  rl.on("line", function(line) {
    var readStatus = reader.read(line);

    readStatus.results.forEach(function(result) {
      try {
        console.log(eval(result));
      } catch (e) {
        console.log(e);
      }
    });

    if (readStatus.finished) {
      rl.prompt();
    }
  });

  rl.setPrompt(prefix);
  console.log("foxyjs");
  rl.prompt();
}

module.exports = repl;
