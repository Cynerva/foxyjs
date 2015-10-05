var mori = require("mori");

var forms = {};

function compileAtom(scope, ast) {
  if (typeof ast === "string") {
    return scope[ast] === undefined ?
      '_foxy.resolve("' + ast + '")' :
      ast;
  } else {
    return ast.toString();
  }
}

function compileList(scope, ast) {
  var first = mori.first(ast);
  var args = mori.rest(ast);

  if (forms[first] !== undefined) {
    return forms[first](scope, args);
  } else {
    args = compileArgs(scope, args);
    return compile(scope, first) + "(" + join(args, ", ") + ")";
  }
}

function compile(scope, ast) {
  if (mori.isList(ast)) {
    return compileList(scope, ast);
  } else {
    return compileAtom(scope, ast);
  }
}

function compileArgs(scope, args) {
  return mori.map(function(ast) { return compile(scope, ast); }, args);
}

function compileRoot(ast) {
  return compile({}, ast);
}

function join(collection, delimiter) {
  return mori.toJs(collection).join(delimiter);
}

function addInfixOp(sym, jsSym) {
  forms[sym] = function(scope, args) {
    return "(" + join(compileArgs(scope, args), " " + jsSym + " ") + ")";
  }
}

addInfixOp("+", "+");
addInfixOp("-", "-");
addInfixOp("*", "*");
addInfixOp("/", "/");

forms.fn = function(scope, args) {
  var fnArgs = mori.first(args);
  var body = mori.second(args);
  var scope = Object.create(scope);

  mori.each(fnArgs, function(arg) {
    scope[arg] = true;
  });

  return (
    "(function(" +
    join(fnArgs, ", ") +
    ") { return " +
    compile(scope, body) +
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

forms.quote = function(scope, args) {
  var expr = mori.first(args);
  return quoteExpr(expr);
}

function backquoteExpr(scope, expr) {
  if (mori.isList(expr)) {
    if (mori.first(expr) === "unquote") {
      return compile(scope, mori.second(expr));
    } else {
      var childArgs = mori.map(backquoteExpr.bind(null, scope), expr);
      return "mori.list(" + join(childArgs, ", ") + ")";
    }
  } else {
    return quoteExpr(expr);
  }
}

forms.backquote = function(scope, args) {
  var expr = mori.first(args);
  return backquoteExpr(scope, expr);
}

forms.def = function(scope, args) {
  var sym = mori.first(args);
  var value = compile(scope, mori.second(args));
  return '_foxy.define("' + sym + '", ' + value + ');';
}

forms.ns = function(scope, args) {
  var name = mori.first(args);
  return '_foxy.setNamespace("' + name + '");';
}

module.exports = compileRoot;
