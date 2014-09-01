#!/usr/bin/env node
' use strict ';
 
var follow = require('follow')
  , fs = require('fs') 
  , SF = require('seq-file')
  , path = require('path')
  , client = null 
  , redis = null 

Couch2Redis.prototype.startFollower = function (opts){
  var couchUrl = this.couchUrl
  var since = this.since  
  var _this = this 
  var settings = 
  {
    db: couchUrl
    , since: since   
    , include_docs: true
  }  
  var _this = this
  var followfunc 
  if (opts && opts.follow) followfunc = opts.follow 
  else followfunc = follow  
  this.follow = followfunc(settings, function(err, change){ 
    if(err){ 
      console.error(err) 
      return 
   }
    if (change.id){ 
      _this.addChange(change)
      _this.s.save(change.seq)     
    } 
  }) 
}    
  
Couch2Redis.prototype.addChange = function(change){ 
  var _this = this
  if (!client){ 
    setTimeout(function (){ 
      _this.addChange(change) 
    }, 1500);
  }else{  
    _this.follow.pause()
    client.zscore(this.zKey, change.id, function(err, res){
      if (err){
        console.error('err ' + err)
        return 
      }
      if (!res){
        client.zadd(_this.zKey, 0, change.id, function(err, res){
          if(err){
            console.error('err ' + err)
            return
          } 
          _this.follow.resume()
        })
      }else{ 
      _this.follow.resume()
      return 
     } 
    }) 
  }
}

function Couch2Redis(couchUrl, zKey, sfPath, opts){ 
  if (!couchUrl || !zKey || !sfPath){ 
    throw Error('You need a couchUrl, a key associated with a redis sortedset, and\n path for a sequence file')
    return
  } 
  if(sfPath.indexOf('.seq') === -1){ 
    throw Error('You need a .seq file for a sequence file') 
    return
  } 
  if (opts && opts.client) redis = require('fakeredis') 
  else redis = require('redis')
  client = redis.createClient() 
  this.couchUrl = couchUrl
  this.zKey = zKey
  this.s = new SF(sfPath)
  var _this = this  
  if (fs.existsSync(sfPath)){ 
      var data = fs.readFileSync(sfPath, 'UTF-8')
      data = parseInt(data, 10)  
      _this.since = data 
  }else _this.since = 0 
} 

module.exports = Couch2Redis 
