# mT 插件功能列表：

- 拦截所有的请求
  - 难点在与设计代理 xhr 对象，覆盖属性和监听方法
  - 对于修改请求头的信息，需要放在 readystate 等于 1 的时候修改
  - 对于同一属性比如 timeout 插件设置的值要覆盖用户设置的值
- 可视化输出及交互数据
  - 通信时机如何设计，需要 background content pagescript 三方通信以及数据交互来满足一些需求
  - popup 的交互需要改变 pageScript 执行的代码数据
  - 代理的 xhr 对象需要在所有请求前面之前运行，但是必须又要先通过通信拿到保存的数据，这样可能导致有部分请求在挂载之前就发送出去了
- 替换状态码、响应头、body 数据
  - 如果接口报 404 那么要支持手动改成 200

# 更新列表

- 2022/4/17：已支持 fetch 请求
- 2022/4/21：将 popup 界面改为 iframe 渲染，重新整理通信逻辑
- 2022/4/22：增加统一复制操作按钮

# 问题总结：

- 改为 iframe 渲染后，通信链路很长，之前 popup 用 div 渲染，跟 pagescript 通信和 content 通信很方便，现在两者之前通信都要通过 background，和 content 做跳转。 1.比如展开和收缩，popup 只能发送消息到 background,然后在转发到 content 改变 iframe 的样式， 2.更新 mock 列表，pagescript 只能发送消息到 content,content 到 background，然后 background 在发送到 popup。

# 效果图

!['效果图'](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/496ffa26226e4857a1b78d79d8a21fb1~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)

# 待更新

- 手动请求
- 请求代理 - （到其他地址拿数据过来）
- 接入 mock 规则造数据
- 完善动画交互/ui 界面
- url 分类（项目管理）
- 。。。
