const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;

export function generate(el) {
    // console.log(el);

    let children = genChildren(el);
    let code = `_c("${el.tag}", ${
        el.attrs.length ? genProps(el.attrs) : undefined
        }${
        children ? ',' + children : ""
        })`;
    return code;
}

function genProps(attrs) {
    // console.log(attrs);
    let str = '';
    for (let i = 0; i < attrs.length; i++) {
        let attr = attrs[i];
        if (attr.name === 'style') {
            let obj = {};
            attr.value.split(';').forEach(item => {
                let [key, value] = item.split(':');
                obj[key] = value;
            })
            attr.value = obj;
        }
        str += `${attr.name}:${JSON.stringify(attr.value)},`
    }
    // console.log(str, '====', `${str.slice(0, -1)}`);

    return `{${str.slice(0, -1)}}`;
}

function genChildren(el) {
    const children = el.children;
    if (children) {
        return children.map(c => gen(c)).join(',')
    } else {
        false
    }
}

function gen(node) {
    if (node.type === 1) {
        return generate(node);
    } else {
        // 文本的处理
        let text = node.text;
        // hello world {{msg}}  aa {{bb}}
        // => _v('hello world' + _s(msg) + 'aa' + _s(bb))
        if (!defaultTagRE.test(text)) {
            return `_v(${JSON.stringify(text)})`;
        } else { 
            let tokens = []; // /g 每次正则使用过后，都需要重新制定 lastIndex
            let lastIndex = defaultTagRE.lastIndex = 0;
            let match, index;
            while (match = defaultTagRE.exec(text)) {
                index = match.index;
                tokens.push(JSON.stringify(text.slice(lastIndex, index)));

                tokens.push(`_s(${match[1].trim()})`);
                lastIndex = index + match[0].length;
            }
            if (lastIndex < text.length) {
                tokens.push(JSON.stringify(text.slice(lastIndex)));
            }
            // console.log(tokens);
            return '_v(' + tokens.join('+') + ')'
        }
    }
}

// 语法级的编译