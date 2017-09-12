export interface IWebWorkerService {
    run<T>(workerFunction: (input: any) => T | { data: T, transferList: any[] }, data?: any, transferList?: any[]): Promise<T>;

    runUrl<T>(url: string, data: any, transferList?: any[]): Promise<T>;

    terminate<T>(promise: Promise<T>): Promise<T>;

    getWorker(promise: Promise<any>): Worker;
}
