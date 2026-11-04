# Multi-stage Dockerfile for Tier 1: Client
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY client ./client

WORKDIR /app/client
RUN npm ci
RUN npm run build

FROM nginx:alpine AS runner
COPY --from=builder /app/client/dist /usr/share/nginx/html

# Custom nginx config to support React SPA client-side routing and API proxy
RUN echo 'server { \
  listen 80; \
  location / { \
    root /usr/share/nginx/html; \
    index index.html index.htm; \
    try_files $$uri $$uri/ /index.html; \
  } \
  location /api/ { \
    proxy_pass http://server:5000/api/; \
    proxy_http_version 1.1; \
    proxy_set_header Upgrade $$http_upgrade; \
    proxy_set_header Connection "upgrade"; \
    proxy_set_header Host $$host; \
    proxy_cache_bypass $$http_upgrade; \
  } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
