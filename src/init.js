import { initState } from './state';
import { compileToFunctions } from './compiler/index';
import { mountComponent, callHook } from './lifecycle';
import { mergeOptions } from './utils';

export function initMixin(Vue) {
    Vue.prototype._init = function (options) {
        // console.log(options);
        // Vue的内部， $options就是用户传递的所有参数。
        const vm = this;
        // vm.$options = options; // 用户传入的参数。
        vm.$options = mergeOptions(vm.constructor.options, options);
        // console.log(vm.$options);
        callHook(vm, 'beforeCreate');
        // options.data    props  computed watch
        initState(vm); //初始化状态；
        callHook(vm, 'created');

        // 需要通过模板进行渲染
        if (vm.$options.el) {
            vm.$mount(vm.$options.el);
        }
    }

    Vue.prototype.$mount = function (el) {
        const vm = this;
        // 可能是字符串，也可能是一个dom对象。
        el = vm.$el = document.querySelector(el);
        // 如果同时传入template和render，默认会使用render，抛弃template,如果都没有传，就使用id='app'中的模板；
        const opts = vm.$options;

        if (!opts.render) {
            let template = opts.template;
            if (!template && el) { // 应该编译el中的模板
                template = el.outerHTML;
            }
            const render = compileToFunctions(template);
            opts.render = render;
        }
        // 走到这里，说明不需要编译了，因为用户传入的就是一个render函数。
        // console.log(opts.render);
        mountComponent(vm, el); // 组件的挂载流程。

    }
}