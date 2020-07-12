import { parseHTML } from './parser';
import { generate } from './generator';

/**
 * 模板编译原理
 * 1. 先把我们的代码转换为 ast语法树 (1) parser解析
 * 2. 标记静态树  (2) 树的遍历标记 markup
 * 3. 通过ast产生的语法树，生成代码 => render函数 (3)codegen
 */
export function compileToFunctions(template) {
    let ast = parseHTML(template);

    //2. 标记静态树  (2) 树的遍历标记 markup

    //3. 代码生成:核心就是字符串拼接；
    let code = generate(ast);
    console.log(code);


}