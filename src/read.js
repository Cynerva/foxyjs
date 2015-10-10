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

      yield tokenChannel.take();
      return mori.list.apply(null, elements);
    }

    if (token === "'") {
      return mori.list("quote", yield readExpression(tokenChannel));
    }

    if (token === "`") {
      return mori.list("backquote", yield readExpression(tokenChannel));
    }

    if (token === "~") {
      return mori.list("unquote", yield readExpression(tokenChannel));
    }

    return readAtom(token);
  });
}

function tokenize(str) {
  return str.replace(/([\(\)'`~])/g, " $1 ")
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

function readString(str) {
  var input = makeChannel();
  var output = readChannel(input);
  input.put(str);
  return output.take();
}

module.exports = {readChannel: readChannel,
                  readString: readString};
