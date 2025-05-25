# Stage 1. Build assets
FROM node:lts-alpine3.18 as build-stage
WORKDIR /app

USER root

# Step 1.0: Update Node version
RUN npm install -g npm@9.8.1

# Step 1.1: Install Node Modules
COPY package*.json ./
RUN npm install

# Step 1.2: Copy Application
COPY . .

# Step 1.3: Build
RUN npm run build-only

# Stage 2. Build nginx to serve assets
FROM nginx:alpine as production-stage
WORKDIR /usr/share/nginx/html

# Step 2.1. Remove default nginx static assets
RUN rm -rf ./*

# Step 2.2. Copy static files
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build-stage /app/dist .

# Step 2.3. Set container entrypoint
CMD ["nginx", "-g", "daemon off;"]
