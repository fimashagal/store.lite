# store.lite
Lite strong type store 🚲 Work just with scalar volumes

## Create store

```javascript
    new Store({
        propertyNumber: 0,
        propertyBoolean: false,
        propertyString: "text"
    });
    
```
## Add volume

```javascript
    const store = new Store();
    store.addVolume("flag", false);

```

## Add/remove reflect to change property value
```javascript
    const store = new Store({
        "propertyBoolean": false
    });

    store.addReflect("propertyBoolean", console.log);
    store.propertyBoolean = true;
      
    // If need remove reflect use
    store.removeReflect("propertyBoolean");
```

## Add reflect with jerk-param for urgent executing one time after setup without data-changing

```javascript
    const store = new Store({
        propertyNumber: 0
    });
    
    // Third argument it is jerk-param. By default it was false
    x.addReflect('propertyNumber', console.log, true); 

```

## Export data anytime

```javascript
    new Store({
        propertyNumber: 0
    })
    .exportData();
  
```

## Check value as boolean type

Also u can use few arguments for group test

```javascript 
  storeA.is("propertyBoolean"); // true
  storeA.isnt("propertyBoolean", "propertyNumber"); // false
```

## Add/remove fixed range for only number type property

```javascript
  // Can use callbacks for extremum overflow
  // Support sausage notation for add/remove methods
  const store = new Store({
      propertyNumber: 0
  });

  store
      .addRange("propertyNumber", [-10, 10], console.log, console.log)
      .addReflect("propertyNumber", console.log);
  
  for(let i = -50; i <= 50; i++){
      store.propertyNumber = i;
  }
  
  // If need remove range
  store.removeRange("propertyNumber"); 
  
  // If need detect ranged
  store.isRanged("propertyNumber"); // false
```

## Add/remove immutability lock 

```javascript

    const store = new Store({
          propertyNumber: 0
      });

  store
      .addReflect("propertyNumber", console.log)
      .addLock("propertyNumber");
  
  store.propertyNumber = 11; // reflect will not work cause property locked
  
  // If need detect lock
  store.isLocked("propertyNumber"); // true
  
  // If need remove lock
  store.removeLock("propertyNumber"); 
  
```