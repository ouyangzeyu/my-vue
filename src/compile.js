/* 负责解析模板内容 */

class Compile {
  // 参数1： 模板
  // 参数2： vue实例
  constructor(el, vm) {
    this.el = typeof el === 'string' ? document.querySelector(el) : el
    this.vm = vm

    // 编译模板
    if (this.el) {
      // 1 把el中所有的子节点放入到内存中，提高渲染效率
      let fragment = this.nodeToFragment(this.el)

      // 2 在内存中编译fragment
      this.compile(fragment)

      // 3 把fragment一次性添加到页面上
      this.el.appendChild(fragment)
    }
  }

  /* 核心方法 */
  nodeToFragment(node) {
    let fragment = document.createDocumentFragment()

    // 把el中的子节点添加到文档碎片中
    let childNodes = node.childNodes
    this.toArray(childNodes).forEach(item => {
      fragment.appendChild(item)
    })
    return fragment
  }

  compile(fragment) {
    let childNodes = fragment.childNodes
    this.toArray(childNodes).forEach(node => {
      // 编译子节点
      // 如果是元素，需要解析指令
      if (this.isElementNode(node)) {
        this.compileElement(node)
      }
      // 如果是文本节点，需要解析插值表达式
      if (this.isTextNode(node)) {
        this.compileText(node)
      }
      // 如果子节点还有子节点，需要递归进行解析
      if (node.childNodes && node.childNodes.length > 0) {
        this.compile(node)
      }
    })
  }

  // 解析html
  compileElement(node) {
    // 获取到当前节点下所有的属性
    let attributes = node.attributes
    this.toArray(attributes).forEach(attr => {
      // 解析vue指令
      let attrName = attr.name
      if (this.isDirective(attrName)) {
        let type = attrName.slice(2)
        let expr = attr.value

        // v-on指令
        if (this.isEventDirective(type)) {
          CompileUtils['eventHandler'](node, this.vm, type, expr)
        } else {
          CompileUtils[type] && CompileUtils[type](node, this.vm, expr)
        }
      }
    })
  }

  // 解析文本
  compileText(node) {
    CompileUtils.mustache(node, this.vm)
  }

  /* 工具方法 */
  toArray(likeArray) {
    return [].slice.call(likeArray)
  }

  isElementNode(node) {
    return node.nodeType === 1 // 元素节点
  }

  isTextNode(node) {
    return node.nodeType === 3 // 文本节点
  }

  // 判断是否是指令
  isDirective(attrName) {
    return attrName.startsWith('v-')
  }

  isEventDirective(attrName) {
    return attrName.split(':')[0] === 'on'
  }
}

/* 对指令的统一处理， */
let CompileUtils = {
  mustache(node, vm) {
    let txt = node.textContent
    let reg = /\{\{(.+)\}\}/ // {{}}插值表达式中可以是一个以上的任意字符
    if (reg.test(txt)) {
      let expr = RegExp.$1 // 拿到第一个分组
      node.textContent = txt.replace(reg, this.getVMValue(vm, expr))
    }
  },

  text(node, vm, expr) {
    node.textContent = this.getVMValue(vm, expr)
  },
  html(node, vm, expr) {
    node.innerHTML = this.getVMValue(vm, expr)
  },
  model(node, vm, expr) {
    node.value = this.getVMValue(vm, expr)
  },
  eventHandler(node, vm, type, expr) {
    // 给当前元素注册事件
    let eventType = type.split(':')[1]
    let fn = vm.$methods && vm.$methods[expr]
    if (eventType && fn) {
      node.addEventListener(eventType, fn.bind(vm))
    }
  },
  // 用于获取vm中的数据
  getVMValue(vm, expr) {
    let data = vm.$data
    expr.split('.').forEach(key => {
      data = data[key]
    })
    return data
  }
}