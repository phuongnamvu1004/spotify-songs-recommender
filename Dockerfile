FROM node:18

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install Redis
RUN apt-get update && apt-get install -y redis-server

# Install Node dependencies
RUN npm install

# Start Redis in the background
RUN service redis-server start

# Install Python as well
RUN apt-get update && apt-get install -y python3 python3-pip python3-venv

# Set up Python environment
COPY requirements.txt ./
RUN python3 -m venv venv
RUN . venv/bin/activate && \
    pip install --upgrade pip && \
    pip install -r requirements.txt

# Copy application code
COPY . .

# Copy .env.docker file and set environment variables
COPY .env.docker .env
ENV $(cat .env | xargs)

# Expose the port your app runs on
EXPOSE 3000 5173

# Command to run the application
CMD ["npm", "run", "dev"]