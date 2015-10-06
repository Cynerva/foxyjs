var mori = require("mori");

function Namespace() {
  this.env = {};
  this.macros = {};
}

function Runtime() {
  this.namespaces = {};
  this.setNamespace("default");
}

Runtime.prototype.define = function(sym, value) {
  this.currentNamespace.env[sym] = value;
}

Runtime.prototype.resolve = function(sym) {
  return this.currentNamespace.env[sym];
}

Runtime.prototype.setNamespace = function(name) {
  if (this.namespaces[name] === undefined) {
    this.namespaces[name] = new Namespace();
  }

  this.currentNamespace = this.namespaces[name];
}

Runtime.prototype.defineMacro = function(sym, f) {
  this.currentNamespace.macros[sym] = f;
}

Runtime.prototype.resolveMacro = function(sym) {
  return this.currentNamespace.macros[sym];
}

module.exports = new Runtime();
