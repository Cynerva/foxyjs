var assert = require("assert");
var csp = require("js-csp");
var helper = require("./helper");
var mocha = require("mocha");

var describe = mocha.describe;
var beforeEach = mocha.beforeEach;
var it = helper.it;
var put = csp.put;
var take = csp.take;

var read = require("../src/read");

describe("read", function() {
  var input;
  var output;

  beforeEach(function() {
    input = csp.chan();
    output = read(input);
  });

  it("returns a symbol as a string", function*() {
    yield put(input, "abc");
    var result = yield take(output);
    assert(result === "abc");
  });
});
