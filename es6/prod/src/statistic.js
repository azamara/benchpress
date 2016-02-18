import { Math } from 'angular2/src/facade/math';
export class Statistic {
    static calculateCoefficientOfVariation(sample, mean) {
        return Statistic.calculateStandardDeviation(sample, mean) / mean * 100;
    }
    static calculateMean(samples) {
        var total = 0;
        // TODO: use reduce
        samples.forEach(x => total += x);
        return total / samples.length;
    }
    static calculateStandardDeviation(samples, mean) {
        var deviation = 0;
        // TODO: use reduce
        samples.forEach(x => deviation += Math.pow(x - mean, 2));
        deviation = deviation / (samples.length);
        deviation = Math.sqrt(deviation);
        return deviation;
    }
    static calculateRegressionSlope(xValues, xMean, yValues, yMean) {
        // See http://en.wikipedia.org/wiki/Simple_linear_regression
        var dividendSum = 0;
        var divisorSum = 0;
        for (var i = 0; i < xValues.length; i++) {
            dividendSum += (xValues[i] - xMean) * (yValues[i] - yMean);
            divisorSum += Math.pow(xValues[i] - xMean, 2);
        }
        return dividendSum / divisorSum;
    }
}
