const MoodEntry = require("../models/MoodEntry");

async function getMoodHistory(userId, days = 30) {
  const cutoff = new Date(Date.now() - days * 24 * 3600 * 1000);
  const entries = await MoodEntry.find({
    userId,
    date: { $gte: cutoff },
  })
    .sort({ date: -1 })
    .lean();
  return entries;
}

async function addMoodEntry(userId, { date, mood, stressLevel, notes }) {
  const entry = new MoodEntry({
    userId,
    date: date || new Date(),
    mood,
    stressLevel: stressLevel || null,
    notes: notes || "",
  });
  await entry.save();
  return entry;
}

async function deleteMoodEntry(userId, entryId) {
  const result = await MoodEntry.findOneAndDelete({ _id: entryId, userId });
  return result;
}

module.exports = { getMoodHistory, addMoodEntry, deleteMoodEntry };
