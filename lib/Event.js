module.exports = function(name, params, done){
  if(typeof params == 'function'){
    done = params;
    params = {};
  }
  else if(typeof params != 'object') params = {};

  if(typeof done !== 'function'){
    done = function(){};
  }

  if(!name){
    this._debug(5, 'WARNING');
    return done(this._makeError(5));
  }

  params.name = name;
  params.a = this.opts.site_token;
  this._exec(this.config.endpoints.data, '/event', params, this._responseCompleted.bind(this, done));
};
