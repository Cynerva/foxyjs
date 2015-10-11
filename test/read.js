var assert = require("better-assert");
var mocha = require("mocha");
var mori = require("mori");
var helper = require("./helper");
var makeChannel = require("../src/channel");

var describe = mocha.describe;
var beforeEach = mocha.beforeEach;
var it = helper.it;
var isList = mori.isList;
var isVector = mori.isVector;
var list = mori.list;
var equals = mori.equals;
var vector = mori.vector;

var readChannel = require("../src/read").readChannel;

describe("readChannel", function() {
  var input;
  var output;

  beforeEach(function() {
    input = makeChannel();
    output = readChannel(input);
  });

  it("reads a symbol as a string", function*() {
    yield input.put("abc");
    var result = yield output.take();
    assert(result === "abc");
  });

  it("can process multiple strings", function*() {
    yield input.put("abc");
    yield output.take();
    yield input.put("def");
    yield output.take();
  });

  it("reads a number as a number", function*() {
    yield input.put("123");
    var result = yield output.take();
    assert(result === 123);
  });

  it("reads an empty list", function*() {
    yield input.put("()");
    var result = yield output.take();
    assert(isList(result));
    assert(equals(result, list()));
  });

  it("reads a list of two symbols", function*() {
    yield input.put("(a b)");
    var result = yield output.take();
    assert(isList(result));
    assert(equals(result, list("a", "b")));
  });

  it("reads quotes", function*() {
    yield input.put("'a");
    var result = yield output.take();
    assert(equals(result, list("quote", "a")));
  });

  it("reads backquotes", function*() {
    yield input.put("`a");
    var result = yield output.take();
    assert(equals(result, list("backquote", "a")));
  });

  it("reads unquotes", function*() {
    yield input.put("~a");
    var result = yield output.take();
    assert(equals(result, list("unquote", "a")));
  });

  it("consumes closing parens properly", function*() {
    yield input.put("() a");
    output.take();
    var result = yield output.take();
    assert(result === "a");
  });

  it("reads an empty vector", function*() {
    yield input.put("[]");
    var result = yield output.take();
    assert(isVector(result));
    assert(equals(result, vector()));
  });

  it("reads a vector with two symbols", function*() {
    yield input.put("[a b]");
    var result = yield output.take();
    assert(isVector(result));
    assert(equals(result, vector("a", "b")));
  });
});
