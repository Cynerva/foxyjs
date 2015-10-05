var compile = require("./compile");

// modules used by foxy at eval time
var mori = require("mori");
var _foxy_env = {};

function foxyEval(ast) {
  return eval(compile(ast));
}

module.exports = foxyEval;
