var primitives = {};

var operators = [
  ["+", function(a, b) { return a + b; }],
  ["-", function(a, b) { return a - b; }],
  ["*", function(a, b) { return a * b; }],
  ["/", function(a, b) { return a / b; }]
];

operators.forEach(function(operator) {
  var sym = operator[0];
  var f = operator[1];

  primitives[sym] = function(args) {
    args = args.map(eval);
    var first = args[0];
    var rest = args.slice(1);
    return rest.reduce(f, first);
  }
});

function evalSym(sym) {
  return isNaN(sym) ? sym : +sym;
}

function evalList(list) {
  var first = list[0];
  var rest = list.slice(1);

  if (primitives.hasOwnProperty(first)) {
    return primitives[first](rest);
  }
}

function eval(tree) {
  return Array.isArray(tree) ? evalList(tree) : evalSym(tree);
}

module.exports = eval;
