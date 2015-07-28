var Transaction = require('../Transaction');
var Person = require('../Person');
var Event = require('../Event');

var Tracking = module.exports = function(GS) {
  this.GS = GS;

  this.v1 = this;

  for(var f in Tracking.prototype) {
    this.GS[f] = Tracking.prototype[f].bind(this);
  }
};

Tracking.prototype.createTransaction = function(transactionID, opts, trackingData){
  return new Transaction(this.GS, transactionID, opts, trackingData);
};

Tracking.prototype.createPerson = function(id){
  return new Person(this.GS, id);
};

Tracking.prototype.trackEvent = function(name, data, trackingData, cb) {
  if (!cb && !trackingData && typeof data === 'function') {
    cb = data;
    data = {};
    trackingData = {};
  }

  if (!cb && typeof trackingData === 'function') {
    cb = trackingData;
    trackingData = {};
  }

  var event = new Event(this.GS, name, data, trackingData);
  event.track(cb);
};
