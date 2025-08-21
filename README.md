## 介绍

onescan 前端页面

## 用法

### 安装依赖

npm install

### 项目启动

npm run dev

### 项目打包

npm run build

# `Git` 贡献提交规范

- 运行 npm git 即可 git add. && git cz && git push
- 参考 [vue](https://github.com/vuejs/vue/blob/dev/.github/COMMIT_CONVENTION.md) 规范 ([Angular](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-angular))

  - `feat` 增加新功能
  - `fix` 修复问题/BUG
  - `style` 代码风格相关无影响运行结果的
  - `perf` 优化/性能提升
  - `refactor` 重构
  - `revert` 撤销修改
  - `test` 测试相关
  - `docs` 文档/注释
  - `chore` 依赖更新/脚手架配置修改等
  - `workflow` 工作流改进
  - `ci` 持续集成
  - `types` 类型定义文件更改
  - `wip` 开发中

### 项目目录

```
├── .github # GitHub 配置文件
│ ├── ISSUE_TEMPLATE # 问题提交参考模板
│ ├── workflows git # 工作流
├── .husky # 代码提交前校验配置文件
├── .vscode # IDE 工具推荐配置文件
│ │ ├── extensions.json # 一键安装平台推荐的 vscode 插件
│ │ ├── settings.json # 设置扩展程序或 vscode 编辑器的一些属性
│ │ ├── vue3.0.code-snippets # vue3.0 代码片段
│ │ └── vue3.2.code-snippets # vue3.2 代码片段
├── build # 构建工具
│ │ ├── cdn.ts # 打包时采用 cdn 模式
│ │ ├── compress.ts # 打包时启用 gzip 压缩或 brotli 压缩
│ │ ├── index.ts # 导出环境变量、跨域代理函数
│ │ ├── info.ts # 输出打包信息（大小、用时）
│ │ ├── optimize.ts # vite 依赖预构建配置项
│ │ ├── plugins.ts # vite 相关插件存放处
├── deploy # 自动化部署配置
│ │ ├── deploy_store-management-res.yaml # 文件名中store-management为项目名
│ │ ├── Dockerfile # store-management为gitlab项目名、hchain-scan为打包后文件名（项目打包默认为dist）
│ │ ├── server.conf # 无需修改
├── locales # 国际化文件存放处
│ │ ├── en.yaml # 英文配置
│ │ ├── zh-CN.yaml # 中文配置
├── mock # mock 模拟后台数据
│ │ ├── asyncRoutes.ts # 模拟后台返回动态路由
│ │ ├── ...
├── node_modules # 模块依赖
├── public # 静态资源
│ │ ├── html # 静态 iframe 页面
│ │ ├── favicon.ico # favicon
│ │ ├── serverConfig.json # 全局配置文件（打包后修改也可生效）
├── src
│ ├── api # 接口请求统一管理
│ ├── assets # 字体、图片等静态资源
│ ├── components # 自定义通用组件
│ │ ├── ReAuth # 按钮级别权限管理组件
│ │ ├── ReIcon # 图标组件
│ ├── config # 获取平台动态全局配置
│ ├── directives # 自定义指令
│ │ ├── elResizeDetector # 监听容器改变指令
│ ├── layout # 主要页面布局
│ ├── plugins # 处理一些库或插件，导出更方便的 api
│ ├── router # 路由配置
│ ├── store # pinia 状态管理
│ ├── style # 全局样式
│ │ ├── dark.scss # 暗黑模式样式适配文件
│ │ ├── element-plus.scss # 全局覆盖 element-plus 样式文件
│ │ ├── reset.scss # 全局重置样式文件
│ │ ├── sidebar.scss # layout 布局样式文件
│ │ ├── tailwind.css # tailwindcss 自定义样式配置文件
│ │ ├── ...
│ ├── utils # 全局工具方法
│ │ ├── http # 封装 axios 文件
│ │ ├── progress # 封装 nprogress
│ │ └── auth.ts # 处理用户信息和 token 相关
│ │ └── globalPolyfills.ts # 解决项目可能因为安装某个依赖出现 `global is not defined` 报错
│ │ └── message.ts # 消息提示函数
│ │ ├── mitt.ts # 触发公共事件，类似 EventBus
│ │ ├── propTypes.ts # 二次封装 vue 的 propTypes
│ │ ├── responsive.ts # 全局响应式 storage 配置
│ │ ├── tree.ts # 树结构相关处理函数
│ ├── views # 存放编写业务代码页面
│ ├── App.vue # 入口页面
│ ├── main.ts # 入口文件
├── types # 全局 TS 类型配置
│ │ ├── global.d.ts # 全局类型声明文件
│ │ ├── index.d.ts # 全局类型声明文件
│ │ ├── index.ts # 全局类型声明文件
│ │ ├── shims-tsx.d.ts # 该文件是为了给 .tsx 文件提供类型支持，在编写时能正确识别语法
│ │ └── shims-vue.d.ts # .vue、.scss 文件不是常规的文件类型，typescript 无法识别，所以我们需要通过下图的代码告诉 typescript 这些文件的类型，防止类型报错
├── .cz-config.js # git检查、提交代码可视化配置，使用插件：commitizen、cz-customizable 参考 https://juejin.cn/post/7134487982597210120
├── .editorconfig # 编辑器读取文件格式及样式定义配置 <https://editorconfig.org/>
├── .env # 全局环境变量配置（当 .env 文件与 .env.development、.env.production、.env.staging 这三个文件之一存在相同的配置 key 时，.env 优先级更低）
├── .env.development # 开发环境变量配置
├── .env.production # 生产环境变量配置
├── .env.staging # 预发布环境变量配置
├── .eslintignore # eslint 语法检查忽略文件
├── .eslintrc.js # eslint 语法检查配置
├── .gitignore # git 提交忽略文件
├── .gitpod.yml # gitpod 部署配置
├── .markdownlint.json # markdown 格式检查配置
├── .npmrc # npm 配置文件
├── .prettierrc.js # prettier 插件配置
├── .stylelintignore # stylelint 插件检查忽略文件
├── commitlint.config.js # git 提交前检查配置 参考 https://blog.csdn.net/huangpb123/article/details/102690412
├── index.html # html 主入口
├── jenkinsenv # 自动化部署 -- jenkin环境配置
├── package.json # 依赖包管理以及命令配置
├── npm-lock.yaml # 依赖包版本锁定文件
├── postcss.config.js # postcss 插件配置
├── README.md # README
├── stylelint.config.js # stylelint 配置
├── tailwind.config.js # tailwindcss 配置
├── tsconfig.json # typescript 配置
└── vite.config.ts # vite 配置
```
