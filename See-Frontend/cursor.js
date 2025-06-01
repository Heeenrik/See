let savedCursorId = null;
let isSaving = false;

document.addEventListener("mousemove", function (event) {
  if (isSaving) return; // Verhindert parallele Requests

  isSaving = true;

  const url = savedCursorId
    ? `http://localhost:3000/api/cursor/${savedCursorId}`
    : "http://localhost:3000/api/cursor";

  const method = savedCursorId ? "PUT" : "POST";

  fetch(url, {
    method: method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Bernd das Brot",
      x: event.clientX,
      y: event.clientY,
    }),
  })
    .then((resp) => resp.json())
    .then((data) => {
      if (data.success) {
        if (!savedCursorId) savedCursorId = data.id;
        const output = document.getElementById("output");
        output.textContent = `Cursor ID: ${savedCursorId} | X: ${event.clientX} | Y: ${event.clientY}`;
      }
    })
    .catch((err) => {
      console.error("Fehler beim Speichern:", err);
    })
    .finally(() => {
      isSaving = false;
    });
});

// Beim Verlassen der Seite den Cursor-Eintrag löschen mit sendBeacon (POST)
window.addEventListener("beforeunload", function () {
  if (savedCursorId) {
    const url = `http://localhost:3000/api/cursor/delete/${savedCursorId}`;
    navigator.sendBeacon(url);
  }
});
