#!/usr/bin/env node
' use strict ';
 
var redis = require('redis')
  , follow = require('follow')
  , fs = require('fs') 
  , SF = require('seq-file')
  , path = require('path')
  , client = redis.createClient()

Couch2Redis.prototype.startFollower = function (){
  var couchUrl = this.couchUrl
  var since = this.since  
  var _this = this 
  console.log(since)
  var settings = 
  {
    db: couchUrl
    , since: since   
    , include_docs: true
  }  
  var _this = this
  this.follow = follow(settings, function(err, change){ 
    if(err) console.error(err) 
    console.log(change) 
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
   else{ 
    _this.follow.resume()
    return 
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
  if (fs.existsSync(sfPath)){ //, function (exists) {
    //if (exists){
      var data = fs.readFileSync(sfPath, 'UTF-8')
      data = parseInt(data, 10)  
      _this.since = data 
  }else _this.since = 0 
//  })
} 

module.exports = Couch2Redis 
var seq = path.join(__dirname, '/changes.seq') 
console.log(seq) 
var c2r = new Couch2Redis('https://skimdb.npmjs.com/registry', 'packages', seq) 
c2r.startFollower()
