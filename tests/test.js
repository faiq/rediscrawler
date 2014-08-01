var lab = require('lab')
  , couch2redis = require('../index')
  , exec = require('child_process').exec
  , redis = require('redis') 
  , experiment = lab.experiment
  , describe = lab.describe 
  , it = lab.it
  , before = lab.before 
  , expect = lab.expect
/*
describe('the constructor', function (){ 
  it('needs a couch url', function(done){ 
    expect(noUrl).to.throw(Error) 
    function noUrl (){ 
      var c2r = new couch2redis(null, 'yo', 'not a real thing')
    } 
    done() 
  }) 
  it('needs a redis key', function(done){ 
    expect(noRed).to.throw(Error) 
    function noRed (){ 
      var c2r = new couch2redis('yo',null,'not a real thing')
    } 
    done() 
  }) 
  it('needs a seq file', function(done){
    expect(noSeq).to.throw(Error) 
    function noSeq(){ 
      var c2r = new couch2redis('yo', 'yo must be everywhere', 'doesnt have seq with a . b4 it')
    } 
    done()
  }) 
}) 
*/

experiment('redis functionallity' , { timeout: 8000 },  function (){ 
  before(function (done){ 
    exec('redis-server', function (err, sto, ste){
      if(err) console.error(err) 
      if (sto) console.log('sto: ' + sto) 
      if (ste) console.log('ste: ' + ste)
     }) 
    done()  
  }) 
}) 
