var env = {};

[
  ["+", function(a, b) { return a + b; }],
  ["-", function(a, b) { return a - b; }],
  ["*", function(a, b) { return a * b; }],
  ["/", function(a, b) { return a / b; }]
].forEach(function(op) {
  env[op[0]] = function(args) {
    return args.slice(1).reduce(op[1], args[0]);
  };
});

function evalSym(sym) {
  return isNaN(sym) ? sym : +sym;
}

function evalList(list) {
  var first = list[0];
  var rest = list.slice(1);

  return env[first](rest.map(eval));
}

function eval(tree) {
  return Array.isArray(tree) ? evalList(tree) : evalSym(tree);
}

module.exports = eval;
