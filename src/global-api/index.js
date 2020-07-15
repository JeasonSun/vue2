import { mergeOptions } from '../utils';

// Vue.directive Vue.filter Vue.component;

export function initGlobalApi(Vue) {
    Vue.options = {}; // 所有的全局api， 用户传递的参数，都会绑定到这个对象中。

    // 提取公共的方法、逻辑，通过此方法混合到每个实例中。
    Vue.mixin = function (mixin) {
        this.options = mergeOptions(this.options, mixin);
        console.log(this.options);
    }
}

