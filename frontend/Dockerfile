# Node.js image to build the app
FROM node:18 as build

# Set working directory
WORKDIR /fo-fe-app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the code and build the app
COPY . .
RUN npm run build

# Nginx image to serve the app
FROM nginx:alpine

# Copy build files to Nginx default directory
COPY --from=build /fo-fe-app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]