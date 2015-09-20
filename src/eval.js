var specialForms = {};

var rootEnv = {};

function evalSym(env, sym) {
  return isNaN(sym) ? env[sym] : +sym;
}

function evalSpecialForm(env, list) {
  return specialForms[list[0]](env, list.slice(1));
}

function evalList(env, list) {
  if (specialForms[list[0]] !== undefined) {
    return evalSpecialForm(env, list);
  }

  list = list.map(function(tree) { return eval(env, tree); });
  var first = list[0];
  var rest = list.slice(1);
  return first.apply(this, rest);
}

function eval(env, tree) {
  return Array.isArray(tree) ? evalList(env, tree) : evalSym(env, tree);
}

function evalRoot(tree) {
  return eval(rootEnv, tree);
}

specialForms.quote = function(env, args) {
  return args[0];
};

specialForms.def = function(env, args) {
  var name = args[0];
  var value = eval(env, args[1]);
  rootEnv[name] = value;
};

specialForms.fn = function(parentEnv, formArgs) {
  return function() {
    var argsPassedIn = [].slice.call(arguments);
    var env = Object.create(parentEnv);

    formArgs[0].forEach(function(sym, i) {
      env[sym] = argsPassedIn[i];
    });

    return eval(env, formArgs[1]);
  };
};

specialForms.eval = function(env, args) {
  return eval(env, eval(env, args[0]));
};

specialForms.if = function(env, args) {
  return eval(env, args[0]) ? eval(env, args[1]) : eval(env, args[2]);
};

rootEnv.true = true;
rootEnv.false = false;
rootEnv.nil = null;

// Math operators
[
  ["+", function(a, b) { return a + b; }],
  ["-", function(a, b) { return a - b; }],
  ["*", function(a, b) { return a * b; }],
  ["/", function(a, b) { return a / b; }]
].forEach(function(op) {
  rootEnv[op[0]] = function() {
    var args = [].slice.call(arguments);
    return args.slice(1).reduce(op[1], args[0]);
  };
});

// Logic operators
rootEnv["="] = function(a, b) { return a === b; };
rootEnv["not="] = function(a, b) { return a !== b; };
rootEnv["not"] = function(a) { return !a; };
rootEnv["and"] = function(a, b) { return a && b; };
rootEnv["or"] = function(a, b) { return a || b; };

module.exports = evalRoot;
