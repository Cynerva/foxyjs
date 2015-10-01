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

function Channel() {
  this.putters = mori.queue();
  this.takers = mori.queue();
  this.peekers = mori.queue();
}

Channel.prototype = {
  take: function() {
    var taker = makePromise();

    if (mori.isEmpty(this.putters)) {
      this.takers = mori.conj(this.takers, taker);
    } else {
      var putter = mori.peek(this.putters);
      this.putters = mori.pop(this.putters);
      taker.resolve(putter.putValue);
      putter.resolve();
    }

    return taker;
  },
  put: function(value) {
    var putter = makePromise();
    putter.putValue = value;

    mori.each(this.peekers, function(peeker) {
      peeker.resolve(value);
    });

    if (mori.isEmpty(this.takers)) {
      this.putters = mori.conj(this.putters, putter);
    } else {
      var taker = mori.peek(this.takers);
      this.takers = mori.pop(this.takers);
      taker.resolve(value);
      putter.resolve();
    }

    return putter;
  },
  peek: function() {
    var peeker = makePromise();

    if (mori.isEmpty(this.putters)) {
      this.peekers = mori.conj(this.peekers, peeker);
    } else {
      var putter = mori.peek(this.putters);
      peeker.resolve(putter.putValue);
    }

    return peeker;
  }
}

function makeChannel() {
  return new Channel();
}

module.exports = makeChannel;
