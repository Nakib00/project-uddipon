/* Renders the home-page "Workshops in Action" gallery from WORKSHOPS
   (assets/js/workshops-data.js). Runs before main.js so the lightbox
   and scroll-reveal observers pick up the generated cards. */
(function () {
  const grid = document.getElementById("galleryGrid");
  if (!grid || typeof WORKSHOPS === "undefined") return;

  const delayClasses = ["d1", "d2", "d3"];

  grid.innerHTML = WORKSHOPS.map((w, i) => `
    <a
      href="${w.image}"
      class="gallery-card gallery-card-square reveal ${delayClasses[i % delayClasses.length]}"
      data-caption="${w.caption.replace(/"/g, "&quot;")}"
      ${w.details ? `data-details="${w.details}"` : ""}
    >
      <div class="gallery-img-wrap">
        <img src="${w.image}" alt="${w.caption.replace(/"/g, "&quot;")}" loading="lazy" />
        <div class="gallery-overlay">
          <span class="material-symbols-outlined gallery-overlay-icon">open_in_full</span>
        </div>
      </div>
    </a>
  `).join("");
})();
