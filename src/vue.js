
/* 定义一个类，用于创建vue实例 */
class Vue {
  constructor(options) {
    options = options || {}
    // 给vue实例增加属性
    this.$el = options.el
    this.$data = options.data
    this.$methods = options.methods

    // 监视data中的数据
    new Observe(this.$data)

    // 如果指定了el参数，对el进行解析
    if (this.$el) {
      // 负责解析模板的内容
      // 需要模板和数据
      new Compile(this.$el, this)

    }
  }
}