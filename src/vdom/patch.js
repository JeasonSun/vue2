export function patch(oldVnode, newVnode) {
    // console.log(oldVnode, newVnode);
    const isRealElement = oldVnode.nodeType;
    if (isRealElement) {
        // 真实元素
        const oldElm = oldVnode;
        const parentElm = oldElm.parentNode;
        let el = createElm(newVnode);
        parentElm.insertBefore(el, oldElm.nextSibling);
        parentElm.removeChild(oldElm);
        return el; // 渲染的真实dom
    }
}

function createElm(vnode) {
    // return document.createElement('div');
    let { tag, children, data, key, text } = vnode;
    if (typeof tag == 'string') {
        // 元素
        // 将虚拟节点和真实节点做一个隐射关系（后面diff时候，如果元素相同，直接复用老元素）；
        vnode.el = document.createElement(tag);
        updateProperties(vnode);
        children.forEach(child => {
            // 递归渲染子节点，将子节点渲染到父节点中。
            vnode.el.appendChild(createElm(child));
        })
    } else {
        // 普通的文本
        vnode.el = document.createTextNode(text);
    }
    return vnode.el;
}

function updateProperties(vnode) {
    let el = vnode.el;
    let newProps = vnode.data || {};
    for (let key in newProps) {
        if (key === 'style') {
            for (let styleName in newProps.style) {
                el.style[styleName] = newProps.style[styleName];
            }
        }
        // TODO:
        else {
            el.setAttribute(key, newProps[key]);
        }
    }
}