var co = require("co");
var mori = require("mori");
var Stream = require("./stream");

function readList(tokenStream) {
  return co(function*() {
    var elements = mori.vector();
    token = yield tokenStream.peek();

    while (token !== ')') {
      var element = yield readExpression(tokenStream);
      elements = mori.conj(elements, element);
      token = yield tokenStream.peek();
    }

    tokenStream.take();
    return elements;
  });
}

function readExpression(tokenStream) {
  return co(function*() {
    var token = yield tokenStream.take();

    if (token === '(') {
      return yield readList(tokenStream);
    }

    if (!isNaN(token)) {
      return +token;
    }

    return token;
  });
}

function strToTokens(string) {
  return string.replace(/([\(\)'`~])/g, " $1 ")
               .trim()
               .split(/\s+/);
}

function strStreamToTokenStream(strStream) {
  var tokenStream = new Stream();

  co(function*() {
    while (true) {
      var str = yield strStream.take();
      strToTokens(str).forEach(function(token) {
        tokenStream.put(token);
      });
    }
  });

  return tokenStream;
}

function read(strStream) {
  var tokenStream = strStreamToTokenStream(strStream);
  var exprStream = new Stream();

  co(function*() {
    while (true) {
      exprStream.put(yield readExpression(tokenStream));
    }
  });

  return exprStream;
}

module.exports = read;
