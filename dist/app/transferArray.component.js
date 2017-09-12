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
var core_1 = require('@angular/core');
var web_worker_service_1 = require('../web-worker.service');
var TransferArrayComponent = (function () {
    function TransferArrayComponent(_webWorkerService) {
        this._webWorkerService = _webWorkerService;
        this.arrayLength = 30000000;
    }
    TransferArrayComponent.prototype.startTransferArray = function () {
        var _this = this;
        var arrayBuffer = new ArrayBuffer(this.arrayLength * Float64Array.BYTES_PER_ELEMENT);
        this.view = new Float64Array(arrayBuffer);
        var startTransferTime = performance.now();
        this._webWorkerService.run(this.fillArrayWithRandom, {
            buff: this.view.buffer,
            useTransferObject: true
        }, [this.view.buffer])
            .then(function (_a) {
            var buffer = _a.buffer, receiveTime = _a.receiveTime, sendBackTime = _a.sendBackTime;
            _this.transferTimeFromWorkerMs = performance.now() - sendBackTime;
            _this.transferTimeToWorkerMs = receiveTime - startTransferTime;
            _this.view = new Float64Array(buffer);
        })
            .then(function () {
            startTransferTime = performance.now();
            return _this._webWorkerService.run(_this.fillArrayWithRandom, { buff: _this.view.buffer, useTransferObject: false });
        })
            .then(function (_a) {
            var buffer = _a.buffer, receiveTime = _a.receiveTime, sendBackTime = _a.sendBackTime;
            _this.transferTimeWithoutTransferListFromWorkerMs = performance.now() - sendBackTime;
            _this.transferTimeWithoutTransferListToWorkerMs = receiveTime - startTransferTime;
            _this.view = new Float64Array(buffer);
        })
            .then(function () {
            _this.arrayToShow = _this.view.slice(0, Math.min(100, _this.arrayLength));
        });
    };
    TransferArrayComponent.prototype.fillArrayWithRandom = function (data) {
        var receiveTime = performance.now();
        var arrayToFill = new Float64Array(data.buff);
        for (var i = 0; i < arrayToFill.length; i++) {
            arrayToFill[i] = Math.random();
        }
        var sendBackTime = performance.now();
        return {
            data: { receiveTime: receiveTime, sendBackTime: sendBackTime, buffer: arrayToFill.buffer },
            transferList: data.useTransferObject ? [arrayToFill.buffer] : []
        };
    };
    TransferArrayComponent = __decorate([
        core_1.Component({
            selector: 'my-transfer-array',
            template: "\n    <h2>Transfering big data array to web worker, fill it with random numbers and transfer it back</h2>\n    <form (ngSubmit)='startTransferArray()'>\n        <div>\n            <span>Array length filled with random numbers</span>\n            <input type='number' [(ngModel)]='arrayLength' name='array length' />\n            <span> Results in an ArrayBuffer of length: {{arrayLength * 8}}Bytes</span>\n        </div>\n        <button type='submit'>Transfer array to web worker</button>\n    </form>\n    <div *ngIf=\"transferTimeFromWorkerMs\"> \n        <h4>Transfer times with transferList</h4>\n        <span>\n        Transfer time to worker: {{transferTimeToWorkerMs}}\n        </span>\n        <br/>\n        <span>\n        Transfer time from worker: {{transferTimeFromWorkerMs}}ms.\n        </span>\n    </div>\n    <div *ngIf=\"transferTimeWithoutTransferListToWorkerMs\">\n        <h4>Transfer times without transfer object</h4>\n        <span>\n        Transfer time to worker: {{transferTimeWithoutTransferListToWorkerMs}}ms.\n        </span>\n        <br/>\n        <span>\n        Transfer time from worker: {{transferTimeWithoutTransferListFromWorkerMs}}ms.\n        </span>\n    </div>\n    <div><h4>First 100 elements from array:</h4>\n        <div *ngFor=\"let elem of arrayToShow\">{{elem}}</div>\n    </div>\n    ",
        }), 
        __metadata('design:paramtypes', [web_worker_service_1.WebWorkerService])
    ], TransferArrayComponent);
    return TransferArrayComponent;
}());
exports.TransferArrayComponent = TransferArrayComponent;
//# sourceMappingURL=transferArray.component.js.map