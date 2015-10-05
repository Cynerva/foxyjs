var mori = require("mori");

var forms = {};

function compileAtom(ast) {
  return ast.toString();
}

function compileList(ast) {
  var first = mori.first(ast);
  var args = mori.rest(ast);

  if (forms[first] !== undefined) {
    return forms[first](args);
  } else {
    args = mori.map(compile, args);
    return compile(first) + "(" + join(args, ", ") + ")";
  }
}

function compile(ast) {
  if (mori.isList(ast)) {
    return compileList(ast);
  } else {
    return compileAtom(ast);
  }
}

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

function quoteExpr(expr) {
  if (typeof expr === "string") {
    return '"' + expr + '"';
  } else if (typeof expr === "number") {
    return expr;
  } else if (mori.isList(expr)) {
    var childArgs = mori.map(quoteExpr, expr);
    return "mori.list(" + join(childArgs, ", ") + ")";
  }
}

forms.quote = function(args) {
  var expr = mori.first(args);
  return quoteExpr(expr);
}

forms.def = function(args) {
  var sym = mori.first(args);
  var value = compile(mori.second(args));
  return "_foxy_env[\"" + sym + "\"] = " + value + ";";
}

module.exports = compile;
