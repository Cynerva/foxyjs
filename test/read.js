var assert = require("assert");
var co = require("co");
var mocha = require("mocha");
var mori = require("mori");
var helper = require("./helper");
var makeChannel = require("../src/channel");

var describe = mocha.describe;
var beforeEach = mocha.beforeEach;
var it = helper.it;

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
    assert(mori.isList(result));
    assert(mori.isEmpty(result));
  });

  it("reads a list of two symbols", function*() {
    yield input.put("(a b)");
    var result = yield output.take();
    assert(mori.isList(result));
    assert(mori.first(result) === "a");
    assert(mori.second(result) === "b");
  });
});
