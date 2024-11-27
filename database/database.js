const {
  AttachmentBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder,
  ButtonStyle,
  Embed,
} = require("discord.js");
const fs = require("fs");
function makeid(length) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("database.db");

function execute(query, params = []) {
  return new Promise((resolve, reject) => {
    db.all(query, params, function (err, rows) {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

function run(query, params = []) {
  return new Promise((resolve, reject) => {
    db.run(query, params, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve({ lastID: this.lastID, changes: this.changes });
      }
    });
  });
}

async function Initialization() {
  try {
    await run(`PRAGMA foreign_keys = ON;`);

    await run(`CREATE TABLE IF NOT EXISTS trainings (
      training_id TEXT PRIMARY KEY,
      message_id TEXT,
       thread_id TEXT,
      requester_id TEXT,
      trainer_id TEXT,
      stage TEXT, 
      date TEXT,
      time TEXT, 
      department TEXT,
      sent TEXT
    )`);
  } catch (err) {
    console.error("Initialization error:", err);
  }
}

module.exports = {
  execute,
  run,
  Initialization,
  makeid,
};
