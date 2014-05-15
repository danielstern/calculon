function Calculon(config) {

    var calc = this;

    calc.targetAccuracy = 0.0001; // increases the accuracy of the compound interest Calculon. the higher it is, the higher you must make precision, which affects performance.
    calc.CalculonPrecision = 250; // this is an important value as it determines how often you get the "?"
    calc.allPfsCalculated = [];


    var values;

    /** example 
     var c = new Calculon();
       
      c.rateOfReturn({
        interestRate:8,
        startingValue: 3,
        finalValue: null,
        numMonths: 32
      })
    
    **/

    calc.instructions = function() {
        console.log("%cThanks for using Calculon!", "color: blue");
        console.log("%cFunctions", "color: black");
        console.log("%cCalculon.rateOfReturn(parameters)", "color: green");
        console.log("%c  @parameters: object { \n    %cinterestRate:number - the annual rate of return \n    startingValue:number - the starting value of the investment \n    finalValue:number - the final value of the investment at the end of the time period\n    numMonths:number -  the number of months in the time period\n  %c}", "color: red", "color:blue", "color: red");

        console.log("%cExample Valid Input", "color: black");
        console.log("%c  calc.rateOfReturn ({ \n    %cinterestRate: 7.8\n    startingValue:  10000 \n    finalValue:null\n    numMonths: 240\n  %c});", "color: red", "color:blue", "color: red");
    }


    calc.rateOfReturn = function(parameters) {

        var r = {};
        r.value = null;

        var directive;

        if (!parameters) {
            this.instructions();
            return;
        };

        var totalEmpty = 0;

        if (!parameters.interestRate) {
            directive = "interestRate";
            totalEmpty++;
        }

        if (!parameters.startingValue) {
            directive = "startingValue";
            totalEmpty++;
        }

        if (!parameters.finalValue) {
            directive = "finalValue";
            totalEmpty++;
        }

        if (!parameters.numMonths) {
            directive = "numMonths";
            totalEmpty++;
        };

        parameters.recurringPayment = parameters.recurringPayment || 0;


        if (!directive || totalEmpty > 1) {
            console.log("You must pass a valid parameters object with all values but one filled in. All values must be numbers.");
            console.log("%cYour parameters:","color:magenta", parameters);
            
            return;
        }

        switch (directive) {
            case 'interestRate':
                r.value = calc.getInterestRate(parameters);
                break;

            case ('startingValue'):
                r.value = calc.getStartingValue(parameters);
                break;

            case ('finalValue'):
                r.value = calc.getFinalValue(parameters);
                break;

            case ('numMonths'):
                r.value = calc.getNumMonths(parameters);
                break;

        }

        r.value = parseFloat(r.value);
        r.valueType = directive;
        r.params = parameters;
        r.stats = this.getChartValues(parameters);

        return r;


    }

    calc.ror = calc.rateOfReturn;


    calc.refreshStashedValues = function() {
        calc.allPfsCalculated = [];
    }

    calc.stashValue = function(value) {
        calc.allPfsCalculated.push(value);
    }

    calc.getFinalValue = function(values) {

        calc.refreshStashedValues();

        var numMonths = values.numMonths;

        if (values.timeKind == 'yearly') {
            numMonths *= 12;
        }

        var p1 = Number(values.startingValue);
        var pf = p1;

        var pr = Number(values.recurringPayment);
        var yearlyInterestRate = Number(values.interestRate);

        var monthlyInterestRate = yearlyInterestRate / 12;

        var i = 1 + (monthlyInterestRate / 100);

        if (!p1) p1 = 0;
        if (!i) i = 1;
        if (!pr) pr = 0;

        var monthsThru = 0;

        for (var n = 0; n < numMonths; n++) {

            pf += pr;
            pf = pf * i;

            var stats = {};
            stats.total = pf;
            stats.payment = pr;
            stats.interestPaid = (pf * i) - pf;

            //    calc.stashValue(pf);
            calc.stashValue(stats);

        }

        return pf.toFixed(2);

    }

    calc.getStartingValue = function(values) {

        var numMonths = values.numMonths;

        var pf = Number(values.finalValue);
        var p1 = pf;

        var pr = Number(values.recurringPayment);
        var yearlyInterestRate = Number(values.interestRate);

        var monthlyInterestRate = yearlyInterestRate / 12;

        var i = 1 + (monthlyInterestRate / 100);

        if (!p1) p1 = 0;
        if (!i) i = 1;
        if (!pr) pr = 0;

        var monthsThru = 0;

        for (var n = 0; n < numMonths; n++) {
            if (values.depositFreq == 'monthly') pf -= pr;

            //pf = pf * i;     // for calculating payments at the beginning of the period

            if (values.depositFreq == 'yearly') {

                if (monthsThru == 0) pf -= pr;
                monthsThru++;
                if (monthsThru == 12) monthsThru = 0;

            }

            pf = pf / i;

        }

        return pf.toFixed(2);
    }


    calc.getInterestRate = function(values) {

        var numMonths = values.numMonths;


        var apf = values.finalValue;

        var p1 = Number(values.startingValue);
        var pf = p1;
        var pr = Number(values.recurringPayment);
        var i = 1.01;

        if (pf < p1) return 0;

        var monthsThru = 0;

        var guessI = i;

        var precision;
        var targetPrecision = 10; // less than this amount apart  

        var count = calc.CalculonPrecision;
        var adjustmentAmount = 0.01;

        while (count > 0) {
            calc.allPfsCalculated = [];

            for (var n = 0; n < numMonths; n++) {
                if (values.depositFreq == 'monthly') pf += pr;

                if (values.depositFreq == 'yearly') {

                    if (monthsThru == 0) pf += pr;
                    monthsThru++;
                    if (monthsThru == 12) monthsThru = 0

                }

                pf = pf * guessI;
                calc.allPfsCalculated.push(pf);

            }

            if (apf > pf) {

                guessI += adjustmentAmount;

            } else {

                guessI -= adjustmentAmount;

            }
            precision = Math.abs(pf - apf);

            if (precision < calc.targetAccuracy) {
                break;
            }


            adjustmentAmount *= 0.9;
            pf = p1;

            count--;
        }

        i = ((guessI - 1) * 12) * 100;

        if (precision > 10 || isNaN(precision || count >= calc.CalculonPrecision)) return "?"
     //   $('#interestError').html('');
        return i.toFixed(3);

    }

    calc.getChartValues = function(parameters) {
        calc.getFinalValue(parameters);
        return calc.allPfsCalculated;
    }

    calc.getNumMonths = function(values) {

        console.log("Getting number of months, values", values);

        var apf = parseFloat(values.finalValue);
        var p1 = parseFloat(values.startingValue);
        var pf = p1;
        var pr = parseFloat(values.recurringPayment);
        var i = parseFloat(values.interestRate) / 12;



        var monthsThru = 0;

        var guessNumMonths = 120;

        var precision;
        var targetPrecision = 25; // less than this amount apart  

        var timeTargetAccuracy = 50;

        var count = this.CalculonPrecision;
        var adjustmentAmount = 15;

        while (count > 0) {
            this.allPfsCalculated = [];
            var numMonths = guessNumMonths;

            for (var n = 0; n < numMonths; n++) {
                if (values.depositFreq == 'monthly') pf += pr;

                if (values.depositFreq == 'yearly') {

                    if (monthsThru == 0) pf += pr;
                    monthsThru++;
                    if (monthsThru == 12) monthsThru = 0

                }

                pf = pf * (1 + (i / 100));

                calc.allPfsCalculated.push(pf);

            }

            if (apf > pf) {

                guessNumMonths += adjustmentAmount;

            } else {

                guessNumMonths -= adjustmentAmount;

            }

            precision = Math.abs(pf - apf);

            if (precision < timeTargetAccuracy) break;

            adjustmentAmount *= 0.95;
            pf = p1;

            count--;
        }

        var temporalAccuracyTarget = pf * 0.22;

       // if (isNaN(precision) || precision > temporalAccuracyTarget) return -1
        return numMonths.toFixed(3);

    }
}

var __calc = new Calculon;
Calculon.instructions = __calc.instructions;
Calculon.rateOfReturn = function(params) {
    var c = new Calculon();
    return c.ror(params);
}
Calculon.ror = Calculon.rateOfReturn;
