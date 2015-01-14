var config = require('../config');

var exports = module.exports = function setupFunctions(namespace, api) {
  var self = this;

  for (var version in api) {
    if (version === 'latest') continue;

    var v = self[version];

    // ensure version object exists
    if (!v) v = self[version] = {};

    var fncs = api[version];

    for (var i = 0; i < fncs.length; i++) {
      var f = v[fncs[i]] = createMethod.call(self, namespace, version, fncs[i]);

      // is this the default version?
      if (version === api.latest) {

        // set it on the namespace (e.g. $.GoSquared.now.concurrents)
        self[fncs[i]] = f;
      }
    }
  }
};

function createMethod(namespace, version, func) {
  var self = this;

  return function(opts, cb){

    if (typeof opts == 'function'){
      cb = opts;
      opts = {};
    }

    if (typeof opts != 'object') opts = {};

    if (typeof cb != 'function') cb = function(){};

    var endpoint = config.endpoint;
    self.GS._exec(
      endpoint,
      '/' + namespace + '/'+ version + '/' + func,
      'GET',
      {},
      cb
    );
  };
}
