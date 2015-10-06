var assert = require("assert");
var mori = require("mori");

var list = mori.list;

var eval = require("../src/eval");

describe("eval", function() {
  it("evaluates arithmetic", function() {
    var ast = list("+", 1, list("*", 2, 3));
    var expected = 7;
    assert(eval(ast) === expected);
  });

  it("evaluates code that returns a list", function() {
    var ast = list("quote", list());
    var result = eval(ast);
    assert(mori.equals(result, list()));
  });

  it("can def then dereference a symbol", function() {
    eval(list("def", "a", 1));
    var result = eval("a");
    assert(result === 1);
  });

  it("can def symbols in different namespaces", function() {
    eval(list("ns", "foo"));
    eval(list("def", "a", 1));
    eval(list("ns", "bar"));
    eval(list("def", "a", 2));
    assert(eval("a") === 2);
    eval(list("ns", "foo"));
    assert(eval("a") === 1);
  });

  it("can defmacro then use that macro", function() {
    eval(list("defmacro", "foo", list(), 1));
    var result = eval(list("foo"));
    assert(result === 1);
  });

  it("can eval a macro with two args", function() {
    var args = list("a", "b");
    var body = list("+", "a", "b");
    eval(list("defmacro", "foo", args, body));
    var result = eval(list("foo", 1, 2));
    assert(result === 3);
  });

  it("can eval a macro with backquote", function() {
    eval(list("defmacro", "foo", list(), list("backquote", list("+", 1, 2))));
    var result = eval(list("foo"));
    assert(result === 3);
  });
});
