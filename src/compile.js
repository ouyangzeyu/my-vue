/* 负责解析模板内容 */

class Compile {
  // 参数1： 模板
  // 参数2： vue实例
  constructor (el, vm) {
    this.el = typeof el === 'string' ? document.querySelector(el) : el
    this.vm = vm

    // 编译模板
    if (this.el) {
      // 1 把el中所有的子节点放入到内存中，提高渲染效率
      let fragment = this.nodeToFragment(this.el)

      // 2 在内存中编译fragment
      this.compile(fragment)

      // 3 把fragment一次性添加到页面上
    }
  }

  /* 核心方法 */
  nodeToFragment (node) {
    let fragment = document.createDocumentFragment()

    // 把el中的子节点添加到文档碎片中
    let childNodes = node.childNodes
    this.toArray(childNodes).forEach(item => {
      fragment.appendChild(item)
    })
  }

  compile (fragment) {
    let childNodes = fragment.childNodes
    this.toArray(childNodes).forEach(node => {
      // 编译子节点
      // 如果是元素，需要解析指令

      // 如果是文本节点，需要解析插值表达式
    })
  }

  /* 工具方法 */
  toArray (likeArray) {
    return [].slice.call(likeArray)
  }
}