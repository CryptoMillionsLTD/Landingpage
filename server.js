const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express();
const PORT = 3000;

// Allow all requests (for now)
app.use(cors());
app.use(express.json());

const DATA_FILE = "uids.json";

// Create the file if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}

app.post("/save-uid", (req, res) => {
  const { username, uid } = req.body;

  if (!username || !uid) {
    return res.status(400).json({ status: "fail", message: "Missing data" });
  }

  const entries = JSON.parse(fs.readFileSync(DATA_FILE));
  entries.push({ username, uid, timestamp: new Date().toISOString() });

  fs.writeFileSync(DATA_FILE, JSON.stringify(entries, null, 2));
  res.json({ status: "success" });
});

app.get("/uids", (req, res) => {
  const data = fs.readFileSync(DATA_FILE);
  res.json(JSON.parse(data));
});

app.listen(PORT, () => {
  console.log(`UID Server running on http://localhost:${PORT}`);
});