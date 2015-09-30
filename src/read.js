var csp = require("js-csp");
var go = csp.go;
var take = csp.take;

function read(input) {
  return go(function*() {
    return yield take(input);
  });
}

module.exports = read;
