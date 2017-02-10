"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var web_worker_service_1 = require("../web-worker.service");
var result_1 = require("./result");
var AppComponent = (function () {
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
        var _this = this;
        var promises = [];
        promises.push(this._webWorkerService.runUrl('dist/app/echo.js', 'marco'));
        promises.push(this._webWorkerService.run(function () { return 'polo'; }, 0));
        promises.forEach(function (promise) {
            var worker = _this._webWorkerService.getWorker(promise);
            worker.addEventListener('message', function (event) {
                console.log('getWorker', event.data);
            });
        });
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
    return AppComponent;
}());
AppComponent = __decorate([
    core_1.Component({
        selector: 'my-app',
        template: "\n    <h2>calculating fibonacci using web worker</h2>\n    <form (ngSubmit)='startWebWorkerCalculation()'>\n        <div>\n            <span>calculate fib(n) from</span>\n            <input type='number' [(ngModel)]='webWorkerStart' name='webWorkerStart' />\n            <span>to:</span>\n            <input type='number' [(ngModel)]='webWorkerEnd' name='webWorkerEnd' />\n        </div>\n        <button type='submit'>Start</button>\n        <button type='button' (click)='stopWebWorkerCalculation()'>Stop</button>\n    </form>\n    <div>\n        <p *ngFor='let result of webWorkerResults'>\n            fib({{ result.number }}) = \n            <span *ngIf='result.loading' class='spin-me-baby'>... calculating ...</span>\n            <span *ngIf='!result.loading'>{{ result.result }}</span> \n        </p>\n    </div>\n    \n    <h2>calculating fibonacci using main UI thread</h2>\n    <form (ngSubmit)='startSynchronousCalculation()'>\n        <div>\n            <span>calculate fib(n) from</span>\n            <input type='number' [(ngModel)]='synchronousStart' name='synchronousStart' />\n            <span>to:</span>\n            <input type='number' [(ngModel)]='synchronousEnd' name='synchronousEnd' />\n        </div>\n        <button type='submit'>Start (might lock up your browser for large numbers)</button>\n    </form>\n    <div>\n        <span *ngIf='synchronousDuration' [class.zoom-me-baby]='true'>took {{ synchronousDuration }} seconds</span>\n        <p *ngFor='let result of synchronousResults'>\n            fib({{ result.number }}) = {{ result.result }}\n        </p>\n    </div>\n  ",
        styles: [
            "\n        .spin-me-baby {\n            animation: spin 4s linear infinite;\n        }\n        @keyframes spin { \n            100% {\n                transform: rotate(360deg);\n            }\n        }\n        .zoom-me-baby {\n            animation: zoom 4s linear infinite;\n        }\n        @keyframes zoom {\n            50% {\n                font-size: 2em;\n            }\n            100% {\n                font-size: 1em;\n            }\n        }\n        "
        ],
        providers: [web_worker_service_1.WebWorkerService]
    }),
    __metadata("design:paramtypes", [web_worker_service_1.WebWorkerService])
], AppComponent);
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map