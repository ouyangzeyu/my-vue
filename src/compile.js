/* 负责解析模板内容 */

class Compile {
  // 参数1： 模板
  // 参数2： vue实例
  constructor (el, vm) {
    this.el = typeof el === 'string' ? document.querySelector(el) : el
    this.vm = vm
  }
}