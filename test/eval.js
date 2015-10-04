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
});
