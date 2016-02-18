import { bind, Injector, OpaqueToken } from 'angular2/src/core/di';
import { PromiseWrapper } from 'angular2/src/facade/async';
import { Reporter } from '../reporter';
export class MultiReporter extends Reporter {
    constructor(reporters) {
        super();
        this._reporters = reporters;
    }
    static createBindings(childTokens) {
        return [
            bind(_CHILDREN)
                .toFactory((injector) => childTokens.map(token => injector.get(token)), [Injector]),
            bind(MultiReporter).toFactory(children => new MultiReporter(children), [_CHILDREN])
        ];
    }
    reportMeasureValues(values) {
        return PromiseWrapper.all(this._reporters.map(reporter => reporter.reportMeasureValues(values)));
    }
    reportSample(completeSample, validSample) {
        return PromiseWrapper.all(this._reporters.map(reporter => reporter.reportSample(completeSample, validSample)));
    }
}
var _CHILDREN = new OpaqueToken('MultiReporter.children');
