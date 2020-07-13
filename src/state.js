import { observe } from './observe/index.js';

export function initState(vm) {
    const opts = vm.$options;
    if (opts.props) {
        initProps(vm);
    }
    if (opts.methods) {
        initMethod(vm);
    }
    if (opts.data) {
        initData(vm);
    }
    // computed ....   watch

}


function initProps(vm) { }

function initMethod(vm) { }

function initData(vm) {
    // console.log(vm.$options.data);
    // 核心，数据响应式原理
    let data = vm.$options.data;
    data = vm._data = typeof data === 'function' ? data.call(vm) : data;

    // 将数据全部代理到vm的实例上
    for (let key in data) {
        proxy(vm, '_data', key)
    }
    observe(data);
}

function proxy(target, property, key) {
    Object.defineProperty(target, key, {
        get() {
            return target[property][key];
        },
        set(newValue) {
            target[property][key] = newValue;
        }
    })
}