module.exports = {
  // 运行环境和导入导出规范，js版本
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true
  },

  // 指定如何解析语法
  parser: "vue-eslint-parser",

  // 优先级低于 parse 的语法解析配置
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    parser: "@typescript-eslint/parser",
    jsxPragma: "React",
    ecmaFeatures: {
      jsx: true
    }
  },

  // 继承已有的推荐eslint规则，也可以设置vue等框架的eslint插件。一个值就用字符串，多个值就放到数组中
  extends: [
    "eslint:recommended",
    "plugin:vue/vue3-essential",
    "standard-with-typescript",
    "plugin:@typescript-eslint/recommended"
  ],

  // 插件
  plugins: ["vue", "@typescript-eslint"],

  /* 额外自定义的规则
   * "off" 或 0    ==>  关闭规则
   * "warn" 或 1   ==>  打开的规则作为警告（不影响代码执行）
   * "error" 或 2  ==>  规则作为一个错误（代码不能执行，界面报错）
   * ["error或warn", config] ==> 额外配置更多选项
   */
  rules: {
    // eslint（https://eslint.bootcss.com/docs/rules/）
    quotes: ["error", "double", { avoidEscape: true, allowTemplateLiterals: true }], // 双引号和反引号包裹字符串
    semi: ["error", "always"], // 结尾加分号
    "space-before-function-paren": ["error", "never"], // 函数名和括号之间没有空格
    "no-var": "error", // 要求使用 let 或 const 而不是 var
    "no-multiple-empty-lines": ["warn", { max: 1 }], // 不允许多个空行
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-unexpected-multiline": "error", // 禁止空余的多行
    "no-useless-escape": "off", // 禁止不必要的转义字符

    // typeScript (https://typescript-eslint.io/rules)
    "@typescript-eslint/no-unused-vars": "error", // 禁止定义未使用的变量
    "@typescript-eslint/prefer-ts-expect-error": "error", // 禁止使用 @ts-ignore
    "@typescript-eslint/no-explicit-any": "off", // 禁止使用 any 类型
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/no-namespace": "off", // 禁止使用自定义 TypeScript 模块和命名空间。
    "@typescript-eslint/semi": "off",

    // eslint-plugin-vue (https://eslint.vuejs.org/rules/)
    "vue/multi-word-component-names": "off", // 要求组件名称始终为 “-” 链接的单词
    "vue/script-setup-uses-vars": "error", // 防止<script setup>使用的变量<template>被标记为未使用
    "vue/no-mutating-props": "off", // 不允许组件 prop的改变
    "vue/attribute-hyphenation": "off" // 对模板中的自定义组件强制执行属性命名样式
  }
};
