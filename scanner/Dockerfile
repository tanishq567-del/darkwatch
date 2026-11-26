#	Uses a Python image as the base
FROM python:3.12-slim 
# Sets the working directory inside the container
WORKDIR /scanner
#Copies files into the container
COPY requirements.txt .
# Executes a command during the image build
RUN pip install --no-cache-dir -r requirements.txt

COPY scanner.py .
# Starts the scanner when the container runs
CMD ["python", "-u", "scanner.py"]
