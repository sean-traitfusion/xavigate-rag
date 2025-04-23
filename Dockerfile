FROM python:3.13-slim


# Set working directory
WORKDIR /app

# Install system dependencies required for pip packages
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    build-essential \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy source code
COPY . /app

# Install Python dependencies
RUN pip install --upgrade pip && \
    pip install -r requirements.txt

# Expose port
EXPOSE 8000

# Run the app
CMD ["uvicorn", "backend.api:app", "--host", "0.0.0.0", "--port", "8000"]