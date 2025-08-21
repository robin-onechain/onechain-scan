module.exports = {
  ignores: [commit => commit.includes("init")],
  extends: ["@commitlint/config-conventional"],
  rules: {
    "body-leading-blank": [2, "always"], //body换行
    "footer-leading-blank": [1, "always"], //footer以空行开头
    "header-max-length": [2, "always", 108], //header最长100
    "subject-empty": [2, "never"], //subject 不能为空
    "type-empty": [2, "never"], //never：type不能为空 always：type必须为空
    "type-enum": [
      //type枚举
      2,
      "always",
      [
        "feat", //新增特性 (feature)
        "fix", //修复 Bug(bug fix)
        "docs", //修改文档 (documentation)
        "style", //代码格式修改(white-space, formatting, missing semi colons, etc)
        "refactor", //代码重构(refactor)
        "perf", //改善性能(A code change that improves performance)
        "test", //测试(when adding missing tests)
        "chore", //变更构建流程或辅助工具(比如更改测试环境)
        "revert", //代码回退
        "build", //变更项目构建或外部依赖（例如 scopes: webpack、gulp、npm 等）
        "ci", //更改持续集成软件的配置文件和 package 中的 scripts 命令，例如 scopes: Travis, Circle 等
        "wip", //正在开发中
        "workflow", //工作流程改进
        "types", // 类型定义文件修改
        "release" //发布新版本
      ]
    ]
  }
};
//提交规范：type（scope？）：subject 换行 body 换行 footer
