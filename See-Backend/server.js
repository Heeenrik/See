// Imports //
const express = require("express");

const cors = require("cors");
const mysql = require("mysql2");

// CORS setup //
const corsConfig = {
  origin: "http://127.0.0.1:5500",
  credentials: true,
};

// Server setup //
const server = express();
const port = 3000;

server.use(cors(corsConfig));

server.use(express.json());

server.get("/", (req, resp) => {
  resp.send("server loaded");
});

server.listen(port, () => {
  console.log("server is listening on port " + port);
});

// MYSQL Intergration //
const databaseConnection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "Datenbank",
});

// Connect to database
databaseConnection.connect((err) => {
  if (err) throw err;
  console.log("Connected to database");
});

// API routes //
server.get("/api/data", (req, resp) => {
  resp.json({ message: "Data from Server" });
});

// Daten aus dem frontend in die datenbank schreiben //
server.post("/api/cursor", (req, res) => {
  const { name, x, y } = req.body;
  databaseConnection.query(
    "INSERT INTO cursors (name, x, y) VALUES (?, ?, ?)",
    [name, x, y],
    (err, result) => {
      if (err) {
        console.error("DB-Fehler:", err); // Fehler im Terminal ausgeben
        res.status(500).json({
          error: "Fehler beim Schreiben in die Datenbank",
          details: err,
        });
      } else {
        res.json({ success: true, id: result.insertId });
      }
    }
  );
});
