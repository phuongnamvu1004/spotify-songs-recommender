# Use the official Node.js image
FROM node:18

# Set working directory in the container
WORKDIR /app

# Copy dependencies and install
COPY package*.json ./
RUN npm install

# Copy all frontend source code
COPY . .

# Expose port 5173 for Vite dev server
EXPOSE 5173

# Run Vite dev server (for development-style deploy)
CMD ["npm", "run", "dev"]
