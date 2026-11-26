
const scanButton = document.getElementById("scanButton"); //This retrieves the button from the HTML page. JavaScript can now interact with that button.
const clearButton = document.getElementById("clearButton");
const refreshButton = document.getElementById("refreshButton");

const keywordsBox = document.getElementById("keywords");
const message = document.getElementById("message");
const findingsBox = document.getElementById("findings");
const count = document.getElementById("count");

scanButton.addEventListener("click", async () => {

    const keywords = keywordsBox.value //This takes the user's input.It splits the text at commas, removes extra spaces, and removes empty entries.
        .split(",")
        .map((word) => word.trim())
        .filter(Boolean);

    if (!keywords.length) {
        message.textContent = "Please enter at least one keyword.";
        return;
    }

    scanButton.disabled = true;
    message.textContent = "Submitting scan...";

    try {
        const response = await fetch("/api/scan", {  //This sends the keywords to the backend. fetch() makes the request,POST submits data,Content-Type tells the backend the request contains JSON,JSON.stringify() converts the object to JSON text
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ keywords })
        });

        const result = await response.json();

        message.textContent =
            result.message || result.error || "Request completed.";

        if (response.ok) {
            setTimeout(loadFindings, 1200);
            setTimeout(loadFindings, 2500);
        }

    } catch {
        message.textContent = "Could not contact the backend.";

    } finally {
        scanButton.disabled = false;
    }
});


clearButton.addEventListener("click", async () => {

    await fetch("/api/clear", {
        method: "POST"
    });

    message.textContent = "Findings cleared.";

    loadFindings();
});


refreshButton.addEventListener("click", loadFindings);


function addTextElement(parent, tag, text, className) {

    const element = document.createElement(tag);

    element.textContent = text;

    if (className) {
        element.className = className;
    }

    parent.appendChild(element);

    return element;
}


async function loadFindings() {

    try {
        const response = await fetch("/api/findings"); //This retrieves the findings from the backend.
        const items = await response.json();

        count.textContent = items.length;

        findingsBox.replaceChildren();

        if (!items.length) {
            addTextElement(
                findingsBox,
                "p",
                "No findings yet. Run a simulated scan.",
                "muted"
            );

            return;
        }

        items.forEach((item) => {

            const card = document.createElement("article");
            card.className = "finding";

            addTextElement(card, "h4", "Keyword: " + item.keyword);

            addTextElement(
                card,
                "span",
                "SIMULATED MATCH",
                "tag"
            );

            addTextElement(card, "p", "Source: " + item.source);

            addTextElement(card, "p", "Snippet: " + item.snippet);

            addTextElement(
                card,
                "p",
                "Detected: " + item.timestamp,
                "muted"
            );

            findingsBox.appendChild(card);
        });

    } catch {
        message.textContent = "Unable to load findings.";
    }
}


loadFindings();

setInterval(loadFindings, 5000); //This refreshes the findings every five seconds.
