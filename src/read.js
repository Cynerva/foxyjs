var co = require("co");
var mori = require("mori");
var makeChannel = require("./channel");

function tokenize(str) {
  return str.replace(/([\(\)])/g, " $1 ")
    .trim()
    .split(/\s+/);
}

function makeTokenChannel(input) {
  var ch = makeChannel();

  co(function*() {
    while (true) {
      var str = yield input.take();
      var tokens = tokenize(str);

      for (var i = 0; i < tokens.length; i++) {
        yield ch.put(tokens[i]);
      }
    }
  });

  return ch;
}

function readAtom(str) {
  return isNaN(str) ? str : +str;
}

function readExpression(tokenChannel) {
  return co(function*() {
    var token = yield tokenChannel.take();

    if (token === "(") {
      var list = mori.list();
      token = yield tokenChannel.take();

      while (token !== ")") {
        token = yield tokenChannel.take();
      }

      return list;
    }

    return readAtom(token);
  });
}

function read(input) {
  var ch = makeChannel();
  var tokenChannel = makeTokenChannel(input);

  co(function*() {
    while (true) {
      var expr = yield readExpression(tokenChannel);
      yield ch.put(expr);
    }
  });

  return ch;
}

module.exports = read;
