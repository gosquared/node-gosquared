var should = require('should');

module.exports.testResponse = function(done, err, res){
  should.not.exist(err);
  if(process.env.verbosity == 'ALL'){
    console.log(res);
  }
  res.should.be.a('object');
  done();
};