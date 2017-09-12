import {IWebWorkerService} from './web-worker.interface';

export class WebWorkerService implements IWebWorkerService {
    private workerFunctionToUrlMap = new WeakMap<Function, string>();
    private promiseToWorkerMap = new WeakMap<Promise<any>, Worker>();

    run<T>(workerFunction: (input: any) => T | { data: T, transferList: any[] }, data?: any, transferList?: any[]): Promise<T> {
        const url = this.getOrCreateWorkerUrl(workerFunction);
        return this.runUrl(url, data, transferList);
    }

    runUrl<T>(url: string, data: any, transferList?: any[]): Promise<T> {
        const worker = new Worker(url);
        const promise: Promise<T> = this.createPromiseForWorker<T>(worker, data, transferList);
        const promiseCleaner = this.createPromiseCleaner(promise);

        this.promiseToWorkerMap.set(promise, worker);

        promise
            .then(promiseCleaner)
            .catch(promiseCleaner);

        return promise;
    }

    terminate<T>(promise: Promise<T>): Promise<T> {
        return this.removePromise(promise);
    }

    getWorker(promise: Promise<any>): Worker {
        return this.promiseToWorkerMap.get(promise);
    }

    private createPromiseForWorker<T>(worker: Worker, data: any, transferList?: any[]) {
        return new Promise<T>((resolve, reject) => {
            worker.addEventListener('message', (event) => resolve(event.data));
            worker.addEventListener('error', reject);
            worker.postMessage(data, transferList);
        });
    }

    private getOrCreateWorkerUrl(fn: Function): string {
        if (!this.workerFunctionToUrlMap.has(fn)) {
            const url = this.createWorkerUrl(fn);
            this.workerFunctionToUrlMap.set(fn, url);
            return url;
        }
        return this.workerFunctionToUrlMap.get(fn);
    }

    private createWorkerUrl(resolve: Function): string {
        const resolveString = resolve.toString();
        const webWorkerTemplate = `
            self.addEventListener('message', function(e) {
                const result = (${resolveString})(e.data);
                if(result.data && result.transferList){
                    postMessage(result.data, result.transferList)
                }    
                postMessage(result);
            });
        `;
        const blob = new Blob([webWorkerTemplate], {type: 'text/javascript'});
        return URL.createObjectURL(blob);
    }

    private createPromiseCleaner<T>(promise: Promise<T>): (input: any) => T {
        return (event) => {
            this.removePromise(promise);
            return event;
        };
    }

    private removePromise<T>(promise: Promise<T>): Promise<T> {
        const worker = this.promiseToWorkerMap.get(promise);
        if (worker) {
            worker.terminate();
        }
        this.promiseToWorkerMap.delete(promise);
        return promise;
    }
}