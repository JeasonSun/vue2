import { isObject } from '../utils';

class Observer {
    constructor(data) {
        // console.log(data);
        this.walk(data);
    }
    walk(data) {
        // 对象的循环
        Object.keys(data).forEach(key => {
            defineReactive(data, key, data[key]); // 定义响应式的数据变化
        })
    }
}

// vue2的性能，递归重写对象的get set
// vue3中改进， proxy
function defineReactive(data, key, value) {
    observe(value);
    Object.defineProperty(data, key, {
        get() {
            return value;
        },
        set(newValue) {
            if (newValue === value) return;
            observe(newValue); //监控当前设置的新值，
            value = newValue;
        }
    })
}

export function observe(data) {
    if (!isObject(data)) {
        return;
    }
    // 对数据进行defineProperty;
    return new Observer(data); // 可以看到当前数据是否被观测过。
}