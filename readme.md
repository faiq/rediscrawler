#Rediswalker 
---

##Overview: 


##What the structure should look like:  

```
	redisKey: { 
		 obj1: unix_epoch_timestamp,
		 obj2: unix_epoch_timestamp,
		 ...
		 objn: unix_epoch_timestamp
	}
```

The ```redisKey``` in this key should be associated with a redis sorted set. 

##How to use it: 

1. Create a new instance of this walker with the appropriate params
``` 
var walker = new Walker(couchUrl, sortedSetKey); 

``` 

2. Daemonize the process, so it runs forever in the background
3. Done! 

 
