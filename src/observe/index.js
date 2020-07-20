import { isObject } from '../utils'
import { arrayMethods } from './array'
import Dep from './dep'
class Observer {
  constructor (data) {
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
      /* eslint-disable */
      data.__proto__ = arrayMethods
      this.observeArray(data)
    } else {
      this.walk(data)
    }
  }
  observeArray (data) {
    for (let i = 0; i < data.length; i++) {
      observe(data[i])
    }
  }
  walk (data) {
    // 对象的循环
    Object.keys(data).forEach(key => {
      defineReactive(data, key, data[key]) // 定义响应式的数据变化
    })
  }
}

// vue2的性能，递归重写对象的get set
// vue3中改进， proxy
function defineReactive (data, key, value) {
  observe(value)
  let dep = new Dep()
  // console.log('创建dep');
  Object.defineProperty(data, key, {
    get () {
      // 这里会有取值操作， 给这个属性增加一个dep，这个dep要和刚刚放在全局标量上的watcher做一个对应关系。
      if (Dep.target) {
        dep.depend() // 让这个dep收集target;
        // console.log('收集',dep)
      }
      return value
    },
    set (newValue) {
      if (newValue === value) return
      observe(newValue) //监控当前设置的新值，
      value = newValue
      // 当我们更新数据后， 要
      dep.notify()
    }
  })
}

export function observe (data) {
  if (!isObject(data)) {
    return
  }
  // 对数据进行defineProperty;
  return new Observer(data) // 可以看到当前数据是否被观测过。
}
