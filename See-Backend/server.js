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
