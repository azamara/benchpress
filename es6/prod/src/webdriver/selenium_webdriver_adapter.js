import { PromiseWrapper } from 'angular2/src/facade/async';
import { bind } from 'angular2/src/core/di';
import { WebDriverAdapter } from '../web_driver_adapter';
import * as webdriver from 'selenium-webdriver';
/**
 * Adapter for the selenium-webdriver.
 */
export class SeleniumWebDriverAdapter extends WebDriverAdapter {
    constructor(_driver) {
        super();
        this._driver = _driver;
    }
    static get PROTRACTOR_BINDINGS() { return _PROTRACTOR_BINDINGS; }
    _convertPromise(thenable) {
        var completer = PromiseWrapper.completer();
        thenable.then(
        // selenium-webdriver uses an own Node.js context,
        // so we need to convert data into objects of this context.
        // Previously needed for rtts_asserts.
            (data) => completer.resolve(convertToLocalProcess(data)), completer.reject);
        return completer.promise;
    }
    waitFor(callback) {
        return this._convertPromise(this._driver.controlFlow().execute(callback));
    }
    executeScript(script) {
        return this._convertPromise(this._driver.executeScript(script));
    }
    executeAsyncScript(script) {
        return this._convertPromise(this._driver.executeAsyncScript(script));
    }
    capabilities() {
        return this._convertPromise(this._driver.getCapabilities().then((capsObject) => capsObject.serialize()));
    }
    logs(type) {
        // Needed as selenium-webdriver does not forward
        // performance logs in the correct way via manage().logs
        return this._convertPromise(this._driver.schedule(new webdriver.Command(webdriver.CommandName.GET_LOG).setParameter('type', type), 'WebDriver.manage().logs().get(' + type + ')'));
    }
}
function convertToLocalProcess(data) {
    var serialized = JSON.stringify(data);
    if ('' + serialized === 'undefined') {
        return undefined;
    }
    return JSON.parse(serialized);
}
var _PROTRACTOR_BINDINGS = [
    bind(WebDriverAdapter)
        .toFactory(() => new SeleniumWebDriverAdapter(global.browser), [])
];
