# What is this?

[Web worker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers) service for [Angular 2](https://angular.io).

# API
```javascript
export interface IWebWorkerService {
    run<T>(workerFunction: (any) => T, data?: any): Promise<T>;
    runUrl(url: string, data?: any): Promise<any>;
    terminate<T>(promise: Promise<T>): Promise<T>;
}
```

* `run`
    * `workerFunction`: 
        * Must be a self-contained function. Cannot reference outside variables.
        * You can import other libraries with [`importScripts`](https://developer.mozilla.org/en-US/docs/Web/API/WorkerGlobalScope/importScripts) though
        *  These are okay:
        *  
            ```javascript   
            run(input => input * input, 10);
            
            run(input => {
                const square = num => num * num;
                return square(input);
            }, 10);
            
            const someFunction = (input) => input * input);
            run(someFunction, 10);
            
            class Runner {
                private webWorkerService = new WebWorkerService();
                constructor() {
                    this.webWorkerService.run(this.someFunction, 10);
                }
                someFunction() {
                    return input * input;
                }
            }
            ```
        *  These will probably **NOT** work:
        *  
            ```javascript   
            // this is not okay because inside the context of the web worker `this` is not the same `this` as here.
            run(input => this.square(input), 10); 
            
            // this is not okay because `_` doesn't exist in the web worker context (assuming tht `_` is available here to begin with)
            run(input => {
                return _.uniqueId() * input;
            }, 10);
            ```
    * `data`: [serializable data](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm)
* `runUrl`: Basically the same as 
    * `url`:  The url you would use to create a [`Worker`](https://developer.mozilla.org/en-US/docs/Web/API/Worker/Worker) instance
    * `data`: Same as the `run` method
* `terminate`: Calling this will [`terminate`](https://developer.mozilla.org/en-US/docs/Web/API/Worker/terminate) the web worker, if it is still running.
    * `promise`: The `Promise` instance returned by `run` or `runUrl`.

# Example
See [`app/app.component.ts`](app/app.component.js) for usage with an Angular 2 application.

```
export class AppComponent implements OnInit {
    constructor(private _webWorkerService: WebWorkerService) {
    }
    
    ngOnInit() {
        const input = 100;
        const promise = this._webWorkerService.run(this.someCPUHeavyFunction, input);
        promise.then(result => console.log(result));
    }
    
    someCPUHeavyFunction (input) {
        return input * 10;
    }
}
```