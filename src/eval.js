var compile = require("./compile");

// modules used by foxy at eval time
var mori = require("mori");

function foxyEval(ast) {
  return eval(compile(ast));
}

module.exports = foxyEval;
