var assert = require("assert");
var co = require("co");
var mocha = require("mocha");
var helper = require("./helper");
var readString = require("../src/read").readString;

var describe = mocha.describe;
var it = helper.it;

var compile = require("../src/compile");

describe("compile", function() {
  function itCompiles(str, expected) {
    it("compiles " + str, function*() {
      var ast = yield readString(str);
      var result = compile(ast);
      assert(result === expected);
    });
  }

  itCompiles("a", '_foxy.resolve("a")');
  itCompiles("123", "123");
  itCompiles("(+ 1 2 3)", "(1 + 2 + 3)");
  itCompiles("(- 1 2 3)", "(1 - 2 - 3)");
  itCompiles("(* 1 2 3)", "(1 * 2 * 3)");
  itCompiles("(/ 1 2 3)", "(1 / 2 / 3)");
  itCompiles("(+ 1 (- 2 3))", "(1 + (2 - 3))");
  itCompiles("(fn () a)", '(function() { return _foxy.resolve("a"); })');
  itCompiles("(fn (a b) (+ a b))", "(function(a, b) { return (a + b); })");
  itCompiles("((fn (a) a) 0)", "(function(a) { return a; })(0)");
  itCompiles("'a", '"a"');
  itCompiles("'()", "mori.list()");
  itCompiles("'(a (b c))", 'mori.list("a", mori.list("b", "c"))');
  itCompiles("(def a 1)", '_foxy.define("a", 1);');
  itCompiles("`a", '"a"');
  itCompiles("`()", "mori.list()");
  itCompiles("`(a ~a)", 'mori.list("a", _foxy.resolve("a"))');
  itCompiles("(= 1 2)", "(1 === 2)");
  itCompiles("(not= 1 2)", "(1 !== 2)");
  itCompiles("(< 1 2)", "(1 < 2)");
  itCompiles("(> 1 2)", "(1 > 2)");
  itCompiles("(<= 1 2)", "(1 <= 2)");
  itCompiles("(>= 1 2)", "(1 >= 2)");
  itCompiles("(not 1)", "(!1)");
  itCompiles("(and 1 2)", "(1 && 2)");
  itCompiles("(or 1 2)", "(1 || 2)");
});
