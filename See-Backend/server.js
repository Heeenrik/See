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

// POST /api/cursor - neue Zeile anlegen
server.post("/api/cursor", (req, res) => {
  const { name, x, y } = req.body;
  databaseConnection.query(
    "INSERT INTO cursors (name, x, y) VALUES (?, ?, ?)",
    [name, x, y],
    (err, result) => {
      if (err) {
        console.error("DB-Fehler:", err);
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

// PUT /api/cursor/:id - bestehende Zeile aktualisieren
server.put("/api/cursor/:id", (req, res) => {
  const id = req.params.id;
  const { name, x, y } = req.body;

  const sql = "UPDATE cursors SET name = ?, x = ?, y = ? WHERE id = ?";
  databaseConnection.query(sql, [name, x, y, id], (err, result) => {
    if (err) {
      console.error("DB-Fehler beim Update:", err);
      res.status(500).json({
        error: "Fehler beim Aktualisieren der Datenbank",
        details: err,
      });
    } else {
      if (result.affectedRows === 0) {
        res.status(404).json({
          success: false,
          message: "Kein Eintrag mit dieser ID gefunden",
        });
      } else {
        res.json({ success: true, id: id });
      }
    }
  });
});

// DELETE via POST /api/cursor/delete/:id - Eintrag löschen (für sendBeacon)
server.post("/api/cursor/delete/:id", (req, res) => {
  const id = req.params.id;

  databaseConnection.query(
    "DELETE FROM cursors WHERE id = ?",
    [id],
    (err, result) => {
      if (err) {
        console.error("DB-Fehler beim Löschen:", err);
        res.status(500).json({
          error: "Fehler beim Löschen aus der Datenbank",
          details: err,
        });
      } else {
        if (result.affectedRows === 0) {
          res.status(404).json({
            success: false,
            message: "Kein Eintrag mit dieser ID gefunden",
          });
        } else {
          res.json({ success: true, message: "Eintrag gelöscht" });
        }
      }
    }
  );
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

server.get("/api/messages", (req, res) => {
  const sql =
    "SELECT idFlaschen, name, msg, type, color, time FROM Flaschen WHERE time >= NOW() - INTERVAL 1 DAY ORDER BY time DESC";
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

server.listen(port, () => {
  console.log("server is listening on port " + port);
});
