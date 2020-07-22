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

// ------------ diff -------------
// diff 是比较两个树的差异（虚拟Dom）， 把前后的dom节点渲染成虚拟dom，通过虚拟节点比对，找到差异，然后更新真是dom节点。

/* eslint-disable */
import { compileToFunctions } from './compiler/index'
import { createElm, patch } from './vdom/patch'
let vm1 = new Vue({ data: { name: 'zf' } })
let vm2 = new Vue({ data: { name: 'mojie' } })
// let render1 = compileToFunctions(`<div style="background:red;color:white" id="a" c="test">{{name}}</div>`)
let render1 = compileToFunctions(`<ul >
  
  <li key='a' id='a'>A</li>
  <li key='b' id='b'>B</li>
  <li key='c' id='c'>C</li>
  <li key='d' id='d'>D</li>
  
</ul>`)
let oldVnode = render1.call(vm1)
let realElement = createElm(oldVnode)
document.body.appendChild(realElement)

// let render2 = compileToFunctions(`<div style="background:yellow" id="b">{{name}}</div>`)
let render2 = compileToFunctions(`<ul >

 
  <li key='c' id='c'>C</li>
  <li key='d' id='d'>D</li>
  <li key='m' id='a'>M</li>
  <li key='e' id='b'>E</li>
  
  
</ul>`)
let newVnode = render2.call(vm2)
// 没有虚拟dom和diff算法时，直接重新渲染，强制重新更新页面（没有复用老的节点）
// diff 算法   先比对差异，再进行更新。
setTimeout(() => {
  // patch(realElement, newVnode)
  patch(oldVnode, newVnode)
}, 2000)

export default Vue
