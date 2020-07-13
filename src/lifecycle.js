import Watcher from './observe/watcher';

export function mountComponent(vm, el) {
    // console.log(vm, el);
    // Vue在渲染的过程中，会创建一个所谓的渲染watcher， 只用来渲染
    // vue 响应式数据的规则，数据变了， 视图会刷新。
    // Vue 不是MVVM框架
    const updateComponent = () => {
        // 内部会调用刚才我们解析后的render方法 => vNode
        // vm._render() => 调用options.render 方法， 得到VNode虚拟节点
        // vm._update() => 将虚拟dom变成真实dom来执行。
        vm._update(vm._render());
    }

    // 每次数据变化，就执行updateComponent
    new Watcher(vm, updateComponent, () => { }, true);

}

export function lifeCycleMixin(Vue) {
    Vue.prototype._update = function (vnode) {
        console.log(vnode, '_update');

    }
}