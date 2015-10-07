var mori = require("mori");

function Runtime() {
  this.env = {};
  this.macros = {};
}

Runtime.prototype.define = function(sym, value) {
  this.env[sym] = value;
}

Runtime.prototype.resolve = function(sym) {
  return this.env[sym];
}

Runtime.prototype.defineMacro = function(sym, f) {
  this.macros[sym] = f;
}

Runtime.prototype.resolveMacro = function(sym) {
  return this.macros[sym];
}

module.exports = new Runtime();
