function Runtime() {
  this.namespaces = {default: {}};
  this.currentNamespace = this.namespaces.default;
}

Runtime.prototype.define = function(sym, value) {
  this.currentNamespace[sym] = value;
}

Runtime.prototype.resolve = function(sym) {
  return this.currentNamespace[sym];
}

Runtime.prototype.setNamespace = function(name) {
  if (this.namespaces[name] === undefined) {
    this.namespaces[name] = {};
  }

  this.currentNamespace = this.namespaces[name];
}

module.exports = new Runtime();
