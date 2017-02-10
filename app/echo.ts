interface DedicatedWorkerGlobalScope extends Window {
    postMessage(data: string): void;
}

onmessage = function (e) {
    const me = this as DedicatedWorkerGlobalScope;
    me.postMessage(e.data);
};
