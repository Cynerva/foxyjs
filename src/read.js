var csp = require("js-csp");
var go = csp.go;
var put = csp.put;
var take = csp.take;

function readAtom(str) {
  return isNaN(str) ? str : +str;
}

function read(input) {
  var ch = csp.chan();

  go(function*() {
    while (true) {
      var str = yield take(input);
      var result = readAtom(str);
      yield put(ch, result);
    }
  });

  return ch;
}

module.exports = read;
