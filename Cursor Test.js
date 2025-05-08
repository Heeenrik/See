const express = require('express');
const mysql = require('mysql2/promise');
const app = express();
app.use(express.json());




// Datenbankverbindung
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',                // dein Benutzername
  password: '',   // dein Passwort
  database: 'CursorPos',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Cursor speichern und alle zurückgeben
app.post('/update-cursor', async (req, res) => {
  const { User, Position_X, Position_Y } = req.body;

  const conn = await pool.getConnection();
  try {
    await conn.execute(`
      INSERT INTO cursors (User, Position_X, Position_Y)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE x = VALUES(x), y = VALUES(y), updatedAt = CURRENT_TIMESTAMP
    `, [User, Position_X, Position_Y]);

    const [rows] = await conn.execute(`SELECT * FROM cursors`);
    res.json(rows);
  } catch (err) {
    console.error('Fehler bei der DB:', err);
    res.status(500).send('Fehler beim Zugriff auf die Datenbank');
  } finally {
    conn.release();
  }
});

app.listen(3000, () => {
  console.log('Server läuft auf http://localhost:3000');
});