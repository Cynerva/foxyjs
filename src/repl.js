var co = require("co");
var mori = require("mori");
var readline = require("readline");
var Stream = require("./stream");
var read = require("./read");
var eval = require("./eval");

var prefix = "=> ";

function repl() {
  var lineStream = new Stream();
  var exprStream = read(lineStream);

  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true
  });

  rl.on("line", lineStream.put.bind(lineStream));

  co(function*() {
    while (true) {
      var expr = yield exprStream.take();
      // FIXME: shouldn't have to convert to JS here
      expr = mori.toJs(expr);
      console.log(eval(expr));
      rl.prompt();
    }
  });

  rl.setPrompt(prefix);
  console.log("foxyjs");
  rl.prompt();
}

module.exports = repl;
