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
</script>
```
