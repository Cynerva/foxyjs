var readline = require("readline");
var read = require("./read");
var eval = require("./eval");

var prefix = "=> ";

function repl() {
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true
  });

  rl.setPrompt(prefix);

  rl.on("line", function(line) {
    var tree = read(line);
    var result = eval(tree);
    console.log(result);
    rl.prompt();
  });

  console.log("foxyjs");
  rl.prompt();
}

module.exports = repl;
