import { bind } from 'angular2/src/core/di';
import { BaseException } from 'angular2/src/facade/exceptions';
/**
 * A metric is measures values
 */
export class Metric {
    static bindTo(delegateToken) {
        return [bind(Metric).toFactory((delegate) => delegate, [delegateToken])];
    }
    /**
     * Starts measuring
     */
    beginMeasure() { throw new BaseException('NYI'); }
    /**
     * Ends measuring and reports the data
     * since the begin call.
     * @param restart: Whether to restart right after this.
     */
    endMeasure(restart) { throw new BaseException('NYI'); }
    /**
     * Describes the metrics provided by this metric implementation.
     * (e.g. units, ...)
     */
    describe() { throw new BaseException('NYI'); }
}
