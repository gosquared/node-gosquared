var should = require('should');

module.exports.testResponse = function(done, err, res){
  should.not.exist(err);
  if(process.env.verbosity == 'ALL'){
    console.log(res);
  }

  // check for errors
  res.should.not.have.property('code');
  res.should.not.have.property('message');

  res.should.be.a('object');
  done();
};

module.exports.testError = function(done, err, res){
  should.exist(err);
  err.should.be.a('object');
  err.should.have.property('code');
  err.should.have.property('message');
  done();
};
