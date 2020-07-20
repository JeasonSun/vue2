const ncname = '[a-zA-Z_][\\-\\.0-9_a-zA-Z]*'
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
const startTagOpen = new RegExp(`^<${qnameCapture}`) // 标签开头的正则 捕获的内容是标签名
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`) // 匹配标签结尾的 </div>
/* eslint-disable */
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/ // 匹配属性的
const startTagClose = /^\s*(\/?)>/ // 匹配标签结束的 >
// const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g

export function parseHTML (html) {
  let root // 树根
  let currentParent
  const stack = [] // 用来判断标签是否正常闭合

  // 根据html解析成树结构
  while (html) {
    const textEnd = html.indexOf('<')
    if (textEnd === 0) {
      const startTagMatch = parseStartTag()
      if (startTagMatch) {
        start(startTagMatch.tagName, startTagMatch.attrs)
      }
      const endTagMatch = html.match(endTag)
      if (endTagMatch) {
        advance(endTagMatch[0].length)
        end(endTagMatch[1])
      }
    }
    // 如果不是0， 说明是文本
    let text
    if (textEnd > 0) {
      text = html.substring(0, textEnd)
      chars(text)
    }
    if (text) {
      advance(text.length)
    }
    // break;
  }

  function start (tagName, attrs) {
    // 开始标签，每次解析开始标签，都会执行此方法。
    // console.log(tagName, attrs);
    const element = createASTElement(tagName, attrs)
    if (!root) {
      root = element
    }
    currentParent = element
    stack.push(element)
  }
  function end (tagName) {
    // 确立父子关系；
    // console.log(tagName);
    const element = stack.pop()
    currentParent = stack[stack.length - 1]
    if (element.tag !== tagName) {
      throw new Error(`${tagName} tag is not closed`)
    }
    if (currentParent) {
      element.parent = currentParent
      currentParent.children.push(element)
    }
    // console.log(element);
  }
  function chars (text) {
    // console.log(text);
    // text = text.replace(/\s/g, '');
    text = text.trim()
    if (text) {
      currentParent.children.push({
        type: 3,
        text
      })
    }
  }
  function createASTElement (tagName, attrs) {
    return {
      tag: tagName,
      attrs,
      children: [],
      parent: null,
      type: 1 // 1.普通元素   3.文本
    }
  }

  function advance (n) {
    html = html.substring(n)
  }

  function parseStartTag () {
    const start = html.match(startTagOpen)
    if (start) {
      const match = {
        tagName: start[1],
        attrs: []
      }

      advance(start[0].length)
      let attr, end
      while (
        !(end = html.match(startTagClose)) &&
        (attr = html.match(attribute))
      ) {
        advance(attr[0].length)
        match.attrs.push({
          name: attr[1],
          value: attr[3] || attr[4] || attr[5]
        })
      }
      if (end) {
        advance(end[0].length)
        return match
      }
    }
  }

  return root
}
