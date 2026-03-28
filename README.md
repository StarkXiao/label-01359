# 鲜花商城微信小程序

## How to Run

### 使用微信开发者工具

1. 下载并安装 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
2. 打开微信开发者工具，选择"导入项目"
3. 选择 `frontend-mp` 目录作为项目根目录
4. 填入你的 AppID（或使用测试号）
5. 点击"确定"即可运行

### 使用 Docker

```bash
# 构建并启动服务
docker-compose up -d

# 查看服务状态
docker-compose ps

# 停止服务
docker-compose down
```

服务启动后访问：http://localhost:8081

## Services

| 服务名称 | 端口 | 描述 |
|---------|------|------|
| frontend-mp | 8081 | 鲜花商城微信小程序前端 |

## 测试账号

| 账号类型 | 用户名 | 密码 |
|---------|-------|------|
| 测试用户 | test | 123456 |

## 题目内容

您是一位微信小程序开发的工程师，请帮我生成一个鲜花商城微信小程序，先生成一个首页，包含四个选项卡：首页、分类、购物车、我的。首页中包含搜索、浪漫告白、生日热荐、开业花篮、祝福恭贺以及热销商品，页面精美。

---

## 项目介绍

鲜花商城微信小程序是一个完整的电商解决方案，提供鲜花浏览、购买、订单管理等功能。

### 功能模块

- **首页** - 轮播图、推荐商品、分类入口
- **分类** - 商品分类浏览
- **购物车** - 商品添加、数量修改、结算
- **我的** - 个人中心、订单管理
- **搜索** - 商品搜索功能
- **商品详情** - 商品信息展示、加入购物车
- **订单流程** - 确认订单、支付、订单结果

### 技术栈

- 微信小程序原生开发
- WXML + WXSS + JavaScript
- Docker 容器化部署

### 项目结构

```
frontend-mp/
├── components/          # 自定义组件
│   ├── product-card/   # 商品卡片组件
│   └── search-bar/     # 搜索栏组件
├── config/             # 配置文件
├── images/             # 图片资源
├── mock/               # Mock 数据
├── pages/              # 页面文件
│   ├── index/          # 首页
│   ├── category/       # 分类页
│   ├── cart/           # 购物车
│   ├── mine/           # 我的
│   ├── search/         # 搜索页
│   ├── product-detail/ # 商品详情
│   ├── product-list/   # 商品列表
│   ├── order-confirm/  # 订单确认
│   ├── order-pay/      # 订单支付
│   ├── order-result/   # 订单结果
│   ├── order-list/     # 订单列表
│   └── order-detail/   # 订单详情
├── services/           # API 服务
├── styles/             # 公共样式
└── utils/              # 工具函数
```
