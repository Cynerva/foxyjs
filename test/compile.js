var assert = require("assert");
var mori = require("mori");

var list = mori.list;

var compile = require("../src/compile");

describe("compile", function() {
  it("compiles symbols", function() {
    var ast = "sym";
    var expected = "sym";
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
    var expected = "(function() { return a; })";
    assert(compile(ast) === expected);
  });

  it("compiles fn with two args", function() {
    var ast = list("fn", list("a", "b"), list("+", "a", "b"));
    var expected = "(function(a, b) { return (a + b); })";
    assert(compile(ast) === expected);
  });
});
