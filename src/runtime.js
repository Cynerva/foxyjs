var mori = require("mori");

function Runtime() {
  this.env = {};
}

Runtime.prototype.define = function(sym, value) {
  this.env[sym] = value;
}

Runtime.prototype.resolve = function(sym) {
  return this.env[sym];
}

module.exports = new Runtime();
