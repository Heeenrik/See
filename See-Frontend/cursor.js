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

// Get cursor data from database //
// const dataReq = fetch("http://localhost:3000/api/data").then((resp) => {
// console.log(resp); });
