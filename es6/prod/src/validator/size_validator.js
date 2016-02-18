import { ListWrapper } from 'angular2/src/facade/collection';
import { bind, provide, OpaqueToken } from 'angular2/src/core/di';
import { Validator } from '../validator';
/**
 * A validator that waits for the sample to have a certain size.
 */
export class SizeValidator extends Validator {
    constructor(size) {
        super();
        this._sampleSize = size;
    }
    // TODO(tbosch): use static values when our transpiler supports them
    static get BINDINGS() { return _PROVIDERS; }
    // TODO(tbosch): use static values when our transpiler supports them
    static get SAMPLE_SIZE() { return _SAMPLE_SIZE; }
    describe() { return { 'sampleSize': this._sampleSize }; }
    validate(completeSample) {
        if (completeSample.length >= this._sampleSize) {
            return ListWrapper.slice(completeSample, completeSample.length - this._sampleSize, completeSample.length);
        }
        else {
            return null;
        }
    }
}
var _SAMPLE_SIZE = new OpaqueToken('SizeValidator.sampleSize');
var _PROVIDERS = [
    bind(SizeValidator)
        .toFactory((size) => new SizeValidator(size), [_SAMPLE_SIZE]),
    provide(_SAMPLE_SIZE, { useValue: 10 })
];
