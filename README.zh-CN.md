# 中华诗词时间轴网站

*与您的 [v0.app](https://v0.app) 部署自动同步*

[![部署于 Vercel](https://img.shields.io/badge/部署于-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/page1/v0-poetry-timeline-website)
[![使用 v0 构建](https://img.shields.io/badge/使用-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/bXx1IvXuTZ1)

## 项目概述

这是一个以时间轴形式展示中国古代诗人及其作品的网站。项目最初使用 [v0.app](https://v0.app) 构建，并与部署保持持续同步。网站托管在 Vercel 平台上，提供可视化的交互式时间轴界面，帮助用户了解中国诗歌的历史发展脉络。

### 主要功能

- 交互式时间轴展示各朝代诗人
- 详细的诗人档案，包括生平简介
- 丰富的古典诗词收藏，配有白话翻译和赏析
- 强大的搜索功能，可查找诗人、朝代或特定诗词
- 响应式设计，适配各种设备尺寸
- 深色/浅色主题切换支持
- 访问统计和页面浏览量追踪

## 技术栈

### 前端
- [Next.js 14](https://nextjs.org/) App Router
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/) 组件库
- [React](https://reactjs.org/)

### 后端与数据库
- [Supabase](https://supabase.io/) (PostgreSQL)
- [Vercel Analytics](https://vercel.com/analytics)

### 数据来源
- 来自 [chinese-poetry/chinese-poetry](https://github.com/chinese-poetry/chinese-poetry) 的中文诗词数据集
- 网站源代码托管于 [kyeo-hub/Chinese_poetry_timeline](https://github.com/kyeo-hub/Chinese_poetry_timeline)
- 使用 AI 生成诗词翻译、背景和赏析内容
- 手工整理的诗人传记和朝代信息

## 数据模型

项目使用存储在 PostgreSQL 表中的三个主要数据实体：

1. **朝代(Dynasties)** - 历史上的中国朝代，包含时间范围和描述
2. **诗人(Poets)** - 中国古代诗人，包含生平信息、生卒年份和所属朝代
3. **诗词(Poems)** - 古典诗词，包含原文、翻译、赏析和创作背景

## 分析与统计

网站包含全面的访问分析功能：

- 全站浏览量统计
- 单页面浏览量追踪
- 使用 SHA-256 哈希算法的安全访客识别
- 日访问量统计
- 实时分析 API

所有分析数据都存储在专用的 Supabase 表中，并通过安全的 API 路由访问。

## 部署信息

您的项目在线地址：

**[https://vercel.com/page1/v0-poetry-timeline-website](https://vercel.com/page1/v0-poetry-timeline-website)**

## 继续构建应用

在以下地址继续构建您的应用：

**[https://v0.app/chat/projects/bXx1IvXuTZ1](https://v0.app/chat/projects/bXx1IvXuTZ1)**

## 本地开发

要在本地运行项目：

1. 克隆代码仓库
2. 使用 `pnpm install` 安装依赖
3. 配置 Supabase 连接的环境变量
4. 使用 `pnpm dev` 运行开发服务器

### 脚本工具

项目包含了多种用于导入和生成内容的数据处理脚本：

- 用于数据库设置的 SQL 迁移脚本
- 用于导入中文诗词数据集的工具
- 使用各类大语言模型 API 生成内容的脚本
- 用于数据处理和增强的实用工具脚本

## 工作原理

1. 使用 [v0.app](https://v0.app) 创建和修改项目
2. 从 v0 界面部署您的聊天内容
3. 更改会自动推送到此代码仓库
4. Vercel 从此仓库部署最新版本