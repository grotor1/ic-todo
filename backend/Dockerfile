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

CMD ["npm", "run", "dev"]

