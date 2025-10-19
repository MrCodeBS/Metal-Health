const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const DATA_FILE = path.join(__dirname, "..", "data", "mood.json");

function load() {
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf8");
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

function save(entries) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(entries, null, 2));
}

function getMoodHistory(days) {
  const entries = load();
  const cutoff = Date.now() - days * 24 * 3600 * 1000;
  return entries.filter((e) => new Date(e.date).getTime() >= cutoff);
}

function addMoodEntry({ date, mood, stressLevel, notes }) {
  const entries = load();
  const entry = {
    id: uuidv4(),
    date: date || new Date().toISOString(),
    mood,
    stressLevel: stressLevel || null,
    notes: notes || "",
  };
  entries.push(entry);
  save(entries);
  return entry;
}

module.exports = { getMoodHistory, addMoodEntry };
