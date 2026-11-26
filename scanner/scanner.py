
import json #	Converts job data between JSON and Python JSON (JavaScript Object Notation) is a lightweight, text-based data format used to store and exchange information between systems, such as a web server and a client application
import os #	Reads environment variables
import re # 	Searches for keywords
import time # Adds a delay when connection errors occur
from datetime import datetime, timezone # 	Records the time of a finding

import bleach #	Sanitizes text
import redis #Connects Python to Redis Redis (Remote Dictionary Server) is an open-source, in-memory data structure store used primarily as a high-speed database, cache, and message broker

# Sample data is fictional and is used for testing only. Each sample has two parts:source — where the sample is supposedly from.text — the content we want to inspect.
sample_data = [
    {
        "source": "Simulated Forum A",
        "text": "Acme Corp employee email mentioned in a sample leak."
    },
    {
        "source": "Simulated Paste B",
        "text": "Project Orion appears in a fictional discussion."
    },
    {
        "source": "Simulated Forum C",
        "text": "Nothing suspicious found in this sample."
    },
    {
        "source": "Simulated Paste D",
        "text": "admin@acme.com listed in fictional exposed records."
    },
    {
        "source": "Simulated Forum E",
        "text": "A test post mentions Acme Corp and Project Orion together."
    },
    {
        "source": "Simulated Paste F",
        "text": "Sample text only: <script>alert('test')</script> Acme Corp"
    }
]

redis_host = os.getenv("REDIS_HOST", "localhost") #This reads the Redis hostname from the environment. When running through Docker, our hostname will be redis because that's the service name in Docker Compose.
redis_port = int(os.getenv("REDIS_PORT", "6379")) #Redis commonly uses port 6379.

#This creates our Redis client.
client = redis.Redis(
    host=redis_host,
    port=redis_port,
    decode_responses=True
)

# This function:
# 1. Receives text.
# 2. Removes HTML tags.
# 3. Removes HTML markup that we don't allow.
# 4. Limits the output to 500 characters.
def clean_text(text):
    cleaned = bleach.clean(text, tags=[], attributes={}, strip=True)
    return cleaned[:500]


def scan_samples(keywords):
    findings = []

    for sample in sample_data:
        for keyword in keywords:
            pattern = re.escape(keyword) #This checks whether the keyword appears in the sample text.re.escape() prevents special characters in the keyword from being treated as regex instructions.re.search() searches the text. re.IGNORECASE makes the search case-insensitive. For example, ACME CORP can match Acme Corp.

            if re.search(pattern, sample["text"], re.IGNORECASE):    #When the scanner detects a match, it creates a dictionary containing:The keyword,The source,The matching text,The timestamp.
                findings.append({
                    "keyword": clean_text(keyword),
                    "source": clean_text(sample["source"]),
                    "snippet": clean_text(sample["text"]),
                    "timestamp": datetime.now(timezone.utc).isoformat()
                })

    return findings


def process_job(job):
    keywords = job.get("keywords", [])
    results = scan_samples(keywords)

    for result in results:
        client.lpush("findings", json.dumps(result))

    client.ltrim("findings", 0, 99)

    print("Job processed. Matches:", len(results))


def main():
    print("DarkWatch scanner started. Waiting for jobs.")

    while True:
        try:
            job_item = client.brpop("scan_jobs", timeout=5)   #This waits for a job in the Redis queue. The scanner does not need the backend's database credentials. It receives a job through Redis instead.

            if job_item:
                queue_name, job_text = job_item

                try:
                    job = json.loads(job_text)
                    process_job(job)

                except (json.JSONDecodeError, TypeError, ValueError) as error:
                    print("Skipping invalid job:", error)

        except redis.exceptions.RedisError as error:
            print("Redis connection problem:", error)
            time.sleep(3)


if __name__ == "__main__":
    main()
