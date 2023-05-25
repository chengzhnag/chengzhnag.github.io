# 记沉博客

#### 介绍
- 使用VuePress生成静态HTML文件  
- 通过Github Pages能力可直接通过该仓库名当做域名访问。  
- 再通过GitHub Actions能力自动部署。  

#### 架构
VuePress  
vuepress-theme-reco(主题)

#### 写博客
- 在docs文件夹下，根据日期写md文件即可。  
- master有push后，会触发GitHub Actions自动部署

#### Actions自动部署
进入仓库 settings 页面的 GitHub Pages 配置，选择部署来源为“GitHub Actions”
```
# 将静态内容部署到 GitHub Pages 的简易工作流程
name: Auto Deploy Blog

on:
  # 这个选项可以使你手动在 Action tab 页面触发工作流
  workflow_dispatch:
  # 触发条件：在 push 到 master 分支后
  push:
    branches:
      - master
      
# 设置 GITHUB_TOKEN 的权限，以允许部署到 GitHub Pages。
permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      # 克隆代码
      - uses: actions/checkout@v1
      
      # 固定版本
      - uses: actions/setup-node@v3
        with:
          node-version: 12.7.0
      
      # 安装依赖
      - name: npm install
        run: npm install

      # 构建VuePress
      - name: Build
        run: npm run build

      # 用于打包和上传artifacts的复合 Action，可以部署到 GitHub Pages。
      - uses: actions/upload-pages-artifact@v1
        with:
            path: docs/.vuepress/dist

      # 此操作用于将Actions artifacts部署到 GitHub Pages。
      - name: Deploy
        id: deployment
        uses: actions/deploy-pages@v2
```

