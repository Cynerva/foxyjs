var mori = require("mori");

var forms = {};

function join(collection, delimiter) {
  return mori.toJs(collection).join(delimiter);
}

function addInfixOp(sym, jsSym) {
  forms[sym] = function(args) {
    return "(" + join(mori.map(compile, args), " " + jsSym + " ") + ")";
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
    join(fnArgs, ", ") +
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
