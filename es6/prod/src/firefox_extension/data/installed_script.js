exportFunction(function () {
    var curTime = unsafeWindow.performance.now();
    self.port.emit('startProfiler', curTime);
}, unsafeWindow, { defineAs: "startProfiler" });
exportFunction(function () { self.port.emit('stopProfiler'); }, unsafeWindow, { defineAs: "stopProfiler" });
exportFunction(function (cb) {
    self.port.once('perfProfile', cb);
    self.port.emit('getProfile');
}, unsafeWindow, { defineAs: "getProfile" });
exportFunction(function () { self.port.emit('forceGC'); }, unsafeWindow, { defineAs: "forceGC" });
exportFunction(function (name) {
    var curTime = unsafeWindow.performance.now();
    self.port.emit('markStart', name, curTime);
}, unsafeWindow, { defineAs: "markStart" });
exportFunction(function (name) {
    var curTime = unsafeWindow.performance.now();
    self.port.emit('markEnd', name, curTime);
}, unsafeWindow, { defineAs: "markEnd" });
