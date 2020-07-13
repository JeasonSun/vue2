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
    code = `with(this){return ${code}}`;
    let render = new Function(code); // 相当于给字符串变成了函数。
    // console.log(render);
    // TODO: 注释节点   自闭和标签  事件绑定  @click  class   slot插槽
    return render;
}