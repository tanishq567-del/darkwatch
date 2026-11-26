# DarkWatch - Brand Monitoring Demonstration

DarkWatch is a defensive cybersecurity demonstration designed to monitor fictional threat intelligence data for specified keywords.

The project demonstrates how a scanning pipeline can detect matching mentions, sanitize text and display findings through a dashboard.

## Project Features

- Keyword monitoring
- Python scanning worker
- Regular expression matching
- Text sanitization
- Redis queue
- Node.js backend
- Findings dashboard
- Docker-based services

## Technologies Used

- Python
- Node.js
- Express.js
- Redis
- Bleach
- HTML
- CSS
- JavaScript
- Docker

## How It Works

1. The user enters monitoring keywords.
2. The dashboard sends the keywords to the backend.
3. The backend submits a job to Redis.
4. The Python scanner receives the job.
5. The scanner checks the fictional sample data.
6. Matching text is sanitized.
7. Findings are stored in Redis.
8. The dashboard displays the findings.

## Running the Project

Install Docker Desktop and ensure it is running.

Open a terminal in the project folder and run:

docker compose up --build

Open the application:

http://localhost:3000

## Limitations

This is a simulated demonstration. It does not scan real dark-web websites or connect to Tor.

The project does not implement real email notifications, persistent database storage, authentication or a production-grade isolation boundary.

See TERMS.md for usage restrictions.