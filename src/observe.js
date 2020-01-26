/*
  数据劫持
*/

class Observe {
  constructor(data) {
    this.data = data
    this.walk(data)
  }

  /*
    核心方法
  */
  // 遍历data中所有的属性，并且添加上getter和setter
  walk(data) {
    if (!data || typeof data != 'object') {
      return
    }

    Object.keys(data).forEach(key => {
      this.defineReactive(data, key, data[key])
      // 如果data[key]是复杂类型的数据，需要递归操作添加数据劫持
      this.walk(data[key])
    })
  }

  defineReactive(obj, key, value) {
    let that = this
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get() {
        return value
      },
      set(newValue) {
        if (value === newValue) {
          return
        }
        value = newValue

        // 如果newValue是一个对象，也需要进行劫持
        that.walk(newValue)
      }
    })
  }
}