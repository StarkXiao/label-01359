# 多阶段构建 - 支持 ARM 和 X86 架构
# 阶段1: 构建阶段
FROM --platform=$BUILDPLATFORM node:18-alpine AS builder

WORKDIR /app

# 复制 package 文件
COPY package*.json ./

# 安装依赖
RUN npm install --registry=https://registry.npmmirror.com

# 复制源代码
COPY . .

# 构建小程序（如果有构建步骤）
RUN npm run build 2>/dev/null || echo "No build script, skipping..."

# 阶段2: 生产阶段 - 使用 nginx 提供静态文件服务
FROM --platform=$TARGETPLATFORM nginx:alpine

# 设置工作目录
WORKDIR /usr/share/nginx/html

# 从构建阶段复制文件
COPY --from=builder /app /usr/share/nginx/html

# 复制 nginx 配置
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
        add_header Cache-Control "no-cache, no-store, must-revalidate"; \
    } \
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ { \
        expires 1y; \
        add_header Cache-Control "public, immutable"; \
    } \
}' > /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 80

# 健康检查
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"]
