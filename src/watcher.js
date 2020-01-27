/*
  负责将compile模块和observe模块关联起来
*/

class Watcher {
  /*
    vm：当前的vue实例
    expr：data中数据的名字
    cb：数据改变后的回调韩函数
  */
  constructor(vm, expr, cb) {
    this.vm = vm
    this.expr = expr
    this.cb = cb

    // 吧expr的旧值存起来
    this.oldValue = this.getVMValue(vm, expr)
  }

  // 用于更新数据
  update() {
    // 如果expr的值发生了改变，需要调用cb
    let oldValue = this.oldValue
    let newValue = this.getVMValue(this.vm, this.expr)
    if (oldValue != newValue) {
      this.cb(newValue, oldValue)
    }
  }

  // 用于获取vm中的数据
  getVMValue(vm, expr) {
    let data = vm.$data
    expr.split('.').forEach(key => {
      data = data[key]
    })
    return data
  }
}