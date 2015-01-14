var assert = require('assert');

exports.testSuccess = function(cb) {
  return function(err, res) {
    if (err) return cb(err);
    assert.equal(typeof res, 'object', 'invalid res');
    return cb(err, res);
  };
};

exports.testFail = function(cb) {
  return function(err) {
    if (!err) return cb(new Error('Expected error'));
    return cb();
  };
};

exports.makeTransactionID = function() {
  return '' + Math.floor(Math.random()*0xffffffff);
};
