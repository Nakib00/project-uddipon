/* Renders the repeating report header/footer on every .report-page,
   fills in the institutions list / stats / snapshot grid from
   assets/js/workshops-data.js, and wires the "Download PDF" button.
   Nothing here needs to change when a new workshop is added — only
   workshops-data.js does. */
(function () {
  const chunk = (arr, size) => {
    const out = [];
    for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
    return out;
  };

  /* Snapshot pages — generated BEFORE the header/footer pass below, and
     split 4-per-page (2x2), so the photo grid never overflows a single
     report page no matter how many workshops WORKSHOPS grows to. */
  const snapPlaceholder = document.getElementById("pfSnapPages");
  if (snapPlaceholder && typeof WORKSHOPS !== "undefined") {
    const PER_PAGE = 9;
    const groups = chunk(WORKSHOPS, PER_PAGE);
    snapPlaceholder.outerHTML = groups
      .map(
        (group, gi) => `
      <section class="report-page" data-title="Some Snapshots">
        <div class="pf-kicker">Section 06 — Field Gallery${
          groups.length > 1 ? ` (${gi + 1} of ${groups.length})` : ""
        }</div>
        <h2 class="pf-h1">Some Snapshots</h2>
        <div class="pf-snap-grid">
          ${group
            .map(
              (w) => `
            <div class="pf-snap">
              <img src="${w.image}" alt="${w.caption.replace(/"/g, "&quot;")}" loading="lazy" />
              <div class="pf-snap-cap">${w.caption}</div>
            </div>`
            )
            .join("")}
        </div>
      </section>`
      )
      .join("");
  }

  /* Repeating header / footer — runs after the snapshot pages above
     exist, so they get the same chrome and are counted in the total. */
  const pages = document.querySelectorAll(".report-page");

  const headerHTML = () => `
    <div class="pf-head">
      <div class="pf-head-brand">
        <img src="assets/images/partners/zantech-logo.png" alt="ZAN Tech" />
        <div class="pf-head-brand-text">
          <div class="name">ZAN TECH</div>
          <div class="pf-head-tag">Awaken Your Hidden Talent</div>
        </div>
      </div>
      <div class="pf-head-contact">
        <div class="addr">House 48, Road 9/C, Sector 5, Uttara, Dhaka, Bangladesh</div>
        <div class="row"><span class="material-symbols-outlined">call</span> 01894-634149</div>
        <div class="row"><span class="material-symbols-outlined">mail</span> zantechbd@gmail.com</div>
        <div class="row"><span class="material-symbols-outlined">language</span> projectuddipon.zantechbd.com</div>
        <div class="pf-head-date">${(typeof PROGRAM_STATS !== "undefined" && PROGRAM_STATS.reportDate) || ""}</div>
      </div>
    </div>
    <div class="pf-rule"><span></span><span></span></div>
  `;

  const pad = (n) => String(n).padStart(2, "0");
  const footerHTML = (pageNum, total) => `
    <div class="pf-footer">
      <div class="pf-footer-row">
        <div class="pf-page-num">PAGE <b>${pad(pageNum)}</b> / ${pad(total)}</div>
        <div class="pf-foot"><img src="assets/images/logo-uddipon.png" alt="Project Uddipon" /></div>
      </div>
      <div class="pf-bar"></div>
    </div>
  `;

  pages.forEach((page, i) => {
    page.insertAdjacentHTML("afterbegin", headerHTML());
    page.insertAdjacentHTML("beforeend", footerHTML(i + 1, pages.length));
  });

  const coverDateEl = document.getElementById("pfCoverDate");
  if (coverDateEl && typeof PROGRAM_STATS !== "undefined") {
    coverDateEl.textContent = PROGRAM_STATS.reportDate;
  }

  /* Institutions engaged */
  const instEl = document.getElementById("pfInstitutions");
  if (instEl && typeof INSTITUTIONS !== "undefined") {
    instEl.innerHTML = INSTITUTIONS.map((name) => `<li>${name}</li>`).join("");
  }

  /* Analytics stat chips */
  const statsEl = document.getElementById("pfStats");
  if (statsEl && typeof PROGRAM_STATS !== "undefined") {
    const chips = [
      [PROGRAM_STATS.studentsReached, "Students Trained"],
      [String(PROGRAM_STATS.institutionsVisited) + "+", "Institutions Engaged"],
      [PROGRAM_STATS.avgPerSession, "Avg. Participants / Session"],
      [PROGRAM_STATS.femaleParticipation, "Female Participation"],
    ];
    statsEl.innerHTML = chips
      .map(
        ([num, label]) => `
      <div class="pf-stat">
        <div class="pf-stat-num">${num}</div>
        <div class="pf-stat-label">${label}</div>
      </div>`
      )
      .join("");
  }

  /* Download as PDF — the workshop photos live on a CDN that sends no
     CORS headers, so a canvas-based exporter (html2canvas/html2pdf)
     can never read their pixels and would render them blank. The
     browser's own print pipeline has no such restriction, so "Download
     PDF" reuses the print stylesheet above (report pages, page breaks,
     repeating header/footer) and opens the native print dialog, where
     "Save as PDF" produces an exact, fully-illustrated PDF. */
  const btn = document.getElementById("downloadPdfBtn");
  const tip = document.getElementById("pfPrintTip");
  const tipClose = document.getElementById("pfPrintTipClose");
  if (btn) {
    btn.addEventListener("click", () => {
      if (tip) tip.classList.add("show");
      window.print();
    });
  }
  if (tipClose && tip) {
    tipClose.addEventListener("click", () => tip.classList.remove("show"));
  }
})();
