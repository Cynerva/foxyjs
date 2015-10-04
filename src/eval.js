var compile = require("./compile");

function foxyEval(ast) {
  return eval(compile(ast));
}

module.exports = foxyEval;
