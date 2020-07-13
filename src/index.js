import { initMixin } from './init';
import { renderMixin } from './render';
import { lifeCycleMixin } from './lifecycle';

function Vue(options) {
    // 内部要进行初始化的操作。
    this._init(options);

}

initMixin(Vue); // 添加原型的方法
// 组件的初始化
// Vue.prototype._init = function(options){

// }

renderMixin(Vue);
lifeCycleMixin(Vue);

export default Vue;