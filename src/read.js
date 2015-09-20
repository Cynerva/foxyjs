function stringToTokens(string) {
  return string.replace(/([\(\)])/g, " $1 ")
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
    return elements;
  }

  return token;
}

function read(string) {
  return tokensToTree(stringToTokens(string));
}

module.exports = read;
