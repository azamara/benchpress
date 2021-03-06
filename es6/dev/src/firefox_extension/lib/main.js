/// <reference path="../../../../angular2/typings/node/node.d.ts" />
var { Cc, Ci, Cu } = require('chrome');
var os = Cc['@mozilla.org/observer-service;1'].getService(Ci.nsIObserverService);
var ParserUtil = require('./parser_util');
class Profiler {
    constructor() {
        this._profiler = Cc['@mozilla.org/tools/profiler;1'].getService(Ci.nsIProfiler);
    }
    start(entries, interval, features, timeStarted) {
        this._profiler.StartProfiler(entries, interval, features, features.length);
        this._profilerStartTime = timeStarted;
        this._markerEvents = [];
    }
    stop() { this._profiler.StopProfiler(); }
    getProfilePerfEvents() {
        var profileData = this._profiler.getProfileData();
        var perfEvents = ParserUtil.convertPerfProfileToEvents(profileData);
        perfEvents = this._mergeMarkerEvents(perfEvents);
        perfEvents.sort(function (event1, event2) { return event1.ts - event2.ts; }); // Sort by ts
        return perfEvents;
    }
    _mergeMarkerEvents(perfEvents) {
        this._markerEvents.forEach(function (markerEvent) { perfEvents.push(markerEvent); });
        return perfEvents;
    }
    addStartEvent(name, timeStarted) {
        this._markerEvents.push({ ph: 'b', ts: timeStarted - this._profilerStartTime, name: name });
    }
    addEndEvent(name, timeEnded) {
        this._markerEvents.push({ ph: 'e', ts: timeEnded - this._profilerStartTime, name: name });
    }
}
function forceGC() {
    Cu.forceGC();
    os.notifyObservers(null, 'child-gc-request', null);
}
;
var mod = require('sdk/page-mod');
var data = require('sdk/self').data;
var profiler = new Profiler();
mod.PageMod({
    include: ['*'],
    contentScriptFile: data.url('installed_script.js'),
    onAttach: worker => {
        worker.port.on('startProfiler', (timeStarted) => profiler.start(/* = profiler memory */ 3000000, 0.1, ['leaf', 'js', 'stackwalk', 'gc'], timeStarted));
        worker.port.on('stopProfiler', () => profiler.stop());
        worker.port.on('getProfile', () => worker.port.emit('perfProfile', profiler.getProfilePerfEvents()));
        worker.port.on('forceGC', forceGC);
        worker.port.on('markStart', (name, timeStarted) => profiler.addStartEvent(name, timeStarted));
        worker.port.on('markEnd', (name, timeEnded) => profiler.addEndEvent(name, timeEnded));
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImJlbmNocHJlc3Mvc3JjL2ZpcmVmb3hfZXh0ZW5zaW9uL2xpYi9tYWluLnRzIl0sIm5hbWVzIjpbIlByb2ZpbGVyIiwiUHJvZmlsZXIuY29uc3RydWN0b3IiLCJQcm9maWxlci5zdGFydCIsIlByb2ZpbGVyLnN0b3AiLCJQcm9maWxlci5nZXRQcm9maWxlUGVyZkV2ZW50cyIsIlByb2ZpbGVyLl9tZXJnZU1hcmtlckV2ZW50cyIsIlByb2ZpbGVyLmFkZFN0YXJ0RXZlbnQiLCJQcm9maWxlci5hZGRFbmRFdmVudCIsImZvcmNlR0MiXSwibWFwcGluZ3MiOiJBQUFBLG9FQUFvRTtBQUVwRSxJQUFJLEVBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUMsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDckMsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLGlDQUFpQyxDQUFDLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBQ2pGLElBQUksVUFBVSxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUUxQztJQUtFQTtRQUFnQkMsSUFBSUEsQ0FBQ0EsU0FBU0EsR0FBR0EsRUFBRUEsQ0FBQ0EsK0JBQStCQSxDQUFDQSxDQUFDQSxVQUFVQSxDQUFDQSxFQUFFQSxDQUFDQSxXQUFXQSxDQUFDQSxDQUFDQTtJQUFDQSxDQUFDQTtJQUVsR0QsS0FBS0EsQ0FBQ0EsT0FBT0EsRUFBRUEsUUFBUUEsRUFBRUEsUUFBUUEsRUFBRUEsV0FBV0E7UUFDNUNFLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLGFBQWFBLENBQUNBLE9BQU9BLEVBQUVBLFFBQVFBLEVBQUVBLFFBQVFBLEVBQUVBLFFBQVFBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBO1FBQzNFQSxJQUFJQSxDQUFDQSxrQkFBa0JBLEdBQUdBLFdBQVdBLENBQUNBO1FBQ3RDQSxJQUFJQSxDQUFDQSxhQUFh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LE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLFlBQVksRUFDWixNQUFNLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxRQUFRLENBQUMsb0JBQW9CLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDdkYsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ25DLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFDLElBQUksRUFBRSxXQUFXLEtBQUssUUFBUSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQztRQUM5RixNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxJQUFJLEVBQUUsU0FBUyxLQUFLLFFBQVEsQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUM7SUFDeEYsQ0FBQztDQUNGLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi8uLi8uLi9hbmd1bGFyMi90eXBpbmdzL25vZGUvbm9kZS5kLnRzXCIgLz5cblxudmFyIHtDYywgQ2ksIEN1fSA9IHJlcXVpcmUoJ2Nocm9tZScpO1xudmFyIG9zID0gQ2NbJ0Btb3ppbGxhLm9yZy9vYnNlcnZlci1zZXJ2aWNlOzEnXS5nZXRTZXJ2aWNlKENpLm5zSU9ic2VydmVyU2VydmljZSk7XG52YXIgUGFyc2VyVXRpbCA9IHJlcXVpcmUoJy4vcGFyc2VyX3V0aWwnKTtcblxuY2xhc3MgUHJvZmlsZXIge1xuICBwcml2YXRlIF9wcm9maWxlcjtcbiAgcHJpdmF0ZSBfbWFya2VyRXZlbnRzOiBhbnlbXTtcbiAgcHJpdmF0ZSBfcHJvZmlsZXJTdGFydFRpbWU6IG51bWJlcjtcblxuICBjb25zdHJ1Y3RvcigpIHsgdGhpcy5fcHJvZmlsZXIgPSBDY1snQG1vemlsbGEub3JnL3Rvb2xzL3Byb2ZpbGVyOzEnXS5nZXRTZXJ2aWNlKENpLm5zSVByb2ZpbGVyKTsgfVxuXG4gIHN0YXJ0KGVudHJpZXMsIGludGVydmFsLCBmZWF0dXJlcywgdGltZVN0YXJ0ZWQpIHtcbiAgICB0aGlzLl9wcm9maWxlci5TdGFydFByb2ZpbGVyKGVudHJpZXMsIGludGVydmFsLCBmZWF0dXJlcywgZmVhdHVyZXMubGVuZ3RoKTtcbiAgICB0aGlzLl9wcm9maWxlclN0YXJ0VGltZSA9IHRpbWVTdGFydGVkO1xuICAgIHRoaXMuX21hcmtlckV2ZW50cyA9IFtdO1xuICB9XG5cbiAgc3RvcCgpIHsgdGhpcy5fcHJvZmlsZXIuU3RvcFByb2ZpbGVyKCk7IH1cblxuICBnZXRQcm9maWxlUGVyZkV2ZW50cygpIHtcbiAgICB2YXIgcHJvZmlsZURhdGEgPSB0aGlzLl9wcm9maWxlci5nZXRQcm9maWxlRGF0YSgpO1xuICAgIHZhciBwZXJmRXZlbnRzID0gUGFyc2VyVXRpbC5jb252ZXJ0UGVyZlByb2ZpbGVUb0V2ZW50cyhwcm9maWxlRGF0YSk7XG4gICAgcGVyZkV2ZW50cyA9IHRoaXMuX21lcmdlTWFya2VyRXZlbnRzKHBlcmZFdmVudHMpO1xuICAgIHBlcmZFdmVudHMuc29ydChmdW5jdGlvbihldmVudDEsIGV2ZW50MikgeyByZXR1cm4gZXZlbnQxLnRzIC0gZXZlbnQyLnRzOyB9KTsgIC8vIFNvcnQgYnkgdHNcbiAgICByZXR1cm4gcGVyZkV2ZW50cztcbiAgfVxuXG4gIF9tZXJnZU1hcmtlckV2ZW50cyhwZXJmRXZlbnRzOiBhbnlbXSk6IGFueVtdIHtcbiAgICB0aGlzLl9tYXJrZXJFdmVudHMuZm9yRWFjaChmdW5jdGlvbihtYXJrZXJFdmVudCkgeyBwZXJmRXZlbnRzLnB1c2gobWFya2VyRXZlbnQpOyB9KTtcbiAgICByZXR1cm4gcGVyZkV2ZW50cztcbiAgfVxuXG4gIGFkZFN0YXJ0RXZlbnQobmFtZTogc3RyaW5nLCB0aW1lU3RhcnRlZDogbnVtYmVyKSB7XG4gICAgdGhpcy5fbWFya2VyRXZlbnRzLnB1c2goe3BoOiAnYicsIHRzOiB0aW1lU3RhcnRlZCAtIHRoaXMuX3Byb2ZpbGVyU3RhcnRUaW1lLCBuYW1lOiBuYW1lfSk7XG4gIH1cblxuICBhZGRFbmRFdmVudChuYW1lOiBzdHJpbmcsIHRpbWVFbmRlZDogbnVtYmVyKSB7XG4gICAgdGhpcy5fbWFya2VyRXZlbnRzLnB1c2goe3BoOiAnZScsIHRzOiB0aW1lRW5kZWQgLSB0aGlzLl9wcm9maWxlclN0YXJ0VGltZSwgbmFtZTogbmFtZX0pO1xuICB9XG59XG5cbmZ1bmN0aW9uIGZvcmNlR0MoKSB7XG4gIEN1LmZvcmNlR0MoKTtcbiAgb3Mubm90aWZ5T2JzZXJ2ZXJzKG51bGwsICdjaGlsZC1nYy1yZXF1ZXN0JywgbnVsbCk7XG59O1xuXG52YXIgbW9kID0gcmVxdWlyZSgnc2RrL3BhZ2UtbW9kJyk7XG52YXIgZGF0YSA9IHJlcXVpcmUoJ3Nkay9zZWxmJykuZGF0YTtcbnZhciBwcm9maWxlciA9IG5ldyBQcm9maWxlcigpO1xubW9kLlBhZ2VNb2Qoe1xuICBpbmNsdWRlOiBbJyonXSxcbiAgY29udGVudFNjcmlwdEZpbGU6IGRhdGEudXJsKCdpbnN0YWxsZWRfc2NyaXB0LmpzJyksXG4gIG9uQXR0YWNoOiB3b3JrZXIgPT4ge1xuICAgIHdvcmtlci5wb3J0Lm9uKCdzdGFydFByb2ZpbGVyJyxcbiAgICAgICAgICAgICAgICAgICAodGltZVN0YXJ0ZWQpID0+IHByb2ZpbGVyLnN0YXJ0KC8qID0gcHJvZmlsZXIgbWVtb3J5ICovIDMwMDAwMDAsIDAuMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFsnbGVhZicsICdqcycsICdzdGFja3dhbGsnLCAnZ2MnXSwgdGltZVN0YXJ0ZWQpKTtcbiAgICB3b3JrZXIucG9ydC5vbignc3RvcFByb2ZpbGVyJywgKCkgPT4gcHJvZmlsZXIuc3RvcCgpKTtcbiAgICB3b3JrZXIucG9ydC5vbignZ2V0UHJvZmlsZScsXG4gICAgICAgICAgICAgICAgICAgKCkgPT4gd29ya2VyLnBvcnQuZW1pdCgncGVyZlByb2ZpbGUnLCBwcm9maWxlci5nZXRQcm9maWxlUGVyZkV2ZW50cygpKSk7XG4gICAgd29ya2VyLnBvcnQub24oJ2ZvcmNlR0MnLCBmb3JjZUdDKTtcbiAgICB3b3JrZXIucG9ydC5vbignbWFya1N0YXJ0JywgKG5hbWUsIHRpbWVTdGFydGVkKSA9PiBwcm9maWxlci5hZGRTdGFydEV2ZW50KG5hbWUsIHRpbWVTdGFydGVkKSk7XG4gICAgd29ya2VyLnBvcnQub24oJ21hcmtFbmQnLCAobmFtZSwgdGltZUVuZGVkKSA9PiBwcm9maWxlci5hZGRFbmRFdmVudChuYW1lLCB0aW1lRW5kZWQpKTtcbiAgfVxufSk7XG4iXX0=