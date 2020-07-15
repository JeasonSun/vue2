
export function createTextVNode(text) {
    // console.log(text);
    return vnode(undefined, undefined, undefined, undefined, text);
}

export function createElement(tag, data = {}, ...children) {
    // console.log(tag, data, children);
    // vue中的key，不会作为属性传递给组件
    let key = data.key;
    if (key) {
        delete data.key;
    }
    return vnode(tag, data, key, children)

}

// 虚拟节点是产生一个对象， 用来描述dom结构。
function vnode(tag, data, key, children, text) {
    return {
        tag,
        data,
        key,
        children,
        text
    }
}