import { createTextVNode, createElement } from './vdom/create-element';
export function renderMixin(Vue) {
    Vue.prototype._render = function () {
        // console.log('_render');
        // 调用options.render方法；
        const vm = this;
        const { render } = vm.$options;
        Vue.prototype._v = function (text) {
            // 创建文件的虚拟节点
            return createTextVNode(text);
        }
        Vue.prototype._c = function () {
            return createElement(...arguments);
        }
        Vue.prototype._s = function (val) {
            return val == null ? '' : (typeof val === 'object' ? JSON.stringify(val) : val);
        }
        let vnode = render.call(vm);
        return vnode;
    }
}