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
  * 生命周期合并策略 3.43
* 依赖收集
