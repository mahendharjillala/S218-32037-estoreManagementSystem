# Step 1: Build stage (Node.js for React/Vite)
FROM node:18 AS build-stage
WORKDIR /app

# Copy dependency files first
COPY package*.json ./

RUN npm install

# Copy rest of project
COPY . .

# Build production-ready frontend
RUN npm run build

# Step 2: Runtime stage (Nginx to serve static files)
FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*

COPY --from=build-stage /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
