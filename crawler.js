//WALKER FUNCTION TAKES IN A BUNCH OF PACKAGE NAMES
//, CHECKS TO SEE IF THEY'RE STALE 
//, IF STALE -> UPDATE TIMESTAMP 
// && PUSH ON QUEUE 
//ELSE KEEP WALKING
' use strict '; 
 
var redis = require('redis')
  , client = redis.createClient(); 

function Walker (plist, q, key, dbNum, secs){ 
  var _this = this; 
  this.key = key; 
  this.secs = secs; 

  if (dbNum){
    client.select(dbNum, function(err){ 
      if(err){ console.log(err); return } 
    }); 
  } 
  client.exists(key, function(err, exists){
    if(err){ console.log(err); return } 
    if (exists){ 
      console.log(key);
      _this.walk(key); 
    }else{
      //build index for the first time
      _this.buildIndex(plist, key);  
    } 
  });
}

Walker.prototype.checkStale = function (uTime){ 
  var now = Math.round((new Date()).getTime() / 1000);
  if (now - uTime >= this.secs) return true 
  else return false 
}  

Walker.prototype.buildIndex = function (packages, key){
  for(var i = 0; i < packages.length; i++){
    var p = packages[i]; 
    console.log(p); 
    client.hset(key, p, 0, redis.print)
   }
} 

Walker.prototype.walk = function(key){
  var _this = this;  
  client.hkeys(key, function(err,replies){ 
    replies.forEach(function (reply){ 
      client.hget(key ,reply, function(err, res){
        if (err){ console.log(err); return }  
        res = parseInt(res, 10); 
        if (_this.checkStale(res)) console.log('dis shit stale as hell yo'); 
        else console.log('dis shit aint stale dawg')
      });
    });
  });
}
          
module.exports = Walker    

var yo = new Walker(['express', 'github2es', 'npm2es', 'elasticsearch', 'yodawg'], null, 'faiq', 259200);
