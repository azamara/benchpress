import { print, NumberWrapper } from 'angular2/src/facade/lang';
import { StringMapWrapper } from 'angular2/src/facade/collection';
import { PromiseWrapper } from 'angular2/src/facade/async';
import { Math } from 'angular2/src/facade/math';
import { bind, provide, OpaqueToken } from 'angular2/src/core/di';
import { Statistic } from '../statistic';
import { Reporter } from '../reporter';
import { SampleDescription } from '../sample_description';
/**
 * A reporter for the console
 */
export class ConsoleReporter extends Reporter {
    constructor(_columnWidth, sampleDescription, _print) {
        super();
        this._columnWidth = _columnWidth;
        this._print = _print;
        this._metricNames = ConsoleReporter._sortedProps(sampleDescription.metrics);
        this._printDescription(sampleDescription);
    }
    // TODO(tbosch): use static values when our transpiler supports them
    static get PRINT() { return _PRINT; }
    // TODO(tbosch): use static values when our transpiler supports them
    static get COLUMN_WIDTH() { return _COLUMN_WIDTH; }
    // TODO(tbosch): use static values when our transpiler supports them
    static get BINDINGS() { return _PROVIDERS; }
    static _lpad(value, columnWidth, fill = ' ') {
        var result = '';
        for (var i = 0; i < columnWidth - value.length; i++) {
            result += fill;
        }
        return result + value;
    }
    static _formatNum(n) { return NumberWrapper.toFixed(n, 2); }
    static _sortedProps(obj) {
        var props = [];
        StringMapWrapper.forEach(obj, (value, prop) => props.push(prop));
        props.sort();
        return props;
    }
    _printDescription(sampleDescription) {
        this._print(`BENCHMARK ${sampleDescription.id}`);
        this._print('Description:');
        var props = ConsoleReporter._sortedProps(sampleDescription.description);
        props.forEach((prop) => { this._print(`- ${prop}: ${sampleDescription.description[prop]}`); });
        this._print('Metrics:');
        this._metricNames.forEach((metricName) => {
            this._print(`- ${metricName}: ${sampleDescription.metrics[metricName]}`);
        });
        this._print('');
        this._printStringRow(this._metricNames);
        this._printStringRow(this._metricNames.map((_) => ''), '-');
    }
    reportMeasureValues(measureValues) {
        var formattedValues = this._metricNames.map(metricName => {
            var value = measureValues.values[metricName];
            return ConsoleReporter._formatNum(value);
        });
        this._printStringRow(formattedValues);
        return PromiseWrapper.resolve(null);
    }
    reportSample(completeSample, validSamples) {
        this._printStringRow(this._metricNames.map((_) => ''), '=');
        this._printStringRow(this._metricNames.map(metricName => {
            var samples = validSamples.map(measureValues => measureValues.values[metricName]);
            var mean = Statistic.calculateMean(samples);
            var cv = Statistic.calculateCoefficientOfVariation(samples, mean);
            var formattedMean = ConsoleReporter._formatNum(mean);
            // Note: Don't use the unicode character for +- as it might cause
            // hickups for consoles...
            return NumberWrapper.isNaN(cv) ?
                formattedMean :
                `${formattedMean}+-${Math.floor(cv)}%`;
        }));
        return PromiseWrapper.resolve(null);
    }
    _printStringRow(parts, fill = ' ') {
        this._print(parts.map(part => ConsoleReporter._lpad(part, this._columnWidth, fill)).join(' | '));
    }
}
var _PRINT = new OpaqueToken('ConsoleReporter.print');
var _COLUMN_WIDTH = new OpaqueToken('ConsoleReporter.columnWidth');
var _PROVIDERS = [
    bind(ConsoleReporter)
        .toFactory((columnWidth, sampleDescription, print) => new ConsoleReporter(columnWidth, sampleDescription, print), [_COLUMN_WIDTH, SampleDescription, _PRINT]),
    provide(_COLUMN_WIDTH, { useValue: 18 }),
    provide(_PRINT, { useValue: print })
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc29sZV9yZXBvcnRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImJlbmNocHJlc3Mvc3JjL3JlcG9ydGVyL2NvbnNvbGVfcmVwb3J0ZXIudHMiXSwibmFtZXMiOlsiQ29uc29sZVJlcG9ydGVyIiwiQ29uc29sZVJlcG9ydGVyLmNvbnN0cnVjdG9yIiwiQ29uc29sZVJlcG9ydGVyLlBSSU5UIiwiQ29uc29sZVJlcG9ydGVyLkNPTFVNTl9XSURUSCIsIkNvbnNvbGVSZXBvcnRlci5CSU5ESU5HUyIsIkNvbnNvbGVSZXBvcnRlci5fbHBhZCIsIkNvbnNvbGVSZXBvcnRlci5fZm9ybWF0TnVtIiwiQ29uc29sZVJlcG9ydGVyLl9zb3J0ZWRQcm9wcyIsIkNvbnNvbGVSZXBvcnRlci5fcHJpbnREZXNjcmlwdGlvbiIsIkNvbnNvbGVSZXBvcnRlci5yZXBvcnRNZWFzdXJlVmFsdWVzIiwiQ29uc29sZVJlcG9ydGVyLnJlcG9ydFNhbXBsZSIsIkNvbnNvbGVSZXBvcnRlci5fcHJpbnRTdHJpbmdSb3ciXSwibWFwcGluZ3MiOiJPQUFPLEVBQUMsS0FBSyxFQUFzQixhQUFhLEVBQUMsTUFBTSwwQkFBMEI7T0FDMUUsRUFBQyxnQkFBZ0IsRUFBYyxNQUFNLGdDQUFnQztPQUNyRSxFQUFVLGNBQWMsRUFBQyxNQUFNLDJCQUEyQjtPQUMxRCxFQUFDLElBQUksRUFBQyxNQUFNLDBCQUEwQjtPQUN0QyxFQUFDLElBQUksRUFBRSxPQUFPLEVBQVksV0FBVyxFQUFDLE1BQU0sc0JBQXNCO09BRWxFLEVBQUMsU0FBUyxFQUFDLE1BQU0sY0FBYztPQUMvQixFQUFDLFFBQVEsRUFBQyxNQUFNLGFBQWE7T0FDN0IsRUFBQyxpQkFBaUIsRUFBQyxNQUFNLHVCQUF1QjtBQUd2RDs7R0FFRztBQUNILHFDQUFxQyxRQUFRO0lBNEIzQ0EsWUFBb0JBLFlBQW9CQSxFQUFFQSxpQkFBaUJBLEVBQVVBLE1BQWdCQTtRQUNuRkMsT0FBT0EsQ0FBQ0E7UUFEVUEsaUJBQVlBLEdBQVpB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SUFBSSxVQUFVLEdBQUc7SUFDZixJQUFJLENBQUMsZUFBZSxDQUFDO1NBQ2hCLFNBQVMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxpQkFBaUIsRUFBRSxLQUFLLEtBQ2xDLElBQUksZUFBZSxDQUFDLFdBQVcsRUFBRSxpQkFBaUIsRUFBRSxLQUFLLENBQUMsRUFDOUQsQ0FBQyxhQUFhLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDMUQsT0FBTyxDQUFDLGFBQWEsRUFBRSxFQUFDLFFBQVEsRUFBRSxFQUFFLEVBQUMsQ0FBQztJQUN0QyxPQUFPLENBQUMsTUFBTSxFQUFFLEVBQUMsUUFBUSxFQUFFLEtBQUssRUFBQyxDQUFDO0NBQ25DLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge3ByaW50LCBpc1ByZXNlbnQsIGlzQmxhbmssIE51bWJlcldyYXBwZXJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZyc7XG5pbXBvcnQge1N0cmluZ01hcFdyYXBwZXIsIExpc3RXcmFwcGVyfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2NvbGxlY3Rpb24nO1xuaW1wb3J0IHtQcm9taXNlLCBQcm9taXNlV3JhcHBlcn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9hc3luYyc7XG5pbXBvcnQge01hdGh9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvbWF0aCc7XG5pbXBvcnQge2JpbmQsIHByb3ZpZGUsIFByb3ZpZGVyLCBPcGFxdWVUb2tlbn0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvZGknO1xuXG5pbXBvcnQge1N0YXRpc3RpY30gZnJvbSAnLi4vc3RhdGlzdGljJztcbmltcG9ydCB7UmVwb3J0ZXJ9IGZyb20gJy4uL3JlcG9ydGVyJztcbmltcG9ydCB7U2FtcGxlRGVzY3JpcHRpb259IGZyb20gJy4uL3NhbXBsZV9kZXNjcmlwdGlvbic7XG5pbXBvcnQge01lYXN1cmVWYWx1ZXN9IGZyb20gJy4uL21lYXN1cmVfdmFsdWVzJztcblxuLyoqXG4gKiBBIHJlcG9ydGVyIGZvciB0aGUgY29uc29sZVxuICovXG5leHBvcnQgY2xhc3MgQ29uc29sZVJlcG9ydGVyIGV4dGVuZHMgUmVwb3J0ZXIge1xuICAvLyBUT0RPKHRib3NjaCk6IHVzZSBzdGF0aWMgdmFsdWVzIHdoZW4gb3VyIHRyYW5zcGlsZXIgc3VwcG9ydHMgdGhlbVxuICBzdGF0aWMgZ2V0IFBSSU5UKCk6IE9wYXF1ZVRva2VuIHsgcmV0dXJuIF9QUklOVDsgfVxuICAvLyBUT0RPKHRib3NjaCk6IHVzZSBzdGF0aWMgdmFsdWVzIHdoZW4gb3VyIHRyYW5zcGlsZXIgc3VwcG9ydHMgdGhlbVxuICBzdGF0aWMgZ2V0IENPTFVNTl9XSURUSCgpOiBPcGFxdWVUb2tlbiB7IHJldHVybiBfQ09MVU1OX1dJRFRIOyB9XG4gIC8vIFRPRE8odGJvc2NoKTogdXNlIHN0YXRpYyB2YWx1ZXMgd2hlbiBvdXIgdHJhbnNwaWxlciBzdXBwb3J0cyB0aGVtXG4gIHN0YXRpYyBnZXQgQklORElOR1MoKTogUHJvdmlkZXJbXSB7IHJldHVybiBfUFJPVklERVJTOyB9XG5cblxuICBzdGF0aWMgX2xwYWQodmFsdWUsIGNvbHVtbldpZHRoLCBmaWxsID0gJyAnKSB7XG4gICAgdmFyIHJlc3VsdCA9ICcnO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29sdW1uV2lkdGggLSB2YWx1ZS5sZW5ndGg7IGkrKykge1xuICAgICAgcmVzdWx0ICs9IGZpbGw7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQgKyB2YWx1ZTtcbiAgfVxuXG4gIHN0YXRpYyBfZm9ybWF0TnVtKG4pIHsgcmV0dXJuIE51bWJlcldyYXBwZXIudG9GaXhlZChuLCAyKTsgfVxuXG4gIHN0YXRpYyBfc29ydGVkUHJvcHMob2JqKSB7XG4gICAgdmFyIHByb3BzID0gW107XG4gICAgU3RyaW5nTWFwV3JhcHBlci5mb3JFYWNoKG9iaiwgKHZhbHVlLCBwcm9wKSA9PiBwcm9wcy5wdXNoKHByb3ApKTtcbiAgICBwcm9wcy5zb3J0KCk7XG4gICAgcmV0dXJuIHByb3BzO1xuICB9XG5cbiAgcHJpdmF0ZSBfbWV0cmljTmFtZXM6IHN0cmluZ1tdO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX2NvbHVtbldpZHRoOiBudW1iZXIsIHNhbXBsZURlc2NyaXB0aW9uLCBwcml2YXRlIF9wcmludDogRnVuY3Rpb24pIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuX21ldHJpY05hbWVzID0gQ29uc29sZVJlcG9ydGVyLl9zb3J0ZWRQcm9wcyhzYW1wbGVEZXNjcmlwdGlvbi5tZXRyaWNzKTtcbiAgICB0aGlzLl9wcmludERlc2NyaXB0aW9uKHNhbXBsZURlc2NyaXB0aW9uKTtcbiAgfVxuXG4gIF9wcmludERlc2NyaXB0aW9uKHNhbXBsZURlc2NyaXB0aW9uKSB7XG4gICAgdGhpcy5fcHJpbnQoYEJFTkNITUFSSyAke3NhbXBsZURlc2NyaXB0aW9uLmlkfWApO1xuICAgIHRoaXMuX3ByaW50KCdEZXNjcmlwdGlvbjonKTtcbiAgICB2YXIgcHJvcHMgPSBDb25zb2xlUmVwb3J0ZXIuX3NvcnRlZFByb3BzKHNhbXBsZURlc2NyaXB0aW9uLmRlc2NyaXB0aW9uKTtcbiAgICBwcm9wcy5mb3JFYWNoKChwcm9wKSA9PiB7IHRoaXMuX3ByaW50KGAtICR7cHJvcH06ICR7c2FtcGxlRGVzY3JpcHRpb24uZGVzY3JpcHRpb25bcHJvcF19YCk7IH0pO1xuICAgIHRoaXMuX3ByaW50KCdNZXRyaWNzOicpO1xuICAgIHRoaXMuX21ldHJpY05hbWVzLmZvckVhY2goKG1ldHJpY05hbWUpID0+IHtcbiAgICAgIHRoaXMuX3ByaW50KGAtICR7bWV0cmljTmFtZX06ICR7c2FtcGxlRGVzY3JpcHRpb24ubWV0cmljc1ttZXRyaWNOYW1lXX1gKTtcbiAgICB9KTtcbiAgICB0aGlzLl9wcmludCgnJyk7XG4gICAgdGhpcy5fcHJpbnRTdHJpbmdSb3codGhpcy5fbWV0cmljTmFtZXMpO1xuICAgIHRoaXMuX3ByaW50U3RyaW5nUm93KHRoaXMuX21ldHJpY05hbWVzLm1hcCgoXykgPT4gJycpLCAnLScpO1xuICB9XG5cbiAgcmVwb3J0TWVhc3VyZVZhbHVlcyhtZWFzdXJlVmFsdWVzOiBNZWFzdXJlVmFsdWVzKTogUHJvbWlzZTxhbnk+IHtcbiAgICB2YXIgZm9ybWF0dGVkVmFsdWVzID0gdGhpcy5fbWV0cmljTmFtZXMubWFwKG1ldHJpY05hbWUgPT4ge1xuICAgICAgdmFyIHZhbHVlID0gbWVhc3VyZVZhbHVlcy52YWx1ZXNbbWV0cmljTmFtZV07XG4gICAgICByZXR1cm4gQ29uc29sZVJlcG9ydGVyLl9mb3JtYXROdW0odmFsdWUpO1xuICAgIH0pO1xuICAgIHRoaXMuX3ByaW50U3RyaW5nUm93KGZvcm1hdHRlZFZhbHVlcyk7XG4gICAgcmV0dXJuIFByb21pc2VXcmFwcGVyLnJlc29sdmUobnVsbCk7XG4gIH1cblxuICByZXBvcnRTYW1wbGUoY29tcGxldGVTYW1wbGU6IE1lYXN1cmVWYWx1ZXNbXSwgdmFsaWRTYW1wbGVzOiBNZWFzdXJlVmFsdWVzW10pOiBQcm9taXNlPGFueT4ge1xuICAgIHRoaXMuX3ByaW50U3RyaW5nUm93KHRoaXMuX21ldHJpY05hbWVzLm1hcCgoXykgPT4gJycpLCAnPScpO1xuICAgIHRoaXMuX3ByaW50U3RyaW5nUm93KHRoaXMuX21ldHJpY05hbWVzLm1hcChtZXRyaWNOYW1lID0+IHtcbiAgICAgIHZhciBzYW1wbGVzID0gdmFsaWRTYW1wbGVzLm1hcChtZWFzdXJlVmFsdWVzID0+IG1lYXN1cmVWYWx1ZXMudmFsdWVzW21ldHJpY05hbWVdKTtcbiAgICAgIHZhciBtZWFuID0gU3RhdGlzdGljLmNhbGN1bGF0ZU1lYW4oc2FtcGxlcyk7XG4gICAgICB2YXIgY3YgPSBTdGF0aXN0aWMuY2FsY3VsYXRlQ29lZmZpY2llbnRPZlZhcmlhdGlvbihzYW1wbGVzLCBtZWFuKTtcbiAgICAgIHZhciBmb3JtYXR0ZWRNZWFuID0gQ29uc29sZVJlcG9ydGVyLl9mb3JtYXROdW0obWVhbilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE5vdGU6IERvbid0IHVzZSB0aGUgdW5pY29kZSBjaGFyYWN0ZXIgZm9yICstIGFzIGl0IG1pZ2h0IGNhdXNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBoaWNrdXBzIGZvciBjb25zb2xlcy4uLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIE51bWJlcldyYXBwZXIuaXNOYU4oY3YpID9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcm1hdHRlZE1lYW4gOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYCR7Zm9ybWF0dGVkTWVhbn0rLSR7TWF0aC5mbG9vcihjdil9JWA7XG4gICAgfSkpO1xuICAgIHJldHVybiBQcm9taXNlV3JhcHBlci5yZXNvbHZlKG51bGwpO1xuICB9XG5cbiAgX3ByaW50U3RyaW5nUm93KHBhcnRzOiBhbnlbXSwgZmlsbCA9ICcgJykge1xuICAgIHRoaXMuX3ByaW50KFxuICAgICAgICBwYXJ0cy5tYXAocGFydCA9PiBDb25zb2xlUmVwb3J0ZXIuX2xwYWQocGFydCwgdGhpcy5fY29sdW1uV2lkdGgsIGZpbGwpKS5qb2luKCcgfCAnKSk7XG4gIH1cbn1cblxudmFyIF9QUklOVCA9IG5ldyBPcGFxdWVUb2tlbignQ29uc29sZVJlcG9ydGVyLnByaW50Jyk7XG52YXIgX0NPTFVNTl9XSURUSCA9IG5ldyBPcGFxdWVUb2tlbignQ29uc29sZVJlcG9ydGVyLmNvbHVtbldpZHRoJyk7XG52YXIgX1BST1ZJREVSUyA9IFtcbiAgYmluZChDb25zb2xlUmVwb3J0ZXIpXG4gICAgICAudG9GYWN0b3J5KChjb2x1bW5XaWR0aCwgc2FtcGxlRGVzY3JpcHRpb24sIHByaW50KSA9PlxuICAgICAgICAgICAgICAgICAgICAgbmV3IENvbnNvbGVSZXBvcnRlcihjb2x1bW5XaWR0aCwgc2FtcGxlRGVzY3JpcHRpb24sIHByaW50KSxcbiAgICAgICAgICAgICAgICAgW19DT0xVTU5fV0lEVEgsIFNhbXBsZURlc2NyaXB0aW9uLCBfUFJJTlRdKSxcbiAgcHJvdmlkZShfQ09MVU1OX1dJRFRILCB7dXNlVmFsdWU6IDE4fSksXG4gIHByb3ZpZGUoX1BSSU5ULCB7dXNlVmFsdWU6IHByaW50fSlcbl07XG4iXX0=