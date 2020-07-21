export function patch (oldVnode, newVnode) {
  // console.log(oldVnode, newVnode);
  const isRealElement = oldVnode.nodeType
  if (isRealElement) {
    // 真实元素
    const oldElm = oldVnode
    const parentElm = oldElm.parentNode
    const el = createElm(newVnode)
    parentElm.insertBefore(el, oldElm.nextSibling)
    parentElm.removeChild(oldElm)
    return el // 渲染的真实dom
  } else {
    // diff算法
    // 同层级比较，默认想完整比对一棵树O(n^3)   => O(n)
    // 不需要跨级比较
    // 两棵树 要先比较树根一不一样，再去比较儿子是否一样。
    if (oldVnode.tag !== newVnode.tag) {
      // 标签名不一致，说明是两个不一样的节点
      oldVnode.el.parentNode.replaceChild(createElm(newVnode), oldVnode.el)
    }
    if (!oldVnode.tag) {
      // 如果是文本，文本变化了，直接用新的文本替换掉老的文本
      if (oldVnode.text !== newVnode.text) {
        oldVnode.el.textContent = newVnode.text
      }
    }
    // 一定是标签了，而且标签一致
    // 需要复用老的节点，替换掉老的属性
    const el = (newVnode.el = oldVnode.el)
    updateProperties(newVnode, oldVnode.data) // 此时属性就更新完毕了，当前的树根就更新完毕了

    // 比较孩子节点
    const oldChildren = oldVnode.children || []
    const newChildren = newVnode.children || []

    // 新老都有孩子，那就比较  diff 核心
    // 老的有孩子，新的没有，直接删除
    // 新的有孩子，老的没有，直接插入

    if (oldChildren.length > 0 && newChildren.length > 0) {
      // diff 两个都有儿子， 这里要不停的去比较孩子节点
      updateChildren(el, oldChildren, newChildren)
    } else if (oldChildren.length > 0) {
      el.innerHTML = ''
    } else if (newChildren.length > 0) {
      for (let i = 0; i < newChildren.length; i++) {
        const child = newChildren[i]
        el.appendChild(createElm(child))
      }
    }

    return el
  }
}

function updateChildren (parent, oldChildren, newChildren) {
  // vue 2.0 使用双指针的方式来进行比对
  // v-for 要有key， key可以标识元素是否发生变化，前后的key相同，则可以服用这个元素
  let oldStartIndex = 0 // 老的开始索引
  let oldStartVnode = oldChildren[0] // 老的开始
  let oldEndIndex = oldChildren.length - 1 // 老的尾部索引
  let oldEndVnode = oldChildren[oldEndIndex] // 老的最后一个

  let newStartIndex = 0 // 新的开始索引
  let newStartVnode = newChildren[0] // 新的开始
  let newEndIndex = newChildren.length - 1 // 新的尾部索引
  let newEndVnode = newChildren[newEndIndex] // 新的最后一个
  // 1方案， 先开始从头部进行比较 O(n)
  while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
    // 如何判断，两个虚拟节点是否一致，就是用key + type进行判断
    if (isSameVnode(oldStartVnode, newStartVnode)) {
      // 标签和key一致，但是元素可能属性不一致
      patch(oldStartVnode, newStartVnode) // 自身属性+递归比较
      oldStartVnode = oldChildren[++oldStartIndex]
      newStartVnode = newChildren[++newStartIndex]
    }
  }

  if (newStartIndex <= newEndIndex) {
    for (let i = newStartIndex; i <= newEndIndex; i++) {
      parent.appendChild(createElm(newChildren[i]))
    }
  }
  if (oldStartIndex <= oldEndIndex) {
    for (let i = oldStartIndex; i <= oldEndIndex; i++) {
      parent.removeChild(oldChildren[i].el)
    }
  }
}

function isSameVnode (oldVnode, newVnode) {
  return oldVnode.key === newVnode.key && oldVnode.tag === newVnode.tag
}

export function createElm (vnode) {
  // return document.createElement('div');
  const { tag, children, text } = vnode
  if (typeof tag === 'string') {
    // 元素
    // 将虚拟节点和真实节点做一个隐射关系（后面diff时候，如果元素相同，直接复用老元素）；
    vnode.el = document.createElement(tag)
    updateProperties(vnode)
    children.forEach(child => {
      // 递归渲染子节点，将子节点渲染到父节点中。
      vnode.el.appendChild(createElm(child))
    })
  } else {
    // 普通的文本
    vnode.el = document.createTextNode(text)
  }
  return vnode.el
}

function updateProperties (vnode, oldProps = {}) {
  // 需要比较vnode.data 和 oldProps的差异
  const el = vnode.el
  const newProps = vnode.data || {}
  // 获取老的样式和新的样式的差异，如果新的上面丢失了属性，应该在老的元素上删除掉
  const newStyle = newProps.style || {}
  const oldStyle = oldProps.style || {}
  for (const key in oldStyle) {
    if (!newStyle[key]) {
      el.style[key] = ''
    }
  }
  for (const key in oldProps) {
    if (!newProps[key]) {
      el.removeAttribute(key)
    }
  }
  // 其他情况直接用新的值覆盖掉老的值即可
  for (const key in newProps) {
    if (key === 'style') {
      for (const styleName in newProps.style) {
        el.style[styleName] = newProps.style[styleName]
      }
    } else {
      el.setAttribute(key, newProps[key])
    }
  }
}
