import { initState } from './state';
import { compileToFunctions } from './compiler/index';

export function initMixin(Vue) {
    Vue.prototype._init = function (options) {
        // console.log(options);
        // Vue的内部， $options就是用户传递的所有参数。
        const vm = this;
        vm.$options = options; // 用户传入的参数。

        // options.data    props  computed watch
        initState(vm); //初始化状态；

        // 需要通过模板进行渲染
        if (vm.$options.el) {
            vm.$mount(vm.$options.el);
        }
    }

    Vue.prototype.$mount = function (el) {
        // 可能是字符串，也可能是一个dom对象。
        el = document.querySelector(el);
        // 如果同时传入template和render，默认会使用render，抛弃template,如果都没有传，就使用id='app'中的模板；
        const vm = this;
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


    }
}