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

  reader.onExpression(function(expr) {
    try {
      var result = eval(expr);
      console.log(result);
    } catch (e) {
      console.log(e);
    }

    rl.prompt();
  });

  rl.on("line", reader.read.bind(reader));

  rl.setPrompt(prefix);
  console.log("foxyjs");
  rl.prompt();
}

module.exports = repl;
