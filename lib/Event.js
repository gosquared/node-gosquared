var config = require('../config');

var Event = module.exports = function(GS, name, data) {
  this.GS = GS;

  this.body = {
    event: {
      name: name,
      data: data || {}
    }
  };
};

Event.prototype.track = function(cb) {
  cb = cb || function() {};

  if (!this.body.event.name){
    return cb && cb(new Error('Event name not given'));
  }

  if (typeof this.personID !== 'undefined') this.body.person_id = this.personID;

  this.GS._exec(config.endpoint + '/tracking/v1', '/event', 'POST', {}, this.body, cb);
};
