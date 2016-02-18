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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZW5pdW1fd2ViZHJpdmVyX2FkYXB0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJiZW5jaHByZXNzL3NyYy93ZWJkcml2ZXIvc2VsZW5pdW1fd2ViZHJpdmVyX2FkYXB0ZXIudHMiXSwibmFtZXMiOlsiU2VsZW5pdW1XZWJEcml2ZXJBZGFwdGVyIiwiU2VsZW5pdW1XZWJEcml2ZXJBZGFwdGVyLmNvbnN0cnVjdG9yIiwiU2VsZW5pdW1XZWJEcml2ZXJBZGFwdGVyLlBST1RSQUNUT1JfQklORElOR1MiLCJTZWxlbml1bVdlYkRyaXZlckFkYXB0ZXIuX2NvbnZlcnRQcm9taXNlIiwiU2VsZW5pdW1XZWJEcml2ZXJBZGFwdGVyLndhaXRGb3IiLCJTZWxlbml1bVdlYkRyaXZlckFkYXB0ZXIuZXhlY3V0ZVNjcmlwdCIsIlNlbGVuaXVtV2ViRHJpdmVyQWRhcHRlci5leGVjdXRlQXN5bmNTY3JpcHQiLCJTZWxlbml1bVdlYkRyaXZlckFkYXB0ZXIuY2FwYWJpbGl0aWVzIiwiU2VsZW5pdW1XZWJEcml2ZXJBZGFwdGVyLmxvZ3MiLCJjb252ZXJ0VG9Mb2NhbFByb2Nlc3MiXSwibWFwcGluZ3MiOiJPQUFPLEVBQVUsY0FBYyxFQUFDLE1BQU0sMkJBQTJCO09BQzFELEVBQUMsSUFBSSxFQUFvQixNQUFNLHNCQUFzQjtPQUNyRCxFQUFDLGdCQUFnQixFQUFDLE1BQU0sdUJBQXVCO09BRS9DLEtBQUssU0FBUyxNQUFNLG9CQUFvQjtBQUUvQzs7R0FFRztBQUNILDhDQUE4QyxnQkFBZ0I7SUFHNURBLFlBQW9CQSxPQUFZQTtRQUFJQyxPQUFPQSxDQUFDQTtRQUF4QkEsWUFBT0EsR0FBUEEsT0FBT0EsQ0FBS0E7SUFBYUEsQ0FBQ0E7SUFGOUNELFdBQVdBLG1CQUFtQkEsS0FBaUJFLE1BQU1BLENBQUNBLG9CQUFvQkEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7SUFJN0VGLGVBQWVBLENBQUNBLFFBQVFBO1FBQ3RCRyxJQUFJQSxTQUFTQSxHQUFHQSxjQUFjQSxDQUFDQSxTQUFTQSxFQUFFQSxDQUFDQTtRQUMzQ0EsUUFBUUEsQ0FBQ0EsSUFBSUE7UUFDVEEsa0RBQWtEQTtRQUNsREEsMkRBQTJEQTtRQUMzREEsc0NBQXNDQTtRQUN0Q0EsS0FBQ0EsSUFBSUEsS0FBS0EsU0FBU0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EscUJBQXFCQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxFQUFFQSxTQUFTQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQTtRQUNoRkEsTUFBTUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsT0FBT0EsQ0FBQ0E7SUFDM0JBLENBQUNBO0lBR0dILE9BQU9BLENBQUNBLFFBQVFBO1FBQ2xCSSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxlQUFlQSxDQUFDQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxXQUFXQSxFQUFFQSxDQUFDQSxPQUFPQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQSxDQUFDQTtJQUM1RUEsQ0FBQ0E7SUFFREosYUFBYUEsQ0FBQ0EsTUFBY0E7UUFDMUJLLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLGVBQWVBLENBQUNBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLGFBQWFBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBO0lBQ2xFQSxDQUFDQTtJQUVETCxrQkFBa0JBLENBQUNBLE1BQWNBO1FBQy9CTSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxlQUFlQSxDQUFDQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxrQkFBa0JBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBO0lBQ3ZFQSxDQUFDQTtJQUVETixZQUFZQTtRQUNWTyxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxlQUFlQSxDQUN2QkEsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsZUFBZUEsRUFBRUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsVUFBVUEsS0FBS0EsVUFBVUEsQ0FBQ0EsU0FBU0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7SUFDbkZBLENBQUNBO0lBRURQLElBQUlBLENBQUNBLElBQVlBO1FBQ2ZRLGdEQUFnREE7UUFDaERBLHdEQUF3REE7UUFDeERBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLGVBQWVBLENBQUNBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLFFBQVFBLENBQzdDQSxJQUFJQSxTQUFTQSxDQUFDQSxPQUFPQSxDQUFDQSxTQUFTQSxDQUFDQSxXQUFXQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQSxZQUFZQSxDQUFDQSxNQUFNQSxFQUFFQSxJQUFJQSxDQUFDQSxFQUMvRUEsZ0NBQWdDQSxHQUFHQSxJQUFJQSxHQUFHQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQTtJQUN0REEsQ0FBQ0E7QUFDSFIsQ0FBQ0E7QUFFRCwrQkFBK0IsSUFBSTtJQUNqQ1MsSUFBSUEsVUFBVUEsR0FBR0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7SUFDdENBLEVBQUVBLENBQUNBLENBQUNBLEVBQUVBLEdBQUdBLFVBQVVBLEtBQUtBLFdBQVdBLENBQUNBLENBQUNBLENBQUNBO1FBQ3BDQSxNQUFNQSxDQUFDQSxTQUFTQSxDQUFDQTtJQUNuQkEsQ0FBQ0E7SUFDREEsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsVUFBVUEsQ0FBQ0EsQ0FBQ0E7QUFDaENBLENBQUNBO0FBRUQsSUFBSSxvQkFBb0IsR0FBRztJQUN6QixJQUFJLENBQUMsZ0JBQWdCLENBQUM7U0FDakIsU0FBUyxDQUFDLE1BQU0sSUFBSSx3QkFBd0IsQ0FBTyxNQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxDQUFDO0NBQzlFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1Byb21pc2UsIFByb21pc2VXcmFwcGVyfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2FzeW5jJztcbmltcG9ydCB7YmluZCwgcHJvdmlkZSwgUHJvdmlkZXJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL2RpJztcbmltcG9ydCB7V2ViRHJpdmVyQWRhcHRlcn0gZnJvbSAnLi4vd2ViX2RyaXZlcl9hZGFwdGVyJztcblxuaW1wb3J0ICogYXMgd2ViZHJpdmVyIGZyb20gJ3NlbGVuaXVtLXdlYmRyaXZlcic7XG5cbi8qKlxuICogQWRhcHRlciBmb3IgdGhlIHNlbGVuaXVtLXdlYmRyaXZlci5cbiAqL1xuZXhwb3J0IGNsYXNzIFNlbGVuaXVtV2ViRHJpdmVyQWRhcHRlciBleHRlbmRzIFdlYkRyaXZlckFkYXB0ZXIge1xuICBzdGF0aWMgZ2V0IFBST1RSQUNUT1JfQklORElOR1MoKTogUHJvdmlkZXJbXSB7IHJldHVybiBfUFJPVFJBQ1RPUl9CSU5ESU5HUzsgfVxuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX2RyaXZlcjogYW55KSB7IHN1cGVyKCk7IH1cblxuICBfY29udmVydFByb21pc2UodGhlbmFibGUpIHtcbiAgICB2YXIgY29tcGxldGVyID0gUHJvbWlzZVdyYXBwZXIuY29tcGxldGVyKCk7XG4gICAgdGhlbmFibGUudGhlbihcbiAgICAgICAgLy8gc2VsZW5pdW0td2ViZHJpdmVyIHVzZXMgYW4gb3duIE5vZGUuanMgY29udGV4dCxcbiAgICAgICAgLy8gc28gd2UgbmVlZCB0byBjb252ZXJ0IGRhdGEgaW50byBvYmplY3RzIG9mIHRoaXMgY29udGV4dC5cbiAgICAgICAgLy8gUHJldmlvdXNseSBuZWVkZWQgZm9yIHJ0dHNfYXNzZXJ0cy5cbiAgICAgICAgKGRhdGEpID0+IGNvbXBsZXRlci5yZXNvbHZlKGNvbnZlcnRUb0xvY2FsUHJvY2VzcyhkYXRhKSksIGNvbXBsZXRlci5yZWplY3QpO1xuICAgIHJldHVybiBjb21wbGV0ZXIucHJvbWlzZTtcbiAgfVxuICBiXG5cbiAgICAgIHdhaXRGb3IoY2FsbGJhY2spOiBQcm9taXNlPGFueT4ge1xuICAgIHJldHVybiB0aGlzLl9jb252ZXJ0UHJvbWlzZSh0aGlzLl9kcml2ZXIuY29udHJvbEZsb3coKS5leGVjdXRlKGNhbGxiYWNrKSk7XG4gIH1cblxuICBleGVjdXRlU2NyaXB0KHNjcmlwdDogc3RyaW5nKTogUHJvbWlzZTxhbnk+IHtcbiAgICByZXR1cm4gdGhpcy5fY29udmVydFByb21pc2UodGhpcy5fZHJpdmVyLmV4ZWN1dGVTY3JpcHQoc2NyaXB0KSk7XG4gIH1cblxuICBleGVjdXRlQXN5bmNTY3JpcHQoc2NyaXB0OiBzdHJpbmcpOiBQcm9taXNlPGFueT4ge1xuICAgIHJldHVybiB0aGlzLl9jb252ZXJ0UHJvbWlzZSh0aGlzLl9kcml2ZXIuZXhlY3V0ZUFzeW5jU2NyaXB0KHNjcmlwdCkpO1xuICB9XG5cbiAgY2FwYWJpbGl0aWVzKCk6IFByb21pc2U8YW55PiB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbnZlcnRQcm9taXNlKFxuICAgICAgICB0aGlzLl9kcml2ZXIuZ2V0Q2FwYWJpbGl0aWVzKCkudGhlbigoY2Fwc09iamVjdCkgPT4gY2Fwc09iamVjdC5zZXJpYWxpemUoKSkpO1xuICB9XG5cbiAgbG9ncyh0eXBlOiBzdHJpbmcpOiBQcm9taXNlPGFueT4ge1xuICAgIC8vIE5lZWRlZCBhcyBzZWxlbml1bS13ZWJkcml2ZXIgZG9lcyBub3QgZm9yd2FyZFxuICAgIC8vIHBlcmZvcm1hbmNlIGxvZ3MgaW4gdGhlIGNvcnJlY3Qgd2F5IHZpYSBtYW5hZ2UoKS5sb2dzXG4gICAgcmV0dXJuIHRoaXMuX2NvbnZlcnRQcm9taXNlKHRoaXMuX2RyaXZlci5zY2hlZHVsZShcbiAgICAgICAgbmV3IHdlYmRyaXZlci5Db21tYW5kKHdlYmRyaXZlci5Db21tYW5kTmFtZS5HRVRfTE9HKS5zZXRQYXJhbWV0ZXIoJ3R5cGUnLCB0eXBlKSxcbiAgICAgICAgJ1dlYkRyaXZlci5tYW5hZ2UoKS5sb2dzKCkuZ2V0KCcgKyB0eXBlICsgJyknKSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gY29udmVydFRvTG9jYWxQcm9jZXNzKGRhdGEpOiBPYmplY3Qge1xuICB2YXIgc2VyaWFsaXplZCA9IEpTT04uc3RyaW5naWZ5KGRhdGEpO1xuICBpZiAoJycgKyBzZXJpYWxpemVkID09PSAndW5kZWZpbmVkJykge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbiAgcmV0dXJuIEpTT04ucGFyc2Uoc2VyaWFsaXplZCk7XG59XG5cbnZhciBfUFJPVFJBQ1RPUl9CSU5ESU5HUyA9IFtcbiAgYmluZChXZWJEcml2ZXJBZGFwdGVyKVxuICAgICAgLnRvRmFjdG9yeSgoKSA9PiBuZXcgU2VsZW5pdW1XZWJEcml2ZXJBZGFwdGVyKCg8YW55Pmdsb2JhbCkuYnJvd3NlciksIFtdKVxuXTtcbiJdfQ==