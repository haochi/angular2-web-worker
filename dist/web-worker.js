"use strict";
var WebWorkerService = (function () {
    function WebWorkerService() {
        this.workerFunctionToUrlMap = new WeakMap();
        this.promiseToWorkerMap = new WeakMap();
    }
    WebWorkerService.prototype.run = function (workerFunction, data) {
        var url = this.getOrCreateWorkerUrl(workerFunction);
        return this.runUrl(url, data);
    };
    WebWorkerService.prototype.runUrl = function (url, data) {
        var worker = new Worker(url);
        var promise = this.createPromiseForWorker(worker, data);
        var promiseCleaner = this.createPromiseCleaner(promise);
        this.promiseToWorkerMap.set(promise, worker);
        promise
            .then(promiseCleaner)
            .catch(promiseCleaner);
        return promise;
    };
    WebWorkerService.prototype.terminate = function (promise) {
        return this.removePromise(promise);
    };
    WebWorkerService.prototype.getWorker = function (promise) {
        return this.promiseToWorkerMap.get(promise);
    };
    WebWorkerService.prototype.createPromiseForWorker = function (worker, data) {
        return new Promise(function (resolve, reject) {
            worker.addEventListener('message', function (event) { return resolve(event.data); });
            worker.addEventListener('error', reject);
            worker.postMessage(data);
        });
    };
    WebWorkerService.prototype.getOrCreateWorkerUrl = function (fn) {
        if (!this.workerFunctionToUrlMap.has(fn)) {
            var url = this.createWorkerUrl(fn);
            this.workerFunctionToUrlMap.set(fn, url);
            return url;
        }
        return this.workerFunctionToUrlMap.get(fn);
    };
    WebWorkerService.prototype.createWorkerUrl = function (resolve) {
        var resolveString = resolve.toString();
        var webWorkerTemplate = "\n            self.addEventListener('message', function(e) {\n                postMessage((" + resolveString + ")(e.data));\n            });\n        ";
        var blob = new Blob([webWorkerTemplate], { type: 'text/javascript' });
        return URL.createObjectURL(blob);
    };
    WebWorkerService.prototype.createPromiseCleaner = function (promise) {
        var _this = this;
        return function (event) {
            _this.removePromise(promise);
            return event;
        };
    };
    WebWorkerService.prototype.removePromise = function (promise) {
        var worker = this.promiseToWorkerMap.get(promise);
        if (worker) {
            worker.terminate();
        }
        this.promiseToWorkerMap.delete(promise);
        return promise;
    };
    return WebWorkerService;
}());
exports.WebWorkerService = WebWorkerService;
//# sourceMappingURL=web-worker.js.map