var co = require("co");
var mori = require("mori");
var makeChannel = require("./channel");

function readAtom(str) {
  return isNaN(str) ? str : +str;
}

function readExpression(tokenChannel) {
  return co(function*() {
    var token = yield tokenChannel.take();

    if (token === "(") {
      var elements = [];
      token = yield tokenChannel.peek();

      while (token !== ")") {
        var expr = yield readExpression(tokenChannel);
        elements.push(expr);
        token = yield tokenChannel.peek();
      }

      return mori.list.apply(null, elements);
    }

    return readAtom(token);
  });
}

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

function readChannel(input) {
  var tokenCh = makeTokenChannel(input);
  var resultCh = makeChannel();

  co(function*() {
    while (true) {
      var expr = yield readExpression(tokenCh);
      yield resultCh.put(expr);
    }
  });

  return resultCh;
}

module.exports = {readChannel: readChannel};
