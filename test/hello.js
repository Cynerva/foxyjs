var assert = require("assert");

describe("hello world test", function() {
  it("should succeed", function() {
    assert(2 === 2);
  });

  it("should fail", function() {
    assert(3 === 4);
  });
});
