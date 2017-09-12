import {Component} from '@angular/core';
import {WebWorkerService} from '../web-worker.service';

@Component({
    selector: 'my-transfer-array',
    template: `
    <h2>Transfering big data array to web worker, fill it with random numbers and transfer it back</h2>
    <form (ngSubmit)='startTransferArray()'>
        <div>
            <span>Array length filled with random numbers</span>
            <input type='number' [(ngModel)]='arrayLength' name='array length' />
            <span> Results in an ArrayBuffer of length: {{arrayLength * 8}}Bytes</span>
        </div>
        <button type='submit'>Transfer array to web worker</button>
    </form>
    <div *ngIf="transferTimeFromWorkerMs"> 
        <h4>Transfer times with transferList</h4>
        <span>
        Transfer time to worker: {{transferTimeToWorkerMs}}
        </span>
        <br/>
        <span>
        Transfer time from worker: {{transferTimeFromWorkerMs}}ms.
        </span>
    </div>
    <div *ngIf="transferTimeWithoutTransferListToWorkerMs">
        <h4>Transfer times without transfer object</h4>
        <span>
        Transfer time to worker: {{transferTimeWithoutTransferListToWorkerMs}}ms.
        </span>
        <br/>
        <span>
        Transfer time from worker: {{transferTimeWithoutTransferListFromWorkerMs}}ms.
        </span>
    </div>
    <div><h4>First 100 elements from array:</h4>
        <div *ngFor="let elem of arrayToShow">{{elem}}</div>
    </div>
    `,
})
export class TransferArrayComponent {

    public view: Float64Array;
    public arrayLength: number = 30000000;
    public transferTimeFromWorkerMs: number;
    public transferTimeToWorkerMs: number;
    public transferTimeWithoutTransferListFromWorkerMs: number;
    public transferTimeWithoutTransferListToWorkerMs: number;
    private arrayToShow: Float64Array;

    constructor(private _webWorkerService: WebWorkerService) {
    }


    startTransferArray() {
        const arrayBuffer = new ArrayBuffer(this.arrayLength * Float64Array.BYTES_PER_ELEMENT);
        this.view = new Float64Array(arrayBuffer);
        let startTransferTime = performance.now();
        this._webWorkerService.run(this.fillArrayWithRandom, {
            buff: this.view.buffer,
            useTransferObject: true
        }, [this.view.buffer])
            .then(({buffer, receiveTime, sendBackTime}) => {
                this.transferTimeFromWorkerMs = performance.now() - sendBackTime;
                this.transferTimeToWorkerMs = receiveTime - startTransferTime;
                this.view = new Float64Array(buffer);
            })
            .then(() => {
                startTransferTime = performance.now();
                return this._webWorkerService.run(
                    this.fillArrayWithRandom,
                    {buff: this.view.buffer, useTransferObject: false});
            })
            .then(({buffer, receiveTime, sendBackTime}) => {
                this.transferTimeWithoutTransferListFromWorkerMs = performance.now() - sendBackTime;
                this.transferTimeWithoutTransferListToWorkerMs = receiveTime - startTransferTime;
                this.view = new Float64Array(buffer);
            })
            .then(() => {
                this.arrayToShow = this.view.slice(0, Math.min(100, this.arrayLength));
            });
    }

    fillArrayWithRandom(data: { buff: ArrayBuffer, useTransferObject: boolean }): {
        data: { buffer: ArrayBuffer, receiveTime: number, sendBackTime: number },
        transferList: any[]
    } {
        const receiveTime = performance.now();
        const arrayToFill = new Float64Array(data.buff);
        for (let i = 0; i < arrayToFill.length; i++) {
            arrayToFill[i] = Math.random();
        }
        const sendBackTime = performance.now();
        return {
            data: {receiveTime, sendBackTime, buffer: arrayToFill.buffer},
            transferList: data.useTransferObject ? [arrayToFill.buffer] : []
        };
    }
}

