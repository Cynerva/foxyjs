// Parser

function stringToTokens(string) {
  return string.replace(/([\(\)\[\]\{\}])/g, " $1 ")
               .trim()
               .split(/\s+/);
}

function tokensToTree(tokens) {
  var token = tokens.shift();

  if (token === '(') {
    var elements = [];

    while (tokens[0] !== ')') {
      elements.push(tokensToTree(tokens));
    }

    tokens.shift();
    return {type: "list",
            elements: elements};
  }

  // TODO: remove repetition
  if (token === '[') {
    var elements = [];

    while (tokens[0] !== ']') {
      elements.push(tokensToTree(tokens));
    }

    tokens.shift();
    return {type: "array",
            elements: elements};
  }

  return {type: "symbol",
          value: token};
}

function read(string) {
  return tokensToTree(stringToTokens(string));
}

// Compiler

var specialForms = {
  'if': function(args) {
    return "(" + treeToJs(args[0]) + " ? " + treeToJs(args[1]) + " : " + treeToJs(args[2]) + ")";
  },
  'fn': function(args) {
    return 'function(' + args[0].elements.map(treeToJs).join(', ') + ') { return ' + treeToJs(args[1]) + '; }';
  }
};

var simpleOperators = {
  '+': '+',
  '-': '-',
  '*': '*',
  '/': '/',
  '=': '===',
  'and': '&&',
  'or': '||'
};

for (var sym in simpleOperators) {
  (function(sym) {
    specialForms[sym] = function(args) {
      return '(' + args.map(treeToJs).join(' ' + simpleOperators[sym] + ' ') + ')';
    }
  })(sym);
}

function treeToJs(tree) {
  if (tree.type === 'list') {
    var first = tree.elements[0]
    var rest = tree.elements.slice(1);

    if (first.type === 'symbol' && specialForms.hasOwnProperty(first.value)) {
      return specialForms[first.value](rest);
    } else {
      return treeToJs(first) + '(' + rest.map(treeToJs).join(', ') + ')';
    }
  }

  if (tree.type === 'array') {
    return '[' + tree.elements.map(treeToJs).join(', ') + ']';
  }

  if (tree.type === 'symbol') {
    return tree.value;
  }
}

var test = "(fn [a b] (+ a b))"
console.log(treeToJs(read(test)));
