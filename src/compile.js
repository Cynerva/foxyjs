var mori = require("mori");

var forms = {};

forms["+"] = function(args) {
  return "(" + mori.toJs(args).join(" + ") + ")";
}

forms["-"] = function(args) {
  return "(" + mori.toJs(args).join(" - ") + ")";
}

forms["*"] = function(args) {
  return "(" + mori.toJs(args).join(" * ") + ")";
}

forms["/"] = function(args) {
  return "(" + mori.toJs(args).join(" / ") + ")";
}

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
