module.exports = function(name, params, cb){
  if(typeof params == 'function'){
    cb = params;
    params = {};
  } else if(typeof params != 'object') {
    params = {};
  }

  if(typeof cb !== 'function'){
    cb = function(){};
  }

  if(!name){
    this._debug(5, 'WARNING');
    return cb(this._makeError(5));
  }

  params.name = name;
  this._exec(this.config.endpoints.data, '/' + this.opts.site_token + '/event', params, params, this._responseCompleted.bind(this, cb));
};
