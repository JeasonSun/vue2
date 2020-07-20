// 每个属性都有一个dep属性， dep存放这watcher， 一个dep中有多个watcher，一个watcher可能被多个属性所依赖。

// dep和watcher是一个多对多的关系。
let id = 0
class Dep {
  constructor () {
    this.id = id++
    this.subs = []
  }

  depend () {
    // 1.让dep记住watcher
    // 2.让watcher记住dep，双向记忆
    if (Dep.target) {
      Dep.target.addDep(this)
    }
  }

  addSub (watcher) {
    this.subs.push(watcher)
  }

  notify () {
    this.subs.forEach(watcher => watcher.update())
  }
}

Dep.target = null // 默认target是空的。
const stack = []
export function pushTarget (watcher) {
  Dep.target = watcher
  stack.push(watcher)
}

export function popTarget () {
  stack.pop()
  Dep.target = stack[stack.length - 1]
}

export default Dep
