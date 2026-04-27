let allMovies = [];

const csvFile = "movies.csv";

fetch(csvFile)
  .then(res => res.text())
  .then(text => {

    const parsed = Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false, // keep everything as text (safer)
    });

    console.log(parsed); // 🔍 DEBUG — check this in console

    const data = parsed.data;

    // 💰 Sort by Box Office (highest → lowest)
data.sort((a, b) => {
  const getValue = (val) => {
    if (!val || val === "Nan") return 0;
    return parseFloat(val.toString().replace(/[^0-9.-]+/g, "")) || 0;
  };

allMovies = data;
renderTable(allMovies);

  return getValue(b["Box Office (in millions)"]) - getValue(a["Box Office (in millions)"]);
});

  function renderTable(dataArray) {
  const body = document.getElementById("tableBody");
  body.innerHTML = "";

  const clean = (value) => {
    if (!value || value === "Nan") return "—";
    return value.toString().replace(/\n/g, "<br>");
  };

  dataArray.forEach(movie => {
    if (!movie["Movie_Title"]) return;


      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${clean(movie["Movie_Title"])}</td>
        <td>${clean(movie["Date_Released"])}</td>
        <td>${clean(movie["Nominations"])}</td>
        <td>${clean(movie["Directed_By"])}</td>
        <td>$${clean(movie["Box Office (in millions)"])}M</td>
      `;

      tr.onclick = () => openModal(movie);
      body.appendChild(tr);
    });

    document.getElementById("filterType").addEventListener("change", function () {

  let filtered = [...allMovies];

  if (this.value === "nonUS") {
    filtered = filtered.filter(movie =>
      movie["Filming_Country"] && !movie["Filming_Country"].includes("United States")
    );
  }

  if (this.value === "highProfit") {
    filtered = filtered.filter(movie => {
      const val = parseFloat(movie["% of budget/box office made"]);
      return !isNaN(val) && val < 33;
    });
  }

  renderTable(filtered);
});

    // 🔍 Search
    document.getElementById("searchInput").addEventListener("keyup", function () {
      const filter = this.value.toLowerCase();
      const trs = body.getElementsByTagName("tr");

      for (let tr of trs) {
        tr.style.display = tr.textContent.toLowerCase().includes(filter) ? "" : "none";
      }
    });

  })
  .catch(err => console.error("Error:", err));

function openModal(movie) {

  const clean = (value) => {
    if (!value || value === "Nan") return "—";
    return value.toString().replace(/\n/g, "<br>");
  };

  const gain = parseFloat(movie["% of budget/box office made"]);
  let performance = "";

  if (!isNaN(gain)) {
    performance = gain < 33
      ? `<span class="tag good">Hit</span>`
      : `<span class="tag bad">Flop-ish</span>`;
  }

  document.getElementById("modalContent").innerHTML = `
    <h2>${clean(movie["Movie_Title"])} ${performance}</h2>

    <p><strong>Year:</strong> ${clean(movie["Year of Ceremony"])}</p>
    <p><strong>Director:</strong> ${clean(movie["Directed_By"])}</p>
    <p><strong>Written By:</strong> ${clean(movie["Written_By"])}</p>
    <p><strong>Produced By:</strong> ${clean(movie["Produced_By"])}</p>
    <p><strong>Cast:</strong> ${clean(movie["Cast"])}</p>

    <p><strong>Genre:</strong> ${clean(movie["Film genre "])}</p>
    <p><strong>Language:</strong> ${clean(movie["Language"])}</p>
    <p><strong>Country:</strong> ${clean(movie["Producer_Country"])}</p>

    <p><strong>Budget:</strong> $${clean(movie["Budget (in millions)"])}M</p>
    <p><strong>Box Office:</strong> $${clean(movie["Box Office (in millions)"])}M</p>

    <p><strong>RT Critics:</strong> ${clean(movie["RT Critics"])}</p>
    <p><strong>RT Audience:</strong> ${clean(movie["RT Audience"])}</p>

    <p><strong>Summary:</strong><br>${clean(movie["Summary"])}</p>
    <p><strong>Notes:</strong><br>${clean(movie["Notes"])}</p>
  `;

  document.getElementById("modal").style.display = "flex";
}


function closeModal() {
  document.getElementById("modal").style.display = "none";
}
