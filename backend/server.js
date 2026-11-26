
const express = require("express");   //Express creates the backend server. The Redis library lets our backend connect to Redis.
const { createClient } = require("redis");

const app = express(); //This creates our Express application.

app.use(express.json({ limit: "20kb" })); //This allows the backend to read JSON data sent by the dashboard, with a size limit.
app.use(express.static("public")); //This tells Express to serve the files inside the public folder. That is how the browser can load our HTML, CSS and JavaScript.

const redis = createClient({  
  socket: {
    host: process.env.REDIS_HOST || "localhost",
    port: Number(process.env.REDIS_PORT || 6379)        //The backend connects to Redis. Inside Docker, redis is the hostname because it is the name of our Redis service.
  }
});

redis.on("error", (err) => { 
  console.error("Redis error:", err.message);
});

async function start() {
  await redis.connect();

  app.post("/api/scan", async (req, res) => {  //This creates an API endpoint. The frontend sends a request to this endpoint when the user clicks Simulate Scan.The backend:1. Receives the keywords.2. Checks that they are valid.3. Limits the number of keywords.4. Places the job in Redis.5. Returns a response to the browser.
    const keywords = req.body.keywords;

    if (!Array.isArray(keywords) || keywords.length === 0) {
      return res.status(400).json({
        error: "Enter at least one keyword."
      });
    }

    const cleanKeywords = keywords
      .map((word) => String(word).trim())
      .filter((word) => word.length > 0 && word.length <= 100)
      .slice(0, 20);

    if (cleanKeywords.length === 0) {
      return res.status(400).json({
        error: "No valid keywords provided."
      });
    }

    await redis.lPush("scan_jobs", JSON.stringify({
      keywords: cleanKeywords,
      submittedAt: new Date().toISOString()
    }));

    res.json({
      message: "Scan job added to the queue."
    });
  });

  app.get("/api/findings", async (req, res) => { //This endpoint retrieves the stored findings from Redis. The dashboard uses it to display the results.
    const items = await redis.lRange("findings", 0, 99);

    const findings = items.map((item) => {
      try {
        return JSON.parse(item);
      } catch {
        return null;
      }
    }).filter(Boolean);

    res.json(findings);
  });

  app.post("/api/clear", async (req, res) => {  //This endpoint deletes the findings list from Redis. It is a simple demo reset function.
    await redis.del("findings"); 

    res.json({
      message: "Findings cleared."
    });
  });

  app.get("/api/health", async (req, res) => { //This allows us to check whether the backend responds. We can use it later to test the backend independently.
    res.json({
      status: "running"
    });
  });

  app.listen(3000, "0.0.0.0", () => {
    console.log("DarkWatch is running on port 3000");
  });
}

start().catch((err) => {
  console.error("Unable to start backend:", err);
  process.exit(1);
});
