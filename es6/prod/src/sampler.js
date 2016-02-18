import { isPresent, isBlank } from 'angular2/src/facade/lang';
import { PromiseWrapper } from 'angular2/src/facade/async';
import { bind } from 'angular2/src/core/di';
import { Metric } from './metric';
import { Validator } from './validator';
import { Reporter } from './reporter';
import { WebDriverAdapter } from './web_driver_adapter';
import { Options } from './common_options';
import { MeasureValues } from './measure_values';
/**
 * The Sampler owns the sample loop:
 * 1. calls the prepare/execute callbacks,
 * 2. gets data from the metric
 * 3. asks the validator for a valid sample
 * 4. reports the new data to the reporter
 * 5. loop until there is a valid sample
 */
export class Sampler {
    constructor({ driver, metric, reporter, validator, prepare, execute, now } = {}) {
        this._driver = driver;
        this._metric = metric;
        this._reporter = reporter;
        this._validator = validator;
        this._prepare = prepare;
        this._execute = execute;
        this._now = now;
    }
    // TODO(tbosch): use static values when our transpiler supports them
    static get BINDINGS() { return _PROVIDERS; }
    sample() {
        var loop;
        loop = (lastState) => {
            return this._iterate(lastState).then((newState) => {
                if (isPresent(newState.validSample)) {
                    return newState;
                }
                else {
                    return loop(newState);
                }
            });
        };
        return loop(new SampleState([], null));
    }
    _iterate(lastState) {
        var resultPromise;
        if (isPresent(this._prepare)) {
            resultPromise = this._driver.waitFor(this._prepare);
        }
        else {
            resultPromise = PromiseWrapper.resolve(null);
        }
        if (isPresent(this._prepare) || lastState.completeSample.length === 0) {
            resultPromise = resultPromise.then((_) => this._metric.beginMeasure());
        }
        return resultPromise.then((_) => this._driver.waitFor(this._execute))
            .then((_) => this._metric.endMeasure(isBlank(this._prepare)))
            .then((measureValues) => this._report(lastState, measureValues));
    }
    _report(state, metricValues) {
        var measureValues = new MeasureValues(state.completeSample.length, this._now(), metricValues);
        var completeSample = state.completeSample.concat([measureValues]);
        var validSample = this._validator.validate(completeSample);
        var resultPromise = this._reporter.reportMeasureValues(measureValues);
        if (isPresent(validSample)) {
            resultPromise =
                resultPromise.then((_) => this._reporter.reportSample(completeSample, validSample));
        }
        return resultPromise.then((_) => new SampleState(completeSample, validSample));
    }
}
export class SampleState {
    constructor(completeSample, validSample) {
        this.completeSample = completeSample;
        this.validSample = validSample;
    }
}
var _PROVIDERS = [
    bind(Sampler)
        .toFactory((driver, metric, reporter, validator, prepare, execute, now) => new Sampler({
        driver: driver,
        reporter: reporter,
        validator: validator,
        metric: metric,
        // TODO(tbosch): DI right now does not support null/undefined objects
        // Mostly because the cache would have to be initialized with a
        // special null object, which is expensive.
        prepare: prepare !== false ? prepare : null,
        execute: execute,
        now: now
    }), [
        WebDriverAdapter,
        Metric,
        Reporter,
        Validator,
        Options.PREPARE,
        Options.EXECUTE,
        Options.NOW
    ])
];
