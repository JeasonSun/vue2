export function isObject(obj) {
    return typeof obj == 'object' && obj !== null;
}

const LIFECYCLE_HOOKS = [
    'beforeCreate',
    'created',
    'beforeMount',
    'mounted',
    'beforeUpdate',
    'updated',
    'beforeDestroy',
    'destroyed',
]
let strategy = {};
function mergeHook(parentVal, childVal) {
    if (childVal) {
        if (parentVal) {
            return parentVal.concat(childVal);
        } else {
            return [childVal];
        }
    } else {
        return parentVal;
    }
}

LIFECYCLE_HOOKS.forEach(hook => {
    strategy[hook] = mergeHook;
});

strategy.data = function (parent, child) {
    let parentData = typeof parent === 'function' ? parent() : parent ? parent : {};
    let childData = typeof child === 'function' ? child() : child ? child : {};
    return {
        ...parentData,
        ...childData
    }
}

strategy.computed = function (parent, child) {

}


export function mergeOptions(parent, child) {
    const options = {};
    for (let key in parent) {
        mergeField(key);
    }
    for (let key in child) {
        if (!parent.hasOwnProperty(key)) {
            mergeField(key);
        }
    }
    function mergeField(key) {
        // 策略模式，根据不同的属性，调用不同的策略
        if (strategy[key]) {
            options[key] = strategy[key](parent[key], child[key]);
        } else {
            if (isObject(parent[key]) && isObject(child[key])) {
                options[key] = {
                    ...parent[key],
                    ...child[key]
                }
            } else {
                options[key] = child[key] || parent[key];
            }
        }
    }
    return options;
}