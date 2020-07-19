import { pushTarget, popTarget } from './dep';
import { queueWatcher} from './scheduler';

let id = 0; // 做一个watcher的id，每次创建watcher时候，都有一个序号。
class Watcher {
    constructor(vm, exprOrFn, cb, options) {
        // console.log(vm, exprOrFn, cb, options);
        // exprOrFn();
        this.vm = vm;
        this.exprOrFn = exprOrFn;
        this.cb = cb;
        this.options = options;
        this.deps = [];
        this.depsId = new Set();
        if (typeof exprOrFn === 'function') {
            this.getter = exprOrFn;
        }
        this.id = id++;

        this.get();
    }

    get() {
        pushTarget(this); // 在取值之前， 将watcher先保存起来
        this.getter(); // 这句话实现了视图的渲染 -》  操作是取值。
        popTarget(); // 删除watcher
    }

    addDep(dep) {
        let id = dep.id;
        if (!this.depsId.has(id)) {
            this.depsId.add(id);
            this.deps.push(dep);
            dep.addSub(this); // 让当前dep订阅这个watcher
        }
    }

    update() {
        // this.get(); // 以前调用get方法，直接更新视图。
        queueWatcher(this); // 将watcher存储起来。
    }

    run() {
        this.get();
    }


}

export default Watcher;