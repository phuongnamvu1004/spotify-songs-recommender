FROM node:18

WORKDIR /app

# Copy and install Node.js dependencies
COPY package*.json ./
RUN npm install

# Install Python and pip
RUN apt-get update && apt-get install -y python3 python3-pip

# Copy and install Python dependencies
COPY requirements.txt ./
RUN pip3 install --upgrade pip --break-system-packages && \
    pip3 install --break-system-packages -r requirements.txt

# Copy backend code
COPY . .

EXPOSE 3000

CMD ["npm", "start"]
