var mori = require("mori");

var forms = {};

function addInfixOp(sym, jsSym) {
  forms[sym] = function(args) {
    return "(" + mori.toJs(args).join(" " + jsSym + " ") + ")";
  }
}

addInfixOp("+", "+");
addInfixOp("-", "-");
addInfixOp("*", "*");
addInfixOp("/", "/");

function compileAtom(ast) {
  return ast.toString();
}

function compileList(ast) {
  ast = mori.map(compile, ast);
  var sym = mori.first(ast);
  var args = mori.rest(ast);
  return forms[sym](args);
}

function compile(ast) {
  if (mori.isList(ast)) {
    return compileList(ast);
  } else {
    return compileAtom(ast);
  }
}

module.exports = compile;
