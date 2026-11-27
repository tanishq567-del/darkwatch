# Use Python 3.12
FROM python:3.12-slim

# Set working directory
WORKDIR /scanner

# Copy and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy scanner code
COPY scanner.py .

# Keep Python logs visible in Render
ENV PYTHONUNBUFFERED=1

# Start the scanner
CMD ["python", "scanner.py"]