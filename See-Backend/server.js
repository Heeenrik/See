// Imports //
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

// CORS setup //
const corsConfig = {
  origin: "http://127.0.0.1:5500", // Deine Frontend-URL
  //origin: "http://localhost:3000/api/messages"
  credentials: true,
};

// Server setup //
const server = express();
const port = 3000;

server.use(cors(corsConfig));
server.use(express.json());

const path = require("path");

//
//  "public" enthält Bilder und Frontend-Dateien
server.use(express.static(path.join(__dirname, "public")));

server.get("/", (req, resp) => {
  resp.send("server loaded");
});

// MYSQL Integration //
const databaseConnection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "Datenbank",
});

databaseConnection.connect((err) => {
  if (err) throw err;
  console.log("Connected to database");
});

// API routes //

// GET Beispielroute
server.get("/api/data", (req, resp) => {
  resp.json({ message: "Data from Server" });
});

//nachrichten schreiben und holen

server.post("/api/messages", (req, res) => {
  const { name, msg, type, color } = req.body;
  if (!name || !msg) {
    return res.status(400).json({
      success: false,
      message: "Name und Nachricht sind erforderlich.",
    });
  }

  const sql =
    "INSERT INTO Flaschen (name, msg, type, color, time) VALUES (?, ?, ?, ?, NOW())";
  databaseConnection.query(sql, [name, msg, type, color], (err, result) => {
    if (err) {
      console.error("DB-Fehler beim Speichern der Nachricht:", err);
      return res.status(500).json({
        success: false,
        message: "Fehler beim Speichern",
      });
    }
    res.json({ success: true, id: result.insertId });
  });
});

//holen

server.get("/api/messages", (req, res) => {
  const sql = "SELECT idFlaschen, name, msg, type, color, time FROM Flaschen";
  databaseConnection.query(sql, (err, results) => {
    if (err) {
      console.error("DB-Fehler beim Abrufen der Nachrichten:", err);
      return res.status(500).json({
        success: false,
        message: "Fehler beim Abrufen",
      });
    }
    res.json({ success: true, messages: results });
  });
});

//Antworten schreiben und holen

server.post("/api/responses", (req, res) => {
  const { idParent, msgResp } = req.body;

  if (!idParent || !msgResp) {
    return res.status(400).json({
      success: false,
      message: "idParent und msgResp sind erforderlich.",
    });
  }

  const sql =
    "INSERT INTO Antworten (idParent, timeResp, msgResp) VALUES (?, NOW(), ?)";
  databaseConnection.query(sql, [idParent, msgResp], (err, result) => {
    if (err) {
      console.error("DB-Fehler beim Speichern der Antwort:", err);
      return res.status(500).json({
        success: false,
        message: "Fehler beim Antworten",
      });
    }
    res.json({ success: true, id: result.insertId });
  });
});

//holen

server.get("/api/responses", (req, res) => {
  const sql = "SELECT idParent, timeResp, msgResp FROM Antworten";
  databaseConnection.query(sql, (err, results) => {
    if (err) {
      console.error("DB-Fehler beim Abrufen der Antworten:", err);
      return res.status(500).json({
        success: false,
        message: "Fehler beim Abrufen der Antworten",
      });
    }
    res.json({ success: true, messages: results });
  });
});

server.listen(port, () => {
  console.log("server is listening on port " + port);
});
