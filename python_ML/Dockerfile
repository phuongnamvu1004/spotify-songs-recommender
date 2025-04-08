# Use a lightweight base Python image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies if needed (optional)
RUN apt-get update && apt-get install -y build-essential

# Copy only requirements first for cache efficiency
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the app
COPY . .

# Expose FastAPI port
EXPOSE 5001

# Run the app
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "5001"]
