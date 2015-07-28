var config = require('../config');

var Event = module.exports = function(GS, name, data, trackingData) {
  this.GS = GS;

  this.name = name;
  this.data = data || {};
  this.trackingData = trackingData || {};
};

Event.prototype.track = function(cb) {
  if (!cb) cb = function() {};

  if (!this.name){
    return cb(new Error('Event name not given'));
  }

  var body = this.trackingData;
  body.event = {
    name: this.name,
    data: this.data
  };

  this.GS._exec(config.endpoint + '/tracking/v1', '/event', 'POST', {}, body, cb);
};
