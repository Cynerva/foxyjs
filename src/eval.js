var compile = require("./compile");

// modules used by foxy at eval time
var mori = require("mori");
var _foxy = require("./runtime");

function foxyEval(ast) {
  return eval(compile(ast));
}

module.exports = foxyEval;
