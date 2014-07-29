#Rediswalker 
---

##Overview: 
Redis walker is a quick utility to manage your a redis hash structure, to check if its contents are stale or not to a certain date. 

##What the structure should look like:  

```
	redisKey: { 
		 obj1: unix_epoch_timestamp,
		 obj2: unix_epoch_timestamp,
		 ...
		 objn: unix_epoch_timestamp
	}
```

##How to use it: 

1. Create a new instance of this walker with the appropriate params

``` 
var walker = new Walker(arrayOfObjNames, q, keyYouWantToStoreInRedis, optionalRedisDBNum, secsTillStale)
``` 
2. Daemonize the process, so it runs forever in the background
3. Done! 

 