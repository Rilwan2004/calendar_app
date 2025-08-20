import dotenv from "dotenv";
dotenv.config();

import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";

const app = express();
const port = process.env.PORT || 8080;

// === Supabase Config ===
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_API_KEY = process.env.SUPABASE_API_KEY;

console.log("🔑 Supabase URL:", SUPABASE_URL);
console.log("🔑 Supabase Key exists:", !!SUPABASE_API_KEY);

let events = [];

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
      body: JSON.stringify({ title, task, date, time })
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
