function wrapGen(f) {
  return function() {
    var gen = f();
    gen.next();
    return gen;
  };
}

function strToTokens(string) {
  return string.replace(/([\(\)'`~])/g, " $1 ")
               .trim()
               .split(/\s+/);
}

var makeExprGen = wrapGen(function*() {
  var token = yield;

  if (token === '(') {
    token = yield;
    var elements = [];

    while (token !== ')') {
      var nestedGen = makeExprGen();
      var result = nestedGen.next(token);

      while (!result.done) {
        token = yield;
        result = nestedGen.next(token);
      }

      elements.push(result.value);
      token = yield;
    }

    return elements;
  }

  if (token === "'") {
    token = yield;
    var nestedGen = makeExprGen();
    var result = nestedGen.next(token);

    while (!result.done) {
      token = yield;
      result = nestedGen.next(token);
    }

    return ["quote", result.value];
  }

  if (token === "`") {
    token = yield;
    var nestedGen = makeExprGen();
    var result = nestedGen.next(token);

    while (!result.done) {
      token = yield;
      result = nestedGen.next(token);
    }

    return ["quasiquote", result.value];
  }

  if (token === "~") {
    token = yield;
    var nestedGen = makeExprGen();
    var result = nestedGen.next(token);

    while (!result.done) {
      token = yield;
      result = nestedGen.next(token);
    }

    return ["unquote", result.value];
  }

  return token;
});

function Reader() {
  this.exprGen = makeExprGen();
}

Reader.prototype.read = function(str) {
  var tokens = strToTokens(str);
  var results = [];
  var finished = true;

  for (var i = 0; i < tokens.length; i++) {
    var token = tokens[i];
    var result = this.exprGen.next(token);
    finished = false;

    if (result.done) {
      this.exprGen = makeExprGen();
      results.push(result.value);
      finished = true;
    }
  }

  return {finished: finished,
          results: results};
};

module.exports = Reader;
