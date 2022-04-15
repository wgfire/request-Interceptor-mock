# mT插件功能列表：

+ 拦截所有的请求
  - 难点在与设计代理xhr对象，覆盖属性和监听方法
  - 对于修改请求头的信息，需要放在readystate等于1的时候修改
  - 对于同一属性比如timeout 插件设置的值要覆盖用户设置的值
+ 可视化输出及交互数据
  - 通信时机如何设计，需要background content pagescript 三方通信以及数据交互来满足一些需求
  - popup的交互需要改变pageScript执行的代码数据
  - 代理的xhr对象需要在所有请求前面之前运行，但是必须又要先通过通信拿到保存的数据，这样可能导致有部分请求在挂载之前就发送出去了
+ 替换状态码、响应头、body数据
  - 如果接口报404 那么要支持手动改成200



# Bugs
 - 由于popup界面 没有使用iframe 导致百度首页没有滚动条

 # 效果图
 !['效果图'](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/496ffa26226e4857a1b78d79d8a21fb1~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)

 # 待更新
 - 手动请求
 - 请求代理 - （到其他地址拿数据过来）
 - 接入mock规则造数据
 - 支持fetch
 - 完善动画交互/ui界面
 - url分类（项目管理）
 - 。。。