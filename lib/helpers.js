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