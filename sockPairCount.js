const sockMerchant = (count, sockArray) => {
    if(count != sockArray.length) return false;
  
    const myMap = new Map();
  
    for(let i = 0; i < count; i++) {
      if(myMap.has(sockArray[i])) {
        myMap.set(sockArray[i], myMap.get(sockArray[i]) + 1);
      } else {
        myMap.set(sockArray[i], 1);
      }
    }
  
    let pairs = 0;
    for(let value of myMap.values()) {
      pairs += Math.floor(value / 2);
    }
    return pairs;  
  }

// To test, uncomment the line below and run.
//   console.log(sockMerchant(9, [10, 20, 20, 10, 10, 30, 50, 10, 20]));