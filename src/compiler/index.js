import { parseHTML } from './parser';

/**
 * 模板编译原理
 * 1. 先把我们的代码转换为 ast语法树 (1) parser解析
 * 2. 标记静态树  (2) 树的遍历标记 markup
 * 3. 通过ast产生的语法树，生成代码 => render函数 (3)codegen
 */
export function compileToFunctions(template) {
    let ast = parseHTML(template);

}