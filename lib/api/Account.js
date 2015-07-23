var Model = require('../Model');
var util = require('util');

var Account = module.exports = function(GS) {
  var self = this;
  this.GS = GS;

  this.v1 = this;
  var models = Account.api.v1;

  models.forEach(function(m) {
    var fn = function(GS) {
      this.GS = GS;
      this.path = '/account/v1/' + m;
    };
    util.inherits(fn, Model);
    self[m] = new fn(GS);
  });
};

Account.api = {
  latest: 'v1',
  v1: [
    'blocked',
    'reportPreferences',
    'sharedUsers',
    'sites',
    'taggedVisitors'
  ]
};
