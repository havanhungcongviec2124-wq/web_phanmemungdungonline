# ─── Stage 1: Build React/Vite app ──────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci

# Copy source (không copy .env — VITE_API_URL sẽ được truyền qua build arg)
COPY . .

# Build arg: URL backend mà BROWSER gọi tới
# Mặc định /api sẽ được Nginx proxy → backend:5000
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# ─── Stage 2: Serve bằng Nginx ───────────────────────────────────────────────
FROM nginx:1.27-alpine

# Xóa default config của Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copy config tùy chỉnh
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy static files đã build
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost/index.html || exit 1

CMD ["nginx", "-g", "daemon off;"]
