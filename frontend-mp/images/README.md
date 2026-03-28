# 图片资源目录

## 目录结构

```
images/
├── avatar/                    # 用户头像
│   └── default.png            # 默认头像
│
├── banner/                    # 首页轮播图
│   ├── banner1.png
│   ├── banner2.png
│   └── banner3.png
│
├── category/                  # 分类相关图片
│   ├── romantic.png           # 浪漫鲜花
│   ├── birthday.png           # 生日祝福
│   ├── opening.png            # 开业花篮
│   ├── blessing.png           # 祝福问候
│   ├── rose.png               # 玫瑰
│   ├── lily.png               # 百合
│   ├── sunflower.png          # 向日葵
│   ├── carnation.png          # 康乃馨
│   ├── tulip.png              # 郁金香
│   ├── mix.png                # 混搭花束
│   ├── box.png                # 花盒
│   ├── basket1.png            # 花篮1
│   ├── basket2.png            # 花篮2
│   ├── basket3.png            # 花篮3
│   ├── eternal.png            # 永生花
│   ├── plant.png              # 绿植
│   ├── small.png              # 小型
│   ├── medium.png             # 中型
│   ├── large.png              # 大型
│   ├── congrats.png           # 祝贺
│   ├── getwell.png            # 探望
│   ├── thanks.png             # 感谢
│   ├── recommend-romantic.png # 推荐-浪漫
│   ├── recommend-birthday.png # 推荐-生日
│   ├── recommend-opening.png  # 推荐-开业
│   ├── recommend-blessing.png # 推荐-祝福
│   └── recommend-plant.png    # 推荐-绿植
│
├── empty/                     # 空状态图片
│   ├── empty-cart.png         # 购物车空
│   ├── empty-order.png        # 订单空
│   └── empty-search.png       # 搜索无结果
│
├── icons/                     # 首页分类图标
│   ├── romantic.png
│   ├── birthday.png
│   ├── opening.png
│   └── blessing.png
│
├── products/                  # 商品图片
│   ├── product1.png           # 挚爱一生-99朵红玫瑰
│   ├── product2.png           # 初见倾心-33朵粉玫瑰
│   ├── product3.png           # 阳光灿烂-向日葵混搭
│   ├── product4.png           # 开业大吉-双层花篮
│   └── product5.png           # 温馨祝福-康乃馨百合
│
├── share/                     # 分享相关
│   └── share-cover.png        # 分享封面图
│
└── tabbar/                    # 底部导航图标
    ├── home.png               # 首页
    ├── home-active.png        # 首页-选中
    ├── category.png           # 分类
    ├── category-active.png    # 分类-选中
    ├── cart.png               # 购物车
    ├── cart-active.png        # 购物车-选中
    ├── mine.png               # 我的
    └── mine-active.png        # 我的-选中
```

## 命名规范

| 规则 | 示例 |
|------|------|
| 小写字母 + 连字符 | `empty-cart.png` |
| 选中状态加 `-active` 后缀 | `home-active.png` |
| 商品图用 `product{id}.png` | `product1.png` |
| 推荐图用 `recommend-{type}.png` | `recommend-romantic.png` |

## 尺寸规范

| 类型 | 尺寸 | 格式 |
|------|------|------|
| 轮播图 | 750×400 | PNG/JPG |
| 分类图标 | 80×80 | PNG |
| 商品主图 | 750×750 | PNG/JPG |
| 商品缩略图 | 200×200 | PNG/JPG |
| TabBar 图标 | 81×81 | PNG |
| 空状态图 | 200×200 | PNG |
| 分享封面 | 500×400 | PNG/JPG |
| 用户头像 | 200×200 | PNG/JPG |

## 优化建议

1. 使用 TinyPNG 等工具压缩图片
2. 大尺寸图片考虑使用 CDN
3. 图标优先使用 iconfont 或 SVG
4. 商品图可使用 WebP 格式（需兼容处理）
