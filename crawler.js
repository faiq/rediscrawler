//WALKER FUNCTION TAKES IN A BUNCH OF PACKAGE NAMES
//, CHECKS TO SEE IF THEY'RE STALE 
//, IF STALE -> UPDATE TIMESTAMP 
// && PUSH ON QUEUE 
//ELSE KEEP WALKING
' use strict '; 
 
var redis = require('redis')
  , follow = require('follow')
  , client = redis.createClient()

Walker.prototype.startFollower = function (){
  var couchUrl = this.couchUrl
  var _this = this
  var settings = 
  {
    db: couchUrl
    , since: 0  //maybe I change this? I dont know 
    , include_docs: true
  }  
  
  this.follow = follow(settings, function(err, change){ 
    if(err) console.log(err) 
    if (change.id){ 
      _this.addChange(change)   
     /* client.zscore(this.zKey, change, function(err, res){
        if (err){
          console.log('err ' + err)
          return 
        }
        if (!res) console.log(res + ' is falsy') 
      }) */
    } 
  }) 
}    

Walker.prototype.addChange = function(change){ 
  var _this = this
  client.zscore(this.zKey, change, function(err, res){
    if (err){
      console.log('err ' + err)
      return 
    }
    if (!res){
      console.log('yo');
      client.zadd(_this.zKey, 0, change, function(err, res){
        if(err){
          console.log('err ' + err)
          return
        } 
        console.log('added ' + res + ' items.') 
      })
    }   
  }) 
}

function Walker(couchUrl, zKey){ 
  this.couchUrl = couchUrl
  this.zKey = zKey
} 

var yo =  new Walker('https://skimdb.npmjs.com/registry', 'packages')

yo.startFollower() 



































/*
function Walker (plist, lKey, hKey, dbNum, secs){ 
  var _this = this; 
  this.hKey = hKey; 
  if (dbNum > 16){
    //user passed in secs instead of a dbNum
    this.secs = dbNum; 
  }else this.secs = secs;
  this.lKey = lKey; 
  this.packages = plist;

  if (dbNum){
    client.select(dbNum, function(err){ 
      if(err){ console.log(err); return } 
    }); 
  } 
  client.exists(this.hKey, function(err, exists){
    if(err){ console.log(err); return } 
    if (exists){ 
      console.log(hKey = " exists");
      _this.walk(); 
    }else{
      //build index for the first time
      _this.buildIndex();  
    } 
  });
}

Walker.prototype.checkStale = function (uTime){ 
  var now = Math.round((new Date()).getTime() / 1000);
  console.log(now - uTime); 
  if (Math.abs(now - uTime) >= this.secs) return true 
  else return false 
}  

Walker.prototype.buildIndex = function (){
  var packages = this.packages; 
  var hKey = this.hKey;
  var lKey = this.lKey; 
  for(var i = 0; i < packages.length; i++){
    var p = packages[i]; 
    console.log(p); 
    client.hset(hKey, p, 0, redis.print); 
    client.sadd(lKey, p, redis.print); 
   }
} 

Walker.prototype.walk = function(){
  var hKey = this.hKey; 
  var lKey = this.lKey;
  var _this = this;  
  client.hkeys(hKey, function(err,replies){ 
    replies.forEach(function (reply){ 
      console.log(reply); 
      client.hget(hKey, reply, function(err, res){
        if (err){ console.log(err); return }  
        res = parseInt(res, 10); 
        if (_this.checkStale(res)){ 
          var now = Math.round((new Date()).getTime() / 1000);
          client.hset(hKey, reply,  now, redis.print);  
          client.sadd(lKey, reply, redis.print);
        } 
        else console.log('dis shit aint stale dawg')
      });
    });
    client.smembers(lKey, function(err, replies){ 
      if(err) { console.log(err); return } 
      replies.forEach(function(reply){ 
        console.log(reply + ' has been added to the work queue'); 
      });
    });   
  });
}
*/           
module.exports = Walker    

