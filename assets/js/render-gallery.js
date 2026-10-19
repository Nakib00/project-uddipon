/* Builds the data-driven parts of the home page from assets/js/workshops-data.js:
   - "Workshops in action" story cards (WORKSHOPS)
   - "Where Uddipon has been" institution list (INSTITUTIONS)
   - headline numbers marked with data-stat="…" (PROGRAM_STATS)
   Runs before main.js so the lightbox and scroll-reveal observers pick up
   the generated elements. */
(function () {
  const esc = (s) =>
    String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

  // Stories
  const grid = document.getElementById("galleryGrid");
  if (grid && typeof WORKSHOPS !== "undefined") {
    const delays = ["d1", "d2", "d3", "d4"];
    grid.innerHTML = WORKSHOPS.map((w, i) => {
      const title = w.caption.split(" — ")[0];
      // Small label: the institution, unless it just repeats the title
      const inst = w.institution || "";
      const label = inst && !title.toLowerCase().includes(inst.toLowerCase().slice(0, 12)) ? inst : "Workshop";
      return `
      <a href="${esc(w.image)}" class="story gallery-card reveal ${delays[i % delays.length]}"
         data-caption="${esc(w.caption)}" ${w.details ? `data-details="${esc(w.details)}"` : ""}>
        <img src="${esc(w.image)}" alt="${esc(w.caption)}" loading="lazy" />
        <span class="story-text">
          <small>${esc(label)}</small>
          <b>${esc(title)}</b>
        </span>
      </a>`;
    }).join("");

    // Nothing to expand when there are only a few stories
    const toggle = document.getElementById("storiesToggle");
    if (toggle && WORKSHOPS.length <= 9) toggle.remove();
  }

  // Institutions
  const list = document.getElementById("institutionList");
  if (list && typeof INSTITUTIONS !== "undefined") {
    list.innerHTML = INSTITUTIONS.map(
      (name) => `<li><span class="material-symbols-outlined">location_on</span>${esc(name)}</li>`
    ).join("");
  }

  // Headline numbers
  if (typeof PROGRAM_STATS !== "undefined") {
    document.querySelectorAll("[data-stat]").forEach((el) => {
      const value = PROGRAM_STATS[el.getAttribute("data-stat")];
      if (value !== undefined && value !== null && value !== "") el.textContent = value;
    });
  }
})();
