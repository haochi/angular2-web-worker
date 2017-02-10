import { Component, OnInit } from '@angular/core';
import { WebWorkerService } from '../web-worker.service';
import { Result } from './result';

@Component({
  selector: 'my-app',
  template: `
    <h2>calculating fibonacci using web worker</h2>
    <form (ngSubmit)='startWebWorkerCalculation()'>
        <div>
            <span>calculate fib(n) from</span>
            <input type='number' [(ngModel)]='webWorkerStart' name='webWorkerStart' />
            <span>to:</span>
            <input type='number' [(ngModel)]='webWorkerEnd' name='webWorkerEnd' />
        </div>
        <button type='submit'>Start</button>
        <button type='button' (click)='stopWebWorkerCalculation()'>Stop</button>
    </form>
    <div>
        <p *ngFor='let result of webWorkerResults'>
            fib({{ result.number }}) = 
            <span *ngIf='result.loading' class='spin-me-baby'>... calculating ...</span>
            <span *ngIf='!result.loading'>{{ result.result }}</span> 
        </p>
    </div>
    
    <h2>calculating fibonacci using main UI thread</h2>
    <form (ngSubmit)='startSynchronousCalculation()'>
        <div>
            <span>calculate fib(n) from</span>
            <input type='number' [(ngModel)]='synchronousStart' name='synchronousStart' />
            <span>to:</span>
            <input type='number' [(ngModel)]='synchronousEnd' name='synchronousEnd' />
        </div>
        <button type='submit'>Start (might lock up your browser for large numbers)</button>
    </form>
    <div>
        <span *ngIf='synchronousDuration' [class.zoom-me-baby]='true'>took {{ synchronousDuration }} seconds</span>
        <p *ngFor='let result of synchronousResults'>
            fib({{ result.number }}) = {{ result.result }}
        </p>
    </div>
  `,
    styles: [
        `
        .spin-me-baby {
            animation: spin 4s linear infinite;
        }
        @keyframes spin { 
            100% {
                transform: rotate(360deg);
            }
        }
        .zoom-me-baby {
            animation: zoom 4s linear infinite;
        }
        @keyframes zoom {
            50% {
                font-size: 2em;
            }
            100% {
                font-size: 1em;
            }
        }
        `
    ],
    providers: [WebWorkerService]
})
export class AppComponent implements OnInit {
    public webWorkerResults: any[] = [];
    public webWorkerStart = 35;
    public webWorkerEnd = 45;
    public synchronousStart = 35;
    public synchronousEnd = 38;
    public synchronousResults: any[] = [];
    public synchronousDuration = 0;
    private promises: Promise<any>[] = [];

    constructor(private _webWorkerService: WebWorkerService) {
    }
    
    startWebWorkerCalculation() {
        let pointer = this.webWorkerStart;
        const end = this.webWorkerEnd;

        this.stopWebWorkerCalculation();
        while (pointer <= end) {
            this.webWorkerCalculate(pointer);
            pointer++;
        }
    }
    
    stopWebWorkerCalculation() {
        this.promises.forEach(promise => {
            this._webWorkerService.terminate(promise);
        });
        this.promises.length = 0;
        this.webWorkerResults.length = 0;
    }
    
    startSynchronousCalculation() {
        let pointer = this.synchronousStart;
        const end = this.synchronousEnd;
        
        this.synchronousResults.length = 0;
        
        const start = new Date();
        while (pointer <= end) {
            const result = new Result(pointer, this.fib(pointer), false);
            this.synchronousResults.push(result);
            pointer++;
        }
        this.synchronousDuration = ((new Date()).getTime() - start.getTime()) / 1000;
    }
    
    startExternalRequest() {
        const promises = [];
        promises.push(this._webWorkerService.runUrl('dist/app/echo.js', 'marco'));
        promises.push(this._webWorkerService.run(() => 'polo', 0));

        promises.forEach(promise => {
            let worker = this._webWorkerService.getWorker(promise);
            worker.addEventListener('message', event => {
                console.log('getWorker', event.data);
            });
        });

        Promise.all(promises)
            .then(response => console.log(response))
            .catch(error => console.error(error));
    }
    
    ngOnInit() {
        this.startExternalRequest();
    }
    
    private webWorkerCalculate(n: number) {
        const promise = this._webWorkerService.run(this.fib, n);
        const result = new Result(n, 0, true);
        this.webWorkerResults.push(result);
        this.promises.push(promise);
        
        promise.then(function (response) {
            result.result = response;
            result.loading = false;
        });
    }
    
    private fib(n: number) {
        const fib = (n: number) : number => {
            if (n < 2) return 1;
            return fib(n - 1) + fib(n - 2);
        };
        
        return fib(n);
    }
}