const oldArrayMethods = Array.prototype // 获取数组原型方法；

export const arrayMethods = Object.create(oldArrayMethods)

const methods = [
  // 这7个方法都可以改变原数组。
  'push',
  'pop',
  'shift',
  'unshift',
  'sort',
  'reverse',
  'splice'
]

methods.forEach(method => {
  arrayMethods[method] = function (...args) {
    // AOP 函数劫持
    const ob = this.__ob__
    const result = oldArrayMethods[method].apply(this, args)
    // push unshift splice 都可以新增属性， 新增的属性可能是一个对象类型。
    // 内部还对数组中的引用类型做了一次劫持。
    let inserted
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice': // 新增，可以修改，可以删除 [].splice(arr, 1, 'div');
        inserted = args.slice(2)
        break
      default:
        break
    }
    inserted && ob.observeArray(inserted)
    return result
  }
})
