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
