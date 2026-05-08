# Use Node.js LTS as the base image
FROM node:18-slim

# Create app directory
WORKDIR /usr/src/app

# Install dependencies first (for better caching)
COPY package*.json ./
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 5000

# Set environment variables for production
ENV NODE_ENV=production

# Start the application
CMD ["node", "index.js"]
