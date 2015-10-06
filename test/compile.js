var assert = require("assert");
var mori = require("mori");

var list = mori.list;

var compile = require("../src/compile");

describe("compile", function() {
  it("compiles top-level symbols", function() {
    var ast = "sym";
    var expected = '_foxy.resolve("sym")';
    assert(compile(ast) === expected);
  });

  it("compiles numbers", function() {
    var ast = 123;
    var expected = "123";
    assert(compile(ast) === expected);
  });

  it("compiles +", function() {
    var ast = list("+", 1, 2, 3);
    var expected = "(1 + 2 + 3)";
    assert(compile(ast) === expected);
  });

  it("compiles -", function() {
    var ast = list("-", 1, 2, 3);
    var expected = "(1 - 2 - 3)";
    assert(compile(ast) === expected);
  });

  it("compiles *", function() {
    var ast = list("*", 1, 2, 3);
    var expected = "(1 * 2 * 3)";
    assert(compile(ast) === expected);
  });

  it("compiles /", function() {
    var ast = list("/", 1, 2, 3);
    var expected = "(1 / 2 / 3)";
    assert(compile(ast) === expected);
  });

  it("compiles nested arithmetic", function() {
    var ast = list("+", 1, list("-", 2, 3));
    var expected = "(1 + (2 - 3))";
    assert(compile(ast) === expected);
  });

  it("compiles fn with no args", function() {
    var ast = list("fn", list(), "a");
    var expected = '(function() { return _foxy.resolve("a"); })';
    assert(compile(ast) === expected);
  });

  it("compiles fn with two args", function() {
    var ast = list("fn", list("a", "b"), list("+", "a", "b"));
    var expected = "(function(a, b) { return (a + b); })";
    assert(compile(ast) === expected);
  });

  it("compiles anonymous fn calls", function() {
    var ast = list(list("fn", list("a"), "a"), 0);
    var expected = "(function(a) { return a; })(0)";
    assert(compile(ast) === expected);
  });

  it("compiles quote of a symbol", function() {
    var ast = list("quote", "a");
    var expected = "\"a\"";
    assert(compile(ast) === expected);
  });

  it("compiles quote of empty list", function() {
    var ast = list("quote", list());
    var expected = "mori.list()";
    assert(compile(ast) === expected);
  });

  it("compiles quote of nested lists", function() {
    var ast = list("quote", list("a", list("b", "c")));
    var expected = 'mori.list("a", mori.list("b", "c"))';
    assert(compile(ast) === expected);
  });

  it("compiles def", function() {
    var ast = list("def", "a", 1);
    var expected = '_foxy.define("a", 1);';
    assert(compile(ast) === expected);
  });

  it("compiles ns", function() {
    var ast = list("ns", "foo");
    var expected = '_foxy.setNamespace("foo");';
    assert(compile(ast) === expected);
  });

  it("compiles backquote of a symbol", function() {
    var ast = list("backquote", "a");
    var expected = '"a"';
    assert(compile(ast) === expected);
  });

  it("compiles backquote of empty list", function() {
    var ast = list("backquote", list());
    var expected = "mori.list()";
    assert(compile(ast) === expected);
  });

  it("compiles backquote with nested unquote", function() {
    var ast = list("backquote", list("a", list("unquote", "a")));
    var expected = 'mori.list("a", _foxy.resolve("a"))';
    assert(compile(ast) === expected);
  });

  it("compiles defmacro with no args", function() {
    var ast = list("defmacro", "foo", list(), 1);
    var expected = '_foxy.defineMacro("foo", (function() { return 1; }));';
    assert(compile(ast) === expected);
  });

  it("compiles defmacro with two args", function() {
    var args = list("a", "b");
    var body = list("+", "a", "b");
    var ast = list("defmacro", "foo", args, body);
    var expected = '_foxy.defineMacro("foo", (function(a, b) { return (a + b); }));';
    assert(compile(ast) === expected);
  });
});
