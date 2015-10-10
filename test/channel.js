var assert = require("better-assert");
var co = require("co");
var helper = require("./helper");
var mocha = require("mocha");
var mori = require("mori");

var describe = mocha.describe;
var beforeEach = mocha.beforeEach;
var it = helper.it;

var makeChannel = require("../src/channel");

describe("channel", function() {
  var channel;

  beforeEach(function() {
    channel = makeChannel();
  });

  it("can put then take", function*() {
    channel.put("foo");
    var result = yield channel.take();
    assert(result === "foo");
  });

  it("can take then put", function*() {
    var takePromise = channel.take();
    channel.put("foo");
    var result = yield takePromise;
    assert(result === "foo");
  });

  it("can put then peek", function*() {
    channel.put("foo");
    var result = yield channel.peek();
    assert(result === "foo");
  });

  it("can peek then put", function*() {
    var peekPromise = channel.peek();
    channel.put("foo");
    var result = yield peekPromise;
    assert(result === "foo");
  });

  it("can take multiple values", function*() {
    channel.put("foo");
    channel.put("bar");
    var first = yield channel.take();
    var second = yield channel.take();
    assert(first === "foo");
    assert(second === "bar");
  });

  it("can peek multiple times", function*() {
    channel.put("foo");
    var first = yield channel.peek();
    var second = yield channel.peek();
    assert(first === "foo");
    assert(second === "foo");
  });
});
