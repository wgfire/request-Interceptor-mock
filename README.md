# mT插件功能列表：

+ 拦截所有的请求
  - 难点在与设计代理xhr对象，覆盖属性和监听方法
  - 对于修改请求头的信息，需要放在readystate等于1的时候修改
  - 对于同一属性比如timeout 插件设置的值要覆盖用户设置的值
+ 可视化输出及交互数据
  - 通信时机如何设计，需要background content pagescript 三方通信以及数据交互来满足一些需求
  - popup的交互需要改变pageScript执行的代码数据
+ 替换状态码、响应头、body数据
+ mock数据
+ 支持多个项目管理

