var csp = require("js-csp");
var go = csp.go;
var put = csp.put;
var take = csp.take;

function read(input) {
  var ch = csp.chan();

  go(function*() {
    while (true) {
      yield put(ch, yield take(input));
    }
  });

  return ch;
}

module.exports = read;
