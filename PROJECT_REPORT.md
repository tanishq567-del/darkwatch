# DarkWatch — Dark Web Brand Monitoring & Threat Intelligence System

## 1. Project Overview

DarkWatch is a cybersecurity demonstration project designed to monitor specified keywords in a fictional threat intelligence dataset and display matching results through a dashboard.

The project demonstrates a basic monitoring workflow involving a web interface, backend server, Redis queue, and Python scanning worker.

## 2. Objectives

- Create a keyword monitoring dashboard.
- Implement a Python-based keyword scanning worker.
- Use Redis for job queueing and storing findings.
- Connect the frontend to a backend API.
- Demonstrate a basic defensive threat intelligence workflow.
- Run application components using Docker.

## 3. Technologies Used

- HTML — dashboard structure
- CSS — dashboard styling
- JavaScript — frontend interactions
- Node.js — backend runtime
- Express.js — backend API
- Python — scanning logic
- Redis — job queue and findings storage
- Docker — containerization

## 4. System Architecture

The system consists of four main components:

1. Frontend Dashboard — accepts monitoring keywords and displays findings.
2. Node.js Backend — receives requests and sends scan jobs to Redis.
3. Redis — stores scan jobs and detected findings.
4. Python Scanner — processes jobs and searches the fictional dataset.

## 5. Working Methodology

1. The user enters keywords in the dashboard.
2. The frontend sends the keywords to the backend.
3. The backend validates the input.
4. The backend places a scan job in the Redis queue.
5. The Python worker retrieves the job.
6. The scanner searches the fictional dataset for keyword matches.
7. Matching results are sanitized and stored in Redis.
8. The dashboard retrieves and displays the findings.

## 6. Security Features Demonstrated

- Input validation
- Keyword matching using regular expressions
- Text sanitization
- Separation of backend and scanning worker
- Queue-based job processing
- Containerized services

## 7. Testing

The project was tested using different keyword inputs.

- Keyword detection test
- Multiple keyword test
- Case-insensitive matching test
- No-match test
- Clear findings test

Actual test results and screenshots are to be included after completing the tests.

## 8. Limitations

- The scanner uses fictional sample data.
- It does not access actual dark-web websites.
- It does not connect to the Tor network.
- It is a demonstration project and is not a production threat intelligence platform.

## 9. Future Scope

- Integration with authorized threat intelligence APIs.
- Persistent database storage.
- Improved reporting and analytics.
- Authentication and access control.
- Alerting and notification functionality.
- More advanced detection and filtering.

## 10. Conclusion

DarkWatch demonstrates a basic defensive monitoring workflow using frontend technologies, Node.js, Python, Redis, and Docker. The project helped demonstrate the integration of multiple components in a cybersecurity monitoring application and the processing of monitoring jobs through a queue-based system.