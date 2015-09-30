var csp = require("js-csp");
var mocha = require("mocha");

var go = csp.go;
var put = csp.put;
var take = csp.take;

function wrapGenFn(f) {
  return function(done) {
    var ch = go(f);

    go(function*() {
      try {
        yield take(ch);
        done();
      } catch (e) {
        done(e);
      }
    });
  };
}

function it(name, f) {
  if (f.constructor.name === "GeneratorFunction") {
    return mocha.it(name, wrapGenFn(f));
  } else {
    return mocha.it(name, f);
  }
}

module.exports = {it: it};
