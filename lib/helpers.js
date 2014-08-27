module.exports.bufferResponse = function(res, cb){
  res.setEncoding('utf8');
  var response = '';
  res.on('data', function(chunk){
    response += chunk;
  });

  res.on('end', function(){
    cb(null, response);
  });
};

/**
 * From https://github.com/Raynos/xtend
 */
module.exports.extend = function(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i],
        keys = Object.keys(source);

    for (var j = 0; j < keys.length; j++) {
      var name = keys[j];
      target[name] = source[name];
    }
  }

  return target;
};

module.exports.clone = function(obj) {

  function copy(a){
    if(!a || typeof a !== 'object') return a;

    if(Array.isArray(a)){
      return a.concat([]).map(copy);
    }

    var out = {};
    for(var i in a){
      if (!a.hasOwnProperty(i)) continue;
      out[i] = copy(a[i]);
    }
    return out;
  }

  return copy(obj);
};
