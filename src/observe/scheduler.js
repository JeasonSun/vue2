import { watch } from "rollup";

let has = {}; // vue 源码里面有的时候用set去重，有时候用对象来去重。
let queue = [];

// 这个队列是否正在等待更新；
function flushSchedulerQueue() {
    for (let i = 0; i < queue.length; i++) {
        let watcher = queue[i];
        watcher.run();
        queue = [];
        has = {};
    }
}
export function queueWatcher(watcher) {
    const id = watcher.id;
    if (has[id] == null) {
        has[id] = true;
        queue.push(watcher);
        // if(!pending){ // 调用更新时，没有刷新队列时，开始刷新。
        nextTick(flushSchedulerQueue);
        // pending = true; // 正在刷新中。
        // }
    }
}

let callbacks = [];
let pending = false;
function flushCallbacksQueue() {
    callbacks.forEach(fn => fn());
    pending = false;
}
export function nextTick(fn) {
    callbacks.push(fn);
    if(!pending){  // 事件环的概念
        setTimeout(() => {
            flushCallbacksQueue();
        }, 0);
        pending = true;
    }
}