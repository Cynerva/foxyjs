var co = require("co");
var mocha = require("mocha");

function it(name, f) {
  if (f.constructor.name === "GeneratorFunction") {
    return mocha.it(name, function() { return co(f); });
  } else {
    return mocha.it(name, f);
  }
}

module.exports = {it: it};
