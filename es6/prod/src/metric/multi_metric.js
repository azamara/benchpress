import { bind, Injector, OpaqueToken } from 'angular2/src/core/di';
import { StringMapWrapper } from 'angular2/src/facade/collection';
import { PromiseWrapper } from 'angular2/src/facade/async';
import { Metric } from '../metric';
export class MultiMetric extends Metric {
    constructor(_metrics) {
        super();
        this._metrics = _metrics;
    }
    static createBindings(childTokens) {
        return [
            bind(_CHILDREN)
                .toFactory((injector) => childTokens.map(token => injector.get(token)), [Injector]),
            bind(MultiMetric).toFactory(children => new MultiMetric(children), [_CHILDREN])
        ];
    }
    /**
     * Starts measuring
     */
    beginMeasure() {
        return PromiseWrapper.all(this._metrics.map(metric => metric.beginMeasure()));
    }
    /**
     * Ends measuring and reports the data
     * since the begin call.
     * @param restart: Whether to restart right after this.
     */
    endMeasure(restart) {
        return PromiseWrapper.all(this._metrics.map(metric => metric.endMeasure(restart)))
            .then(values => mergeStringMaps(values));
    }
    /**
     * Describes the metrics provided by this metric implementation.
     * (e.g. units, ...)
     */
    describe() {
        return mergeStringMaps(this._metrics.map((metric) => metric.describe()));
    }
}
function mergeStringMaps(maps) {
    var result = {};
    maps.forEach(map => { StringMapWrapper.forEach(map, (value, prop) => { result[prop] = value; }); });
    return result;
}
var _CHILDREN = new OpaqueToken('MultiMetric.children');
