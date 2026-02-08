# Build Stage
FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Run Stage
FROM nginx:alpine
# Copy built Angular files to Nginx (Check your angular.json for output path, usually dist/frontend/browser or dist/frontend)
COPY --from=build /app/dist/finance-portal/browser /usr/share/nginx/html
# Copy our custom Nginx config
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80