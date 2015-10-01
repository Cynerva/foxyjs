var csp = require("js-csp");
var mori = require("mori");

var go = csp.go;
var put = csp.put;
var take = csp.take;

function tokenize(str) {
  return str.replace(/([\(\)])/g, " $1 ")
    .trim()
    .split(/\s+/);
}

function makeTokenChannel(input) {
  var ch = csp.chan();

  go(function*() {
    while (true) {
      var str = yield take(input);
      var tokens = tokenize(str);

      for (var i = 0; i < tokens.length; i++) {
        yield put(ch, tokens[i]);
      }
    }
  });

  return ch;
}

function readAtom(str) {
  return isNaN(str) ? str : +str;
}

function readExpression(tokenChannel) {
  return go(function*() {
    var token = yield take(tokenChannel);

    if (token === "(") {
      var list = mori.list();
      token = yield take(tokenChannel);

      while (token !== ")") {
        token = yield take(tokenChannel);
      }

      return list;
    }

    return readAtom(token);
  });
}

function read(input) {
  var ch = csp.chan();
  var tokenChannel = makeTokenChannel(input);

  go(function*() {
    while (true) {
      var expr = yield readExpression(tokenChannel);
      yield put(ch, expr);
    }
  });

  return ch;
}

module.exports = read;
