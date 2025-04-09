# Use a lightweight base Python image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    gcc \
    libpq-dev \
&& apt-get clean \
&& rm -rf /var/lib/apt/lists/*

# Upgrade pip, setuptools, and wheel
RUN pip install --no-cache-dir --upgrade pip setuptools wheel

# Copy and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the app
COPY . .

# Use Render's dynamic port binding
ENV PORT=10000
EXPOSE $PORT

# Run the app
CMD uvicorn app:app --host 0.0.0.0 --port $PORT --timeout-keep-alive 60
