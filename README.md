Calculon
========

"If I buy a stamp five years ago for $5, and sell it today for $50, what was my compound annual rate of return?"

What is Calculon?
------
Calculon is a calculator for investments. It can find compound rate of return, and return statistics useful for making graphs.

Why do I care?
------
Compound rate of return is a very important formula used frequently in real estate investing and the stock market. 

Why not just use `math.pow()?`
-------
`math.pow()` can't account for recurring payments and it doesn't output statistics.

How to use?
-----------

```html
<script src='Calculon.js'></script>
<script>
  var q = Calculon.rateOfReturn({
      interestRate:8,
      startingValue: 3,
      finalValue: null,
      numMonths: 32,
      recurringPayment: 5,
  })
  alert(q);
  // Object {value: 182.59, valueType: "finalValue", params: Object, stats: Array[32]}
</script>
```

###Description:

You must pass a parameters object to `Calculon.rateOfReturn()` with all *but one* entry filled out (in the example above, finalValue is `null`). Recurring payment is optional and cannot be calculated.

```
  returnObject = Calculon.rateOfReturn(parameters)
```

```
@parameters: object { 
    interestRate:number - the annual rate of return 
    startingValue:number - the starting value of the investment 
    finalValue:number - the final value of the investment at the end of the time period
    numMonths:number -  the number of months in the time period
    [recurringPayment:number - an addition or subtraction of value every month]
} 
```

```
@returnObject: object { 
    value:number - the value of the query
    valueType:string - the nature of the response 
    params:object - the original parameters passed to the function
    stats:array - the value each month
} 
```

###Shortcuts

```
Calculon.ror = Calculon.rateOfReturn
```

#### Examples

```javascript
  Calculon.instructions();
  // outputs colorful instructions
```

```javascript
  Calculon.rateOfReturn({
    startingValue: 100,
    numMonths: 150,
    interestRate: 7.58,
    recurringPayment: 6,
    finalValue: undefined,
  })
  //Object {value: 1759.38, valueType: "finalValue", params: Object, stats: Array[150]}
```

```javascript
  Calculon.rateOfReturn({
    startingValue: 3,
    finalValue: 50,
    numMonths: 120
  })
  //Object {value: 28.451, valueType: "interestRate", params: Object, stats: Array[120]}
```


#### Example Using the Stock Market

```javascript
  // IBM's stock price where the first value is 10 years ago today and the last is today
  var IBM = [85.53,86.06,87.05,87.42,87.13,87.1,88.7,88.35,88.59,88.59,88.12,87.98,87.35,87.56,88.64,90.04,90.09,90.46,90.07,90.54,90.38,90.44,90.06,89.49,90.02,90.79,89.99,89.55,88.71,88.29,88.15,87.5,87.04,85.7,85.35,83.65,83.89,84.95,85.25,84.13,84.02,84.28,85.3,86.36,85.3,86.06,84.85,85.09,85.88,85.85,86.77,87.07,86 ... ];
  
  Calculon.rateOfReturn({
    startingValue: IBM[0],
    numMonths: IBM.length / 20,
    interestRate: undefined,
    finalValue: IBM[IBM.length - 1]
  });
  
  // 7.58
  // Returns my copmound annual rate of return on IBM if I bought it at the beginning and sold at the end. (It's 20 because there are 20 business days in a month)
  
  Calculon.rateOfReturn({
    startingValue: IBM[240],
    numMonths: 60,
    interestRate: undefined,
    finalValue: IBM[1440]
  });

  // 9.56
  // Returns my compound rate of return if I had bought it 1 year into the data set, and sold 6 years into it. A significantly better deal!
```
