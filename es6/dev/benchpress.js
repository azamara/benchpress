/// <reference path="../angular2/typings/node/node.d.ts" />
import { bind } from 'angular2/src/core/di';
import { Options } from './common';
export * from './common';
export { SeleniumWebDriverAdapter } from './src/webdriver/selenium_webdriver_adapter';
var fs = require('fs');
// TODO(tbosch): right now we bind the `writeFile` method
// in benchpres/benchpress.es6. This does not work for Dart,
// find another way...
// Note: Can't do the `require` call in a facade as it can't be loaded into the browser
// for our unit tests via karma.
Options.DEFAULT_PROVIDERS.push(bind(Options.WRITE_FILE).toValue(writeFile));
function writeFile(filename, content) {
    return new Promise(function (resolve, reject) {
        fs.writeFile(filename, content, (error) => {
            if (error) {
                reject(error);
            }
            else {
                resolve();
            }
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmVuY2hwcmVzcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImJlbmNocHJlc3MvYmVuY2hwcmVzcy50cyJdLCJuYW1lcyI6WyJ3cml0ZUZpbGUiXSwibWFwcGluZ3MiOiJBQUFBLDJEQUEyRDtPQUVwRCxFQUFDLElBQUksRUFBVSxNQUFNLHNCQUFzQjtPQUMzQyxFQUFDLE9BQU8sRUFBQyxNQUFNLFVBQVU7QUFFaEMsY0FBYyxVQUFVLENBQUM7QUFDekIsU0FBUSx3QkFBd0IsUUFBTyw0Q0FBNEMsQ0FBQztBQUVwRixJQUFJLEVBQUUsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7QUFFdkIseURBQXlEO0FBQ3pELDREQUE0RDtBQUM1RCxzQkFBc0I7QUFDdEIsdUZBQXVGO0FBQ3ZGLGdDQUFnQztBQUNoQyxPQUFPLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7QUFFNUUsbUJBQW1CLFFBQVEsRUFBRSxPQUFPO0lBQ2xDQSxNQUFNQSxDQUFDQSxJQUFJQSxPQUFPQSxDQUFDQSxVQUFTQSxPQUFPQSxFQUFFQSxNQUFNQTtRQUN6QyxFQUFFLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsQ0FBQyxLQUFLO1lBQ3BDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ1YsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ2hCLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDTixPQUFPLEVBQUUsQ0FBQztZQUNaLENBQUM7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQ0EsQ0FBQUE7QUFDSkEsQ0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vYW5ndWxhcjIvdHlwaW5ncy9ub2RlL25vZGUuZC50c1wiIC8+XG5cbmltcG9ydCB7YmluZCwgcHJvdmlkZX0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvZGknO1xuaW1wb3J0IHtPcHRpb25zfSBmcm9tICcuL2NvbW1vbic7XG5cbmV4cG9ydCAqIGZyb20gJy4vY29tbW9uJztcbmV4cG9ydCB7U2VsZW5pdW1XZWJEcml2ZXJBZGFwdGVyfSBmcm9tICcuL3NyYy93ZWJkcml2ZXIvc2VsZW5pdW1fd2ViZHJpdmVyX2FkYXB0ZXInO1xuXG52YXIgZnMgPSByZXF1aXJlKCdmcycpO1xuXG4vLyBUT0RPKHRib3NjaCk6IHJpZ2h0IG5vdyB3ZSBiaW5kIHRoZSBgd3JpdGVGaWxlYCBtZXRob2Rcbi8vIGluIGJlbmNocHJlcy9iZW5jaHByZXNzLmVzNi4gVGhpcyBkb2VzIG5vdCB3b3JrIGZvciBEYXJ0LFxuLy8gZmluZCBhbm90aGVyIHdheS4uLlxuLy8gTm90ZTogQ2FuJ3QgZG8gdGhlIGByZXF1aXJlYCBjYWxsIGluIGEgZmFjYWRlIGFzIGl0IGNhbid0IGJlIGxvYWRlZCBpbnRvIHRoZSBicm93c2VyXG4vLyBmb3Igb3VyIHVuaXQgdGVzdHMgdmlhIGthcm1hLlxuT3B0aW9ucy5ERUZBVUxUX1BST1ZJREVSUy5wdXNoKGJpbmQoT3B0aW9ucy5XUklURV9GSUxFKS50b1ZhbHVlKHdyaXRlRmlsZSkpO1xuXG5mdW5jdGlvbiB3cml0ZUZpbGUoZmlsZW5hbWUsIGNvbnRlbnQpOiBQcm9taXNlPGFueT4ge1xuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgZnMud3JpdGVGaWxlKGZpbGVuYW1lLCBjb250ZW50LCAoZXJyb3IpID0+IHtcbiAgICAgIGlmIChlcnJvcikge1xuICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9KVxufVxuIl19