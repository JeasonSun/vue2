import { initMixin } from './init'
import { renderMixin } from './render'
import { lifeCycleMixin } from './lifecycle'
import { initGlobalApi } from './global-api/index'

function Vue (options) {
  // 内部要进行初始化的操作。
  this._init(options)
}

initMixin(Vue) // 添加原型的方法
// 组件的初始化
// Vue.prototype._init = function(options){

// }

renderMixin(Vue)
lifeCycleMixin(Vue)

// initGlobalApi 给构造函数扩展全局的方法；
initGlobalApi(Vue)

export default Vue
