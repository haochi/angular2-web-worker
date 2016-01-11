export interface IWebWorkerService {
    run<T>(workerFunction: (any) => T, data?: any): Promise<T>;
    runUrl(url: string, data?: any): Promise<any>;
    terminate<T>(promise: Promise<T>): Promise<T>;
} 