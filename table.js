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
    const body = document.getElementById("tableBody");

    const clean = (value) => {
      if (!value || value === "Nan") return "—";
      return value.toString().replace(/\n/g, "<br>");
    };

    data.forEach(movie => {

      // 🛑 Skip broken rows (this is key)
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
