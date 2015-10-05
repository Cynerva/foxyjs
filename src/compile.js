var mori = require("mori");

var forms = {};

function addInfixOp(sym, jsSym) {
  forms[sym] = function(args) {
    return "(" + mori.toJs(mori.map(compile, args)).join(" " + jsSym + " ") + ")";
  }
}

addInfixOp("+", "+");
addInfixOp("-", "-");
addInfixOp("*", "*");
addInfixOp("/", "/");

forms.fn = function(args) {
  var fnArgs = mori.first(args);
  var body = mori.second(args);
  return (
    "(function(" +
    mori.toJs(fnArgs).join(", ") +
    ") { return " +
    compile(body) +
    "; })"
  );
}

function compileAtom(ast) {
  return ast.toString();
}

function compileList(ast) {
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
