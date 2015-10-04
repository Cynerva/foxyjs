var co = require("co");
var readline = require("readline");
var makeChannel = require("./channel");
var makeReadChannel = require("./read").readChannel;
var eval = require("./eval");

function makeInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
}

function makeLineChannelFromInterface(interface) {
  var ch = makeChannel();
  interface.on("line", ch.put.bind(ch));
  return ch;
}

function startRepl() {
  var interface = makeInterface();
  var lineChannel = makeLineChannelFromInterface(interface);
  var readChannel = makeReadChannel(lineChannel);
  console.log("foxyjs");
  interface.setPrompt("=> ");
  interface.prompt();

  co(function*() {
    while (true) {
      var expr = yield readChannel.take();
      var result = eval(expr);
      console.log(result);
      interface.prompt();
    }
  });
}

module.exports = startRepl;
