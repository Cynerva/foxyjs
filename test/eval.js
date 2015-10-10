var assert = require("better-assert");
var co = require("co");
var mocha = require("mocha");
var mori = require("mori");
var helper = require("./helper");
var readString = require("../src/read").readString;

var describe = mocha.describe;
var equals = mori.equals;
var it = helper.it;
var list = mori.list;

var eval = require("../src/eval");

describe("eval", function() {
  function evalStr(str) {
    return co(function*() {
      var ast = yield readString(str);
      return eval(ast);
    });
  }

  it("evaluates arithmetic", function*() {
    var result = yield evalStr("(+ 1 (* 2 3))");
    assert(result === 7);
  });

  it("evaluates code that returns a list", function*() {
    var result = yield evalStr("'()");
    assert(equals(result, list()));
  });

  it("can def then dereference a symbol", function*() {
    yield evalStr("(def a 1)");
    var result = yield evalStr("a");
    assert(result === 1);
  });

  it("can defmacro then use that macro", function*() {
    yield evalStr("(defmacro foo () 1)");
    var result = yield evalStr("(foo)");
    assert(result === 1);
  });

  it("can eval a macro with two args", function*() {
    yield evalStr("(defmacro foo (a b) (+ a b))");
    var result = yield evalStr("(foo 1 2)");
    assert(result === 3);
  });

  it("can eval a macro with backquote", function*() {
    yield evalStr("(defmacro foo () `(+ 1 2))");
    var result = yield evalStr("(foo)");
    assert(result === 3);
  });

  it("can eval a macro that refers to another symbol", function*() {
    yield evalStr("(def a 5)");
    yield evalStr("(defmacro foo () a)");
    var result = yield evalStr("(foo)");
    assert(result === 5);
  });
});
