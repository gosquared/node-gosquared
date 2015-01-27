var utils = require('./utils');
var config = require('../config');
var async = require('async');
var opts = require('./opts');
var GoSquared = require('../lib/GoSquared');
var gosquared = new GoSquared(opts);

var testSuccess = utils.testSuccess;
var testFail = utils.testFail;

var api = require('../lib/api/Account').api;

describe('Account', function() {
  it('retrieves data', function(done) {
    var a = [];
    for (var i = 0; i < api.v1.length; i++) {
      var f = api.v1[i];
      a.push(function(f, cb) {
        gosquared.account.v1[f].get(testSuccess(cb));
      }.bind(null, f));
    }
    async.parallel(a, done);
  });
});
