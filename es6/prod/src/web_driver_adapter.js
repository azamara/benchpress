import { bind } from 'angular2/src/core/di';
import { BaseException } from 'angular2/src/facade/exceptions';
/**
 * A WebDriverAdapter bridges API differences between different WebDriver clients,
 * e.g. JS vs Dart Async vs Dart Sync webdriver.
 * Needs one implementation for every supported WebDriver client.
 */
export class WebDriverAdapter {
    static bindTo(delegateToken) {
        return [bind(WebDriverAdapter).toFactory((delegate) => delegate, [delegateToken])];
    }
    waitFor(callback) { throw new BaseException('NYI'); }
    executeScript(script) { throw new BaseException('NYI'); }
    executeAsyncScript(script) { throw new BaseException('NYI'); }
    capabilities() { throw new BaseException('NYI'); }
    logs(type) { throw new BaseException('NYI'); }
}
