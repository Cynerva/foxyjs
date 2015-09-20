var readline = require("readline");
var read = require("./read");

var prefix = "=> ";

function repl() {
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });

  rl.on("line", function(line) {
    var tree = read(line);
    console.log(tree);
    process.stdout.write(prefix);
  });

  console.log("foxyjs");
  process.stdout.write(prefix);
}

module.exports = repl;
