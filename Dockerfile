FROM python:3.10-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy and install Python requirements (CPU torch for fast build)
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir torch torchvision --index-url https://download.pytorch.org/whl/cpu && \
    pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . .

# Expose default Hugging Face Spaces / cloud port
EXPOSE 7860

# Run FastAPI PyTorch inference server
CMD ["python", "-m", "uvicorn", "app.api_server:app", "--host", "0.0.0.0", "--port", "7860"]
