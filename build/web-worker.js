System.register([], function(exports_1) {
    var WebWorkerService;
    return {
        setters:[],
        execute: function() {
            WebWorkerService = (function () {
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
            })();
            exports_1("WebWorkerService", WebWorkerService);
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2ViLXdvcmtlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3dlYi13b3JrZXIudHMiXSwibmFtZXMiOlsiV2ViV29ya2VyU2VydmljZSIsIldlYldvcmtlclNlcnZpY2UuY29uc3RydWN0b3IiLCJXZWJXb3JrZXJTZXJ2aWNlLnJ1biIsIldlYldvcmtlclNlcnZpY2UucnVuVXJsIiwiV2ViV29ya2VyU2VydmljZS50ZXJtaW5hdGUiLCJXZWJXb3JrZXJTZXJ2aWNlLmNyZWF0ZVByb21pc2VGb3JXb3JrZXIiLCJXZWJXb3JrZXJTZXJ2aWNlLmdldE9yQ3JlYXRlV29ya2VyVXJsIiwiV2ViV29ya2VyU2VydmljZS5jcmVhdGVXb3JrZXJVcmwiLCJXZWJXb3JrZXJTZXJ2aWNlLmNyZWF0ZVByb21pc2VDbGVhbmVyIiwiV2ViV29ya2VyU2VydmljZS5yZW1vdmVQcm9taXNlIl0sIm1hcHBpbmdzIjoiOzs7OztZQU9BO2dCQUFBQTtvQkFDWUMsMkJBQXNCQSxHQUFHQSxJQUFJQSxPQUFPQSxFQUFvQkEsQ0FBQ0E7b0JBQ3pEQSx1QkFBa0JBLEdBQUdBLElBQUlBLE9BQU9BLEVBQXdCQSxDQUFDQTtnQkFvRXJFQSxDQUFDQTtnQkFsRUdELDhCQUFHQSxHQUFIQSxVQUFPQSxjQUEwQkEsRUFBRUEsSUFBVUE7b0JBQ3pDRSxJQUFNQSxHQUFHQSxHQUFHQSxJQUFJQSxDQUFDQSxvQkFBb0JBLENBQUNBLGNBQWNBLENBQUNBLENBQUNBO29CQUN0REEsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsR0FBR0EsRUFBRUEsSUFBSUEsQ0FBQ0EsQ0FBQ0E7Z0JBQ2xDQSxDQUFDQTtnQkFFREYsaUNBQU1BLEdBQU5BLFVBQU9BLEdBQVdBLEVBQUVBLElBQVVBO29CQUMxQkcsSUFBTUEsTUFBTUEsR0FBR0EsSUFBSUEsTUFBTUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7b0JBQy9CQSxJQUFNQSxPQUFPQSxHQUFHQSxJQUFJQSxDQUFDQSxzQkFB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