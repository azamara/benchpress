import { bind } from 'angular2/src/core/di';
import { isPresent, StringWrapper } from 'angular2/src/facade/lang';
import { WebDriverExtension, PerfLogFeatures } from '../web_driver_extension';
import { WebDriverAdapter } from '../web_driver_adapter';
export class FirefoxDriverExtension extends WebDriverExtension {
    constructor(_driver) {
        super();
        this._driver = _driver;
        this._profilerStarted = false;
    }
    static get BINDINGS() { return _PROVIDERS; }
    gc() { return this._driver.executeScript('window.forceGC()'); }
    timeBegin(name) {
        if (!this._profilerStarted) {
            this._profilerStarted = true;
            this._driver.executeScript('window.startProfiler();');
        }
        return this._driver.executeScript('window.markStart("' + name + '");');
    }
    timeEnd(name, restartName = null) {
        var script = 'window.markEnd("' + name + '");';
        if (isPresent(restartName)) {
            script += 'window.markStart("' + restartName + '");';
        }
        return this._driver.executeScript(script);
    }
    readPerfLog() {
        return this._driver.executeAsyncScript('var cb = arguments[0]; window.getProfile(cb);');
    }
    perfLogFeatures() { return new PerfLogFeatures({ render: true, gc: true }); }
    supports(capabilities) {
        return StringWrapper.equals(capabilities['browserName'].toLowerCase(), 'firefox');
    }
}
var _PROVIDERS = [
    bind(FirefoxDriverExtension)
        .toFactory((driver) => new FirefoxDriverExtension(driver), [WebDriverAdapter])
];
