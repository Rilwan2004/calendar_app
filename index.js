import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch"; // install with: npm install node-fetch

const app = express();
const port = process.env.PORT || 8080;


// === Supabase Config ===
const SUPABASE_URL = "https://hoefwufcdtnwxhobfzfu.supabase.co"; // 🔁 Replace this
const SUPABASE_API_KEY = "  "; // 🔁 Replace this

let events = [];  // Global array

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.get("/events", async (req, res) => {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/events`, {
      method: "GET",
      headers: {
        "apikey": SUPABASE_API_KEY,
        "Authorization": `Bearer ${SUPABASE_API_KEY}`
      }
    });

    events = await response.json();
    res.render("events.ejs", { events });
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).send("Error loading events");
  }
});

app.post("/add-event", async (req, res) => {
  const { "task-title": title, task, date, time } = req.body;

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/events`, {
      method: "POST",
      headers: {
        "apikey": SUPABASE_API_KEY,
        "Authorization": `Bearer ${SUPABASE_API_KEY}`,
        "Content-Type": "application/json",
        "Prefer": "return=representation"
      },
      body: JSON.stringify({ title, task, date, time})
    });

    if (!response.ok) {
      const msg = await response.text();
      throw new Error(`Supabase error: ${msg}`);
    }

    res.redirect("/events");
  } catch (error) {
    console.error("Insert error:", error);
    res.status(500).send("Failed to add event");
  }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
