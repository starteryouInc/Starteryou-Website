# Use the official Nginx image from Docker Hub
FROM nginx:alpine

# Copy your custom Nginx configuration file
COPY nginx.conf /etc/nginx/nginx.conf

# Copy the React build files to Nginx's default HTML directory
COPY ./dist /usr/share/nginx/html

# Expose HTTP and HTTPS ports
EXPOSE 80
EXPOSE 443

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
