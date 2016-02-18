import { bind } from 'angular2/src/core/di';
import { BaseException } from 'angular2/src/facade/exceptions';
/**
 * A reporter reports measure values and the valid sample.
 */
export class Reporter {
    static bindTo(delegateToken) {
        return [bind(Reporter).toFactory((delegate) => delegate, [delegateToken])];
    }
    reportMeasureValues(values) { throw new BaseException('NYI'); }
    reportSample(completeSample, validSample) {
        throw new BaseException('NYI');
    }
}
