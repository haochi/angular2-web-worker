System.register(['angular2/core', '../web-worker.service', './result'], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, web_worker_service_1, result_1;
    var AppComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (web_worker_service_1_1) {
                web_worker_service_1 = web_worker_service_1_1;
            },
            function (result_1_1) {
                result_1 = result_1_1;
            }],
        execute: function() {
            core_1.enableProdMode();
            AppComponent = (function () {
                function AppComponent(_webWorkerService) {
                    this._webWorkerService = _webWorkerService;
                    this.webWorkerResults = [];
                    this.webWorkerStart = 35;
                    this.webWorkerEnd = 45;
                    this.synchronousStart = 35;
                    this.synchronousEnd = 38;
                    this.synchronousResults = [];
                    this.synchronousDuration = 0;
                    this.promises = [];
                }
                AppComponent.prototype.startWebWorkerCalculation = function () {
                    var pointer = this.webWorkerStart;
                    var end = this.webWorkerEnd;
                    this.stopWebWorkerCalculation();
                    while (pointer <= end) {
                        this.webWorkerCalculate(pointer);
                        pointer++;
                    }
                };
                AppComponent.prototype.stopWebWorkerCalculation = function () {
                    var _this = this;
                    this.promises.forEach(function (promise) {
                        _this._webWorkerService.terminate(promise);
                    });
                    this.promises.length = 0;
                    this.webWorkerResults.length = 0;
                };
                AppComponent.prototype.startSynchronousCalculation = function () {
                    var pointer = this.synchronousStart;
                    var end = this.synchronousEnd;
                    this.synchronousResults.length = 0;
                    var start = new Date();
                    while (pointer <= end) {
                        var result = new result_1.Result(pointer, this.fib(pointer), false);
                        this.synchronousResults.push(result);
                        pointer++;
                    }
                    this.synchronousDuration = ((new Date()).getTime() - start.getTime()) / 1000;
                };
                AppComponent.prototype.startExternalRequest = function () {
                    var promises = [];
                    promises.push(this._webWorkerService.runUrl('app/echo.js', 'marco'));
                    promises.push(this._webWorkerService.run(function () { return 'polo'; }, 0));
                    Promise.all(promises)
                        .then(function (response) { return console.log(response); })
                        .catch(function (error) { return console.error(error); });
                };
                AppComponent.prototype.ngOnInit = function () {
                    this.startExternalRequest();
                };
                AppComponent.prototype.webWorkerCalculate = function (n) {
                    var promise = this._webWorkerService.run(this.fib, n);
                    var result = new result_1.Result(n, 0, true);
                    this.webWorkerResults.push(result);
                    this.promises.push(promise);
                    promise.then(function (response) {
                        result.result = response;
                        result.loading = false;
                    });
                };
                AppComponent.prototype.fib = function (n) {
                    var fib = function (n) {
                        if (n < 2)
                            return 1;
                        return fib(n - 1) + fib(n - 2);
                    };
                    return fib(n);
                };
                AppComponent = __decorate([
                    core_1.Component({
                        selector: 'web-worker-app',
                        template: "\n    <h2>calculating fibonacci using web worker</h2>\n    <form (ngSubmit)='startWebWorkerCalculation()'>\n        <div>\n            <span>calculate fib(n) from</span>\n            <input type='number' [(ngModel)]='webWorkerStart' />\n            <span>to:</span>\n            <input type='number' [(ngModel)]='webWorkerEnd' />\n        </div>\n        <button type='submit'>Start</button>\n        <button type='button' (click)='stopWebWorkerCalculation()'>Stop</button>\n    </form>\n    <div>\n        <p *ngFor='#result of webWorkerResults'>\n            fib({{ result.number }}) = \n            <span *ngIf='result.loading' class='spin-me-baby'>... calculating ...</span>\n            <span *ngIf='!result.loading'>{{ result.result }}</span> \n        </p>\n    </div>\n    \n    <h2>calculating fibonacci using main UI thread</h2>\n    <form (ngSubmit)='startSynchronousCalculation()'>\n        <div>\n            <span>calculate fib(n) from</span>\n            <input type='number' [(ngModel)]='synchronousStart' />\n            <span>to:</span>\n            <input type='number' [(ngModel)]='synchronousEnd' />\n        </div>\n        <button type='submit'>Start (might lock up your browser for large numbers)</button>\n    </form>\n    <div>\n        <span *ngIf='synchronousDuration' [class.zoom-me-baby]='true'>took {{ synchronousDuration }} seconds</span>\n        <p *ngFor='#result of synchronousResults'>\n            fib({{ result.number }}) = {{ result.result }}\n        </p>\n    </div>\n    ",
                        styles: [
                            "\n        .spin-me-baby {\n            animation: spin 4s linear infinite;\n        }\n        @keyframes spin { \n            100% {\n                transform: rotate(360deg);\n            }\n        }\n        .zoom-me-baby {\n            animation: zoom 4s linear infinite;\n        }\n        @keyframes zoom {\n            50% {\n                font-size: 2em;\n            }\n            100% {\n                font-size: 1em;\n            }\n        }\n        "
                        ],
                        providers: [web_worker_service_1.WebWorkerService]
                    }), 
                    __metadata('design:paramtypes', [web_worker_service_1.WebWorkerService])
                ], AppComponent);
                return AppComponent;
            })();
            exports_1("AppComponent", AppComponent);
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL2FwcC9hcHAuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbIkFwcENvbXBvbmVudCIsIkFwcENvbXBvbmVudC5jb25zdHJ1Y3RvciIsIkFwcENvbXBvbmVudC5zdGFydFdlYldvcmtlckNhbGN1bGF0aW9uIiwiQXBwQ29tcG9uZW50LnN0b3BXZWJXb3JrZXJDYWxjdWxhdGlvbiIsIkFwcENvbXBvbmVudC5zdGFydFN5bmNocm9ub3VzQ2FsY3VsYXRpb24iLCJBcHBDb21wb25lbnQuc3RhcnRFeHRlcm5hbFJlcXVlc3QiLCJBcHBDb21wb25lbnQubmdPbkluaXQiLCJBcHBDb21wb25lbnQud2ViV29ya2VyQ2FsY3VsYXRlIiwiQXBwQ29tcG9uZW50LmZpYiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1lBSUEscUJBQWMsRUFBRSxDQUFDO1lBRWpCO2dCQTBFSUEsc0JBQW9CQSxpQkFBbUNBO29CQUFuQ0Msc0JBQWlCQSxHQUFqQkEsaUJBQWlCQSxDQUFrQkE7b0JBVGhEQSxxQkFBZ0JBLEdBQUdBLEVBQUVBLENBQUNBO29CQUN0QkEsbUJBQWNBLEdBQUdBLEVBQUVBLENBQUNBO29CQUNwQkEsaUJBQVlBLEdBQUdBLEVBQUVBLENBQUNBO29CQUNsQkEscUJBQWdCQSxHQUFHQSxFQUFFQSxDQUFDQTtvQkFDdEJBLG1CQUFjQSxHQUFHQSxFQUFFQSxDQUFDQTtvQkFDcEJBLHVCQUFrQkEsR0FBR0EsRUFBRUEsQ0FBQ0E7b0JBQ3hCQSx3QkFBbUJBLEdBQUdBLENBQUNBLENBQUNBO29CQUN2QkEsYUFBUUEsR0FBR0EsRUFBRUEsQ0FBQ0E7Z0JBR3RCQSxDQUFDQTtnQkFFREQsZ0RBQXlCQSxHQUF6QkE7b0JBQ0lFLElBQUlBLE9BQU9BLEdBQUdBLElBQUlBLENBQUNBLGNBQWNBLENBQUNBO29CQUNsQ0EsSUFBTUEsR0FBR0EsR0FBR0EsSUFBSUEsQ0FBQ0EsWUFBWUEsQ0FBQ0E7b0JBRTlCQSxJQUFJQSxDQUFDQSx3QkFBd0JBLEVBQUVBLENBQUNBO29CQUNoQ0EsT0FBT0EsT0FBT0EsSUFBSUEsR0FBR0EsRUFBRUEsQ0FBQ0E7d0JBQ3BCQSxJQUFJQSxDQUFDQSxrQkFBa0JBLENBQUNBLE9BQU9BLENBQUNBLENBQUNBO3dCQUNqQ0EsT0FBT0EsRUFBRUEsQ0FBQ0E7b0JBQ2RBLENBQUNBO2dCQUNMQSxDQUFDQTtnQkFFREYsK0NBQXdCQSxHQUF4QkE7b0JBQUFHLGlCQU1DQTtvQkFMR0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsVUFBQUEsT0FBT0E7d0JBQ3pCQSxLQUFJQSxDQUFDQSxpQkFBaUJBLENBQUNBLFNBQVNBLENBQUNBLE9BQU9BLENBQUNBLENBQUNBO29CQUM5Q0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQ0hBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLE1BQU1BLEdBQUdBLENBQUNBLENBQUNBO29CQUN6QkEsSUFBSUEsQ0FBQ0EsZ0JBQWdCQSxDQUFDQSxNQUFNQSxHQUFHQSxDQUFDQSxDQUFDQTtnQkFDckNBLENBQUNBO2dCQUVESCxrREFBMkJBLEdBQTNCQTtvQkFDSUksSUFBSUEsT0FBT0EsR0FBR0EsSUFBSUEsQ0FBQ0EsZ0JBQWdCQSxDQUFDQTtvQkFDcENBLElBQU1BLEdBQUdBLEdBQUdBLElBQUlBLENBQUNBLGNBQWNBLENBQUNBO29CQUVoQ0EsSUFBSUEsQ0FBQ0Esa0JBQWtCQSxDQUFDQSxNQUFNQSxHQUFHQSxDQUFDQSxDQUFDQTtvQkFFbkNBLElBQU1BLEtBQUtBLEdBQUdBLElBQUlBLElBQUlBLEVBQUVBLENBQUNBO29CQUN6QkEsT0FBT0EsT0FBT0EsSUFBSUEsR0FBR0EsRUFBRUEsQ0FBQ0E7d0JBQ3BCQSxJQUFNQSxNQUFNQSxHQUFHQSxJQUFJQSxlQUFNQSxDQUFDQSxPQUFPQSxFQUFFQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxPQUFPQSxDQUFDQSxFQUFFQSxLQUFLQSxDQUFDQSxDQUFDQTt3QkFDN0RBLElBQUlBLENBQUNBLGtCQUFrQkEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0E7d0JBQ3JDQSxPQUFPQSxFQUFFQSxDQUFDQTtvQkFDZEEsQ0FBQ0E7b0JBQ0RBLElBQUlBLENBQUNBLG1CQUFtQkEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsSUFBSUEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsT0FBT0EsRUFBRUEsR0FBR0EsS0FBS0EsQ0FBQ0EsT0FBT0EsRUFBRUEsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0E7Z0JBQ2pGQSxDQUFDQTtnQkFFREosMkNBQW9CQSxHQUFwQkE7b0JBQ0lLLElBQU1BLFFBQVFBLEdBQUdBLEVBQUVBLENBQUNBO29CQUNwQkEsUUFBUUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsaUJBQWlCQSxDQUFDQSxNQUFNQSxDQUFDQSxhQUFhQSxFQUFFQSxPQUFPQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDckVBLFFBQVFBLENBQUNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLGlCQUFpQkEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsY0FBTUEsT0FBQUEsTUFBTUEsRUFBTkEsQ0FBTUEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBRTNEQSxPQUFPQSxDQUFDQSxHQUFHQSxDQUFDQSxRQUFRQSxDQUFDQTt5QkFDaEJBLElBQUlBLENBQUNBLFVBQUFBLFFBQVFBLElBQUlBLE9BQUFBLE9BQU9BLENBQUNBLEdBQUdBLENBQUNBLFFBQVFBLENBQUNBLEVBQXJCQSxDQUFxQkEsQ0FBQ0E7eUJBQ3ZDQSxLQUFLQSxDQUFDQSxVQUFBQSxLQUFLQSxJQUFJQSxPQUFBQSxPQUFPQSxDQUFDQSxLQUFLQSxDQUFDQSxLQUFLQSxDQUFDQSxFQUFwQkEsQ0FBb0JBLENBQUNBLENBQUNBO2dCQUM5Q0EsQ0FBQ0E7Z0JBRURMLCtCQUFRQSxHQUFSQTtvQkFDSU0sSUFBSUEsQ0FBQ0Esb0JBQW9CQSxFQUFFQSxDQUFDQTtnQkFDaENBLENBQUNBO2dCQUVPTix5Q0FBa0JBLEdBQTFCQSxVQUEyQkEsQ0FBU0E7b0JBQ2hDTyxJQUFNQSxPQUFPQSxHQUFHQSxJQUFJQSxDQUFDQSxpQkFBaUJBLENBQUNBLEdBQUdBLENBQUNBLElBQUlBLENBQUNBLEdBQUdBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBO29CQUN4REEsSUFBTUEsTUFBTUEsR0FBR0EsSUFBSUEsZUFBTUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsRUFBRUEsSUFBSUEsQ0FBQ0EsQ0FBQ0E7b0JBQ3RDQSxJQUFJQSxDQUFDQSxnQkFBZ0JBLENBQUNBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBO29CQUNuQ0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0E7b0JBRTVCQSxPQUFPQSxDQUFDQSxJQUFJQSxDQUFDQSxVQUFVQSxRQUFRQTt3QkFDM0IsTUFBTSxDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUM7d0JBQ3pCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO29CQUMzQixDQUFDLENBQUNBLENBQUNBO2dCQUNQQSxDQUFDQTtnQkFFT1AsMEJBQUdBLEdBQVhBLFVBQVlBLENBQVNBO29CQUNqQlEsSUFBTUEsR0FBR0EsR0FBR0EsVUFBQ0EsQ0FBU0E7d0JBQ2xCQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTs0QkFBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7d0JBQ3BCQSxNQUFNQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDbkNBLENBQUNBLENBQUNBO29CQUVGQSxNQUFNQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDbEJBLENBQUNBO2dCQWhKTFI7b0JBQUNBLGdCQUFTQSxDQUFDQTt3QkFDUEEsUUFBUUEsRUFBRUEsZ0JBQWdCQTt3QkFDMUJBLFFBQVFBLEVBQUVBLDQrQ0FvQ1RBO3dCQUNEQSxNQUFNQSxFQUFFQTs0QkFDSkEseWRBb0JDQTt5QkFDSkE7d0JBQ0RBLFNBQVNBLEVBQUVBLENBQUNBLHFDQUFnQkEsQ0FBQ0E7cUJBQ2hDQSxDQUFDQTs7aUNBa0ZEQTtnQkFBREEsbUJBQUNBO1lBQURBLENBQUNBLEFBakpELElBaUpDO1lBakpELHVDQWlKQyxDQUFBIn0=