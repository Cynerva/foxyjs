var mori = require("mori");

function makePromise() {
  var resolve;
  var reject;

  var promise = new Promise(function(res, rej) {
    resolve = res;
    reject = rej;
  });

  promise.resolve = resolve;
  promise.reject = reject;
  return promise;
}

function Stream() {
  var promises = mori.repeatedly(makePromise);
  this.putStream = promises;
  this.takeStream = promises;
}

Stream.prototype.put = function(value) {
  mori.first(this.putStream).resolve(value);
  this.putStream = mori.rest(this.putStream);
};

Stream.prototype.take = function() {
  var promise = mori.first(this.takeStream);
  this.takeStream = mori.rest(this.takeStream);
  return promise;
};

Stream.prototype.peek = function() {
  return mori.first(this.takeStream);
};

module.exports = Stream
