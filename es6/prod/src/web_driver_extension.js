import { bind, Injector, OpaqueToken } from 'angular2/src/core/di';
import { isBlank } from 'angular2/src/facade/lang';
import { BaseException } from 'angular2/src/facade/exceptions';
import { Options } from './common_options';
/**
 * A WebDriverExtension implements extended commands of the webdriver protocol
 * for a given browser, independent of the WebDriverAdapter.
 * Needs one implementation for every supported Browser.
 */
export class WebDriverExtension {
    static bindTo(childTokens) {
        var res = [
            bind(_CHILDREN)
                .toFactory((injector) => childTokens.map(token => injector.get(token)), [Injector]),
            bind(WebDriverExtension)
                .toFactory((children, capabilities) => {
                var delegate;
                children.forEach(extension => {
                    if (extension.supports(capabilities)) {
                        delegate = extension;
                    }
                });
                if (isBlank(delegate)) {
                    throw new BaseException('Could not find a delegate for given capabilities!');
                }
                return delegate;
            }, [_CHILDREN, Options.CAPABILITIES])
        ];
        return res;
    }
    gc() { throw new BaseException('NYI'); }
    timeBegin(name) { throw new BaseException('NYI'); }
    timeEnd(name, restartName) { throw new BaseException('NYI'); }
    /**
     * Format:
     * - cat: category of the event
     * - name: event name: 'script', 'gc', 'render', ...
     * - ph: phase: 'B' (begin), 'E' (end), 'b' (nestable start), 'e' (nestable end), 'X' (Complete
     *event)
     * - ts: timestamp in ms, e.g. 12345
     * - pid: process id
     * - args: arguments, e.g. {heapSize: 1234}
     *
     * Based on [Chrome Trace Event
     *Format](https://docs.google.com/document/d/1CvAClvFfyA5R-PhYUmn5OOQtYMH4h6I0nSsKchNAySU/edit)
     **/
    readPerfLog() { throw new BaseException('NYI'); }
    perfLogFeatures() { throw new BaseException('NYI'); }
    supports(capabilities) { return true; }
}
export class PerfLogFeatures {
    constructor({ render = false, gc = false, frameCapture = false, userTiming = false } = {}) {
        this.render = render;
        this.gc = gc;
        this.frameCapture = frameCapture;
        this.userTiming = userTiming;
    }
}
var _CHILDREN = new OpaqueToken('WebDriverExtension.children');
