### 使用说明

1. 根据[文档](https://sh-agilebot.github.io/extension/02-development/01-environment)安装 `Node.js`。
1. 运行 `pnpm i` 安装依赖。
1. 本地调试时，执行 `pnpm watch`，当 `script.js` 发生改动时，自动生成转义文件 `script-compiled.js`。
1. 准备部署时，可以执行 `pnpm build` ，与上述步骤不同，不会监听文件改动。
