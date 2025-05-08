// Get cursor data from database //
const dataReq = fetch("http://localhost:3000/api/data")
  .then((resp) => {
    console.log(resp);
    return resp.json();
  })
  .then((data) => {
    const output = document.getElementById("output");
    output.textContent = data.message;
  });

// in Datenbank schreiben //
fetch("http://localhost:3000/api/cursor", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "Bernd das Brot", x: 100, y: 200 }),
})
  .then((resp) => resp.json())
  .then((data) => {
    if (data.success) {
      console.log("Gespeichert ID:", data.id);
    }
  });
