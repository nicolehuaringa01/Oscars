const csvFile = "movies.csv";

fetch(csvFile)
.then(res => res.text())
.then(data => {
  const rows = data.split("\n").map(r => r.split(",")); // IMPORTANT: using TAB

  const headers = rows[0];
  const body = document.getElementById("tableBody");

  rows.slice(1).forEach(row => {
    const obj = {};
    headers.forEach((h, i) => obj[h.trim()] = row[i]);

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${obj["Movie_Title"]}</td>
      <td>${obj["Year of Ceremony"]}</td>
      <td>${obj["Nominations"]}</td>
      <td>${obj["Directed_By"]}</td>
      <td>$${obj["Box Office (in millions)"]}M</td>
    `;

    tr.onclick = () => openModal(obj);
    body.appendChild(tr);
  });

  // Search
  document.getElementById("searchInput").addEventListener("keyup", function(){
    const filter = this.value.toLowerCase();
    const trs = body.getElementsByTagName("tr");

    for (let tr of trs) {
      tr.style.display = tr.textContent.toLowerCase().includes(filter) ? "" : "none";
    }
  });

});

function openModal(movie) {
  const gain = parseFloat(movie["% of budget/box office made"]);
  let performance = "";

  if (!isNaN(gain)) {
    performance = gain < 33 
      ? `<span class="tag good">Hit</span>` 
      : `<span class="tag bad">Flop-ish</span>`;
  }

  document.getElementById("modalContent").innerHTML = `
    <h2>${movie["Movie_Title"]} ${performance}</h2>
    <p><strong>Year:</strong> ${movie["Year of Ceremony"]}</p>
    <p><strong>Director:</strong> ${movie["Directed_By"]}</p>
    <p><strong>Cast:</strong> ${movie["Cast"]}</p>
    <p><strong>Genre:</strong> ${movie["Film genre "]}</p>
    <p><strong>Language:</strong> ${movie["Language"]}</p>
    <p><strong>Country:</strong> ${movie["Producer_Country"]}</p>
    <p><strong>Budget:</strong> $${movie["Budget (in millions)"]}M</p>
    <p><strong>Box Office:</strong> $${movie["Box Office (in millions)"]}M</p>
    <p><strong>RT Critics:</strong> ${movie["RT Critics"]}</p>
    <p><strong>RT Audience:</strong> ${movie["RT Audience"]}</p>
    <p><strong>Summary:</strong> ${movie["Summary"]}</p>
    <p><strong>Notes:</strong> ${movie["Notes"]}</p>
  `;

  document.getElementById("modal").style.display = "flex";
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}
