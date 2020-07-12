import { isObject } from '../utils';
import { arrayMethods } from './array';
class Observer {
    constructor(data) {
        // data.__ob__ = this; // 可枚举，walk中会无限循环
        Object.defineProperty(data, '__ob__', {
            enumerable: false,
            configurable: false,
            value: this
        })
        // console.log(data);
        // 对数组索引进行拦截，性能差，而且直接更改索引的方式并不多。
        if (Array.isArray(data)) {
            // vue如何对数组进行处理呢？ 数组用的是重写数组的方法。 函数劫持。
            data.__proto__ = arrayMethods;
            this.observeArray(data);
        } else {
            this.walk(data);
        }

    }
    observeArray(data) {
        for (let i = 0; i < data.length; i++) {
            observe(data[i]);
        }
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