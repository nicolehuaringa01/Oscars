let allMovies = [];
let currentView = "all";

const csvFile = "movies.csv";

fetch(csvFile)
  .then(res => res.text())
  .then(text => {

    const parsed = Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
    });

    let data = parsed.data;

    // 💰 Helper to safely parse numbers
    const getValue = (val) => {
      if (!val || val === "Nan") return 0;
      return parseFloat(val.toString().replace(/[^0-9.-]+/g, "")) || 0;
    };

    // 💰 Sort by Box Office (corrected)
    data.sort((a, b) =>
      getValue(b["Box Office (in millions)"]) - getValue(a["Box Office (in millions)"])
    );

    allMovies = data;

    renderTable(allMovies);
    setupSearch();
    setupNav();
  })
  .catch(err => console.error("Error:", err));


// 🎯 Render Table
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
      <td>${clean(movie["Year of Ceremony"])}</td>
      <td>${clean(movie["Nominations"])}</td>
      <td>${clean(movie["Directed_By"])}</td>
      <td>$${clean(movie["Box Office (in millions)"])}M</td>
    `;

    tr.onclick = () => openModal(movie);
    body.appendChild(tr);
  });

  // 📊 Results counter (optional but recommended)
  const counter = document.getElementById("resultsCount");
  if (counter) {
    counter.textContent = `${dataArray.length} films`;
  }
}


// 🔍 Search
function setupSearch() {
  document.getElementById("searchInput").addEventListener("keyup", function () {
    const filter = this.value.toLowerCase();

    const filtered = allMovies.filter(movie =>
      Object.values(movie).join(" ").toLowerCase().includes(filter)
    );

    renderTable(applyCurrentView(filtered));
  });
}


// 🧭 Navbar filters
function setupNav() {
  const links = document.querySelectorAll("nav a");

  links.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      // ✨ Active state UI
      links.forEach(l => l.classList.remove("active"));
      link.classList.add("active");

      currentView = link.dataset.view;

      const filtered = applyCurrentView(allMovies);

      console.log(currentView, filtered.length); // 🔍 debug

      renderTable(filtered);
    });
  });
}


// 🧠 Filter logic
function applyCurrentView(data) {
  let filtered = [...data];

  if (currentView === "winners") {
    filtered = filtered.filter(m =>
      m["Nominations"]?.toUpperCase().includes("WIN")
    );
  }

  if (currentView === "international") {
    filtered = filtered.filter(m =>
      m["Producer_Country"] &&
      !m["Producer_Country"].includes("United States")
    );
  }

  if (currentView === "highProfit") {
    filtered = filtered.filter(m => {
      const val = parseFloat(m["% of budget/box office made"]);
      return !isNaN(val) && val < 33;
    });
  }

  if (currentView === "women") {
    // ⚠️ requires column in CSV
    if (!data[0]["Director_Gender"]) return data;

    filtered = filtered.filter(m =>
      m["Director_Gender"] === "Female"
    );
  }

  return filtered;
}


// 🎬 Modal
function openModal(movie) {

  const clean = (value) => {
    if (!value || value === "Nan") return "—";
    return value.toString().replace(/\n/g, "<br>");
  };

  const gain = parseFloat(movie["% of budget/box office made"]);
  let performance = "";

  if (!isNaN(gain)) {
    if (gain < 20) performance = `<span class="tag good">Blockbuster</span>`;
    else if (gain < 33) performance = `<span class="tag good">Hit</span>`;
    else performance = `<span class="tag bad">Flop</span>`;
  }

  document.getElementById("modalContent").innerHTML = `
    <h2>${clean(movie["Movie_Title"])} ${performance}</h2>

    <p><strong>Year:</strong> ${clean(movie["Year of Ceremony"])}</p>
    <p><strong>Director:</strong> ${clean(movie["Directed_By"])}</p>
    <p><strong>Cast:</strong> ${clean(movie["Cast"])}</p>
    <p><strong>Genre:</strong> ${clean(movie["Film genre "])}</p>

    <p><strong>Budget:</strong> $${clean(movie["Budget (in millions)"])}M</p>
    <p><strong>Box Office:</strong> $${clean(movie["Box Office (in millions)"])}M</p>

    <p><strong>RT Critics:</strong> ${clean(movie["RT Critics"])}</p>
    <p><strong>RT Audience:</strong> ${clean(movie["RT Audience"])}</p>

    <p><strong>Summary:</strong><br>${clean(movie["Summary"])}</p>
  `;

  document.getElementById("modal").style.display = "flex";
}


function closeModal() {
  document.getElementById("modal").style.display = "none";
}
