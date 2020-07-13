class Watcher {
    constructor(vm, exprOrFn, cb, options) {
        // console.log(vm, exprOrFn, cb, options);
        exprOrFn();
    }
}

export default Watcher;