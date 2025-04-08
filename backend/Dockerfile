FROM node:18

WORKDIR /app

# Copy and install Node.js dependencies
COPY package*.json ./
RUN npm install

# Copy backend code
COPY . .

EXPOSE 3000

CMD ["npm", "start"]
