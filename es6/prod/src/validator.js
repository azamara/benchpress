import { bind } from 'angular2/src/core/di';
import { BaseException } from 'angular2/src/facade/exceptions';
/**
 * A Validator calculates a valid sample out of the complete sample.
 * A valid sample is a sample that represents the population that should be observed
 * in the correct way.
 */
export class Validator {
    static bindTo(delegateToken) {
        return [bind(Validator).toFactory((delegate) => delegate, [delegateToken])];
    }
    /**
     * Calculates a valid sample out of the complete sample
     */
    validate(completeSample) { throw new BaseException('NYI'); }
    /**
     * Returns a Map that describes the properties of the validator
     * (e.g. sample size, ...)
     */
    describe() { throw new BaseException('NYI'); }
}
