# vue

Vue2 核心源码解析
[珠峰培训](http://zhufengpeixun.com/jiagou/vue-analyse/one.html)

* 数据的响应式处理
* 数组的响应式处理
* 模板编译
  * 模板解析流程

* options.render;

* mountComponent

```javascript
const updateComponent = () => {
    vm._update(vm._render());
}

// 每次数据变化，就执行updateComponent
new Watcher(vm, updateComponent, () => { }, true);
```

* Watcher
* updateComponent
* vm._render 创建虚拟节点
* vm._update 创建真实节点
* mixin
  * 生命周期合并策略，生命周期的执行
* 依赖收集
  1. 对于data做observe观察的时候给每个key添加了一个new Dep。
  2. lifecycle.js中在首次渲染时创建一个Watcher, mountComponent -> new Watcher
  3. new Watcher中会 pushTarget(this); this.getter();popTarget();三步走，也就是在`vm._update(vm._render());`前后加减一个全局watcher。在vm._update中会去触发获取值的defineProperty.get函数，
  4. defineProperty.get函数中执行dep.depend()。在dep.depend中会往当前全局watcher中加入这个dep。
  5. 在watcher中加入dep的同时也会在dep上添加相应的watcher，从而实现watcher和dep的双向绑定。
* 依赖收集
  1. 先把渲染watcher放到了Dep.target上。
  2. this.getter()会去页面中取值渲染，就是调用defineProperty的取值操作。
  3. 获取当前全局Dep.target， 每个属性都有一个dep，取值时候就将Dep.target保存在dep中。同时在dep中保存watcher。
* todo 数组的依赖收集
* 通过页面更新
* 异步更新策略
