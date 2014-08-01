' use strict ';
 
var redis = require('redis')
  , follow = require('follow')
  , fs = require('fs') 
  , SF = require('seq-file')
  , client = redis.createClient()

Couch2Redis.prototype.startFollower = function (){
  var couchUrl = this.couchUrl
  var since = this.since  
  var settings = 
  {
    db: couchUrl
    , since: since     
    , include_docs: true
  }  
  var _this = this
  this.follow = follow(settings, function(err, change){ 
    if(err) console.error(err) 
    if (change.id){ 
      _this.addChange(change)
      _this.s.save(change.seq)     
    } 
  }) 
}    
  
Couch2Redis.prototype.addChange = function(change){ 
  var _this = this
  console.log('adding change') 
  _this.follow.pause()
  client.zscore(this.zKey, change.id, function(err, res){
    if (err){
      console.log('err ' + err)
      return 
    }
    if (!res){
      client.zadd(_this.zKey, 0, change.id, function(err, res){
        if(err){
          console.log('err ' + err)
          return
        } 
        console.log('added ' + res + ' items.') 
        
        _this.follow.resume()
      })
    }  
  }) 
}

function Couch2Redis(couchUrl, zKey, sfPath){ 
  if (!couchUrl || !zKey || !sfPath)
    throw Error('You need a couchUrl, a key associated with a redis sortedset, and\n path for a sequence file')
  if(sfPath.indexOf('.seq') === -1) 
    throw Error('You need a .seq file for a sequence file') 
  this.couchUrl = couchUrl
  this.zKey = zKey
  this.s = new SF(sfPath)
  var _this = this  
  fs.exists(sfPath, function (exists) {
    if (exists){
      var data = fs.readFileSync(sfPath, 'ascii')
      _this.since = data 
    }else _this.since = 0 
  })
} 

module.exports = Couch2Redis 
