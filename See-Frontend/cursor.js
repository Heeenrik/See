// Get cursor data from database //
const dataReq = fetch("http://localhost:3000/api/data").then((resp) => {
  console.log(resp);
});
