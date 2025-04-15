# Use Node.js to build the Angular app
FROM node:18-alpine AS build

WORKDIR /app


COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build --prod

# Use a lightweight Node.js HTTP server to serve the built files
FROM node:18-alpine AS serve
WORKDIR /app

# Install a simple HTTP server (http-server)
RUN npm install -g http-server

# Copy the built Angular files from the previous step
COPY --from=build /app/dist/fenrin_frontend /usr/share/nginx/html

# Expose port 80 and serve the frontend
CMD ["http-server", "/usr/share/nginx/html", "-p", "80"]
