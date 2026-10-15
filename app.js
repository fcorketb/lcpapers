(() => {
  "use strict";

  const cfg = window.EXAM_CONFIG;
  const $ = (id) => document.getElementById(id);

  const el = {
    subject: $("subject"), level: $("level"), year: $("year"),
    prevYear: $("prevYear"), nextYear: $("nextYear"),
    doc: $("doc"), paper: $("paper"), paperField: $("paperField"),
    lang: $("lang"), langField: $("langField"),
    title: $("title"), open: $("open"), copy: $("copy"),
    frame: $("frame"), fallback: $("fallback"),
    fallbackTitle: $("fallbackTitle"), fallbackText: $("fallbackText"), fallbackOpen: $("fallbackOpen"),
  };

  // Phones and tablets can't show PDFs inside a web page, so on those we
  // show a big "Open" button instead of the embedded viewer.
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  const DOCS = [
    { id: "paper", label: "Exam paper" },
    { id: "scheme", label: "Marking scheme" },
  ];
  const LANGS = [
    { id: "EV", label: "English" },
    { id: "IV", label: "Gaeilge" },
  ];

  const years = [];
  for (let y = cfg.years.to; y >= cfg.years.from; y--) {
    if (!cfg.skipYears.includes(y)) years.push(y);
  }

  // ---------- State (kept in the page URL so links can be shared) ----------
  const params = new URLSearchParams(location.search);
  const state = {
    subject: params.get("subject") || "maths",
    level: params.get("level") || "A",
    year: Number(params.get("year")) || years[0],
    doc: params.get("doc") || "paper",
    paper: Number(params.get("paper")) || 0,
    lang: params.get("lang") || "EV",
  };

  const subject = () => cfg.subjects.find((s) => s.id === state.subject) || cfg.subjects[0];

  function papersFor(subj, level, year) {
    const list = (subj.levelPapers && subj.levelPapers[level]) || subj.papers;
    return list.filter((p) => (!p.from || year >= p.from) && (!p.to || year <= p.to));
  }

  function versionFor(subj) {
    if (subj.irishVersion && state.lang === "IV") return "IV";
    return subj.version || "EV";
  }

  function buildUrl() {
    const subj = subject();
    const stem = `LC${subj.code}${state.level}L`;
    if (!papersFor(subj, state.level, state.year).length) return null; // subject not examined that year
    if (state.doc === "scheme") {
      // Marking schemes are a single file per level, English unless Irish chosen
      const v = subj.version === "IV" || (subj.irishVersion && state.lang === "IV") ? "IV" : "EV";
      return `${cfg.schemeUrl}/${state.year}/${stem}P000${v}.pdf`;
    }
    const paper = papersFor(subj, state.level, state.year)[state.paper];
    if (!paper) return null;
    return `${cfg.paperUrl}/${state.year}/${stem}${paper.part}${versionFor(subj)}.pdf`;
  }

  // ---------- Rendering helpers ----------
  function fillSelect(select, items, selected) {
    select.innerHTML = "";
    items.forEach(({ value, label }) => {
      select.add(new Option(label, value, false, String(value) === String(selected)));
    });
  }

  function fillSegmented(container, items, selected, onPick) {
    container.innerHTML = "";
    items.forEach(({ id, label }) => {
      const b = document.createElement("button");
      b.type = "button";
      b.setAttribute("role", "radio");
      b.textContent = label;
      b.setAttribute("aria-checked", String(id) === String(selected));
      b.addEventListener("click", () => update({ [onPick]: id }));
      container.appendChild(b);
    });
  }

  function render() {
    const subj = subject();
    state.subject = subj.id;
    if (!subj.levels.includes(state.level)) state.level = subj.levels[0];
    if (!years.includes(state.year)) state.year = years[0];
    if (!subj.irishVersion) state.lang = "EV";

    const papers = papersFor(subj, state.level, state.year);
    if (state.paper >= papers.length) state.paper = 0;

    fillSelect(el.subject, cfg.subjects.map((s) => ({ value: s.id, label: s.name })), subj.id);
    fillSelect(el.level, subj.levels.map((l) => ({ value: l, label: cfg.levelNames[l] })), state.level);
    fillSelect(el.year, years.map((y) => ({ value: y, label: y })), state.year);

    fillSegmented(el.doc, DOCS, state.doc, "doc");
    fillSegmented(el.paper, papers.map((p, i) => ({ id: i, label: p.label })), state.paper, "paper");
    fillSegmented(el.lang, LANGS, state.lang, "lang");

    // Only show the paper picker when there's more than one paper to pick from
    el.paperField.hidden = state.doc === "scheme" || papers.length < 2;
    el.langField.hidden = !subj.irishVersion;

    const idx = years.indexOf(state.year);
    el.prevYear.disabled = idx >= years.length - 1;
    el.nextYear.disabled = idx <= 0;

    const parts = [subj.name, cfg.levelNames[state.level], String(state.year)];
    if (state.doc === "scheme") parts.push("Marking scheme");
    else if (papers.length > 1 && papers[state.paper]) parts.push(papers[state.paper].label);
    el.title.textContent = parts.join(" · ");
    document.title = `${parts.join(" ")} – Exam Paper Browser`;

    show(buildUrl());
    syncUrl();
  }

  // ---------- Viewer ----------
  let hintTimer;

  function showCard(heading, text, url) {
    el.fallbackTitle.textContent = heading;
    el.fallbackText.textContent = text;
    el.fallbackOpen.hidden = !url;
    if (url) el.fallbackOpen.href = url;
    el.fallback.hidden = false;
  }

  function show(url) {
    clearTimeout(hintTimer);
    el.fallback.hidden = true;
    el.open.href = url || "#";
    el.open.classList.toggle("disabled", !url);
    el.copy.disabled = !url;

    if (!url) {
      el.frame.src = "about:blank";
      showCard("No paper for this year", "There isn't a paper listed for this subject and year. Try another year.", null);
      return;
    }

    if (isMobile) {
      el.frame.src = "about:blank";
      showCard("Ready to open", "Tap below to open the paper in your phone's PDF viewer.", url);
      return;
    }

    // We can't see inside a page from another website, so if the paper hasn't
    // appeared after a few seconds we gently suggest opening it directly.
    let loaded = false;
    el.frame.onload = () => { loaded = true; };
    el.frame.src = url;
    hintTimer = setTimeout(() => {
      if (!loaded) {
        showCard("Taking a while…",
          "The paper may not load here, or may not exist for this year. Try opening it in a new tab.", url);
      }
    }, 8000);
  }

  // ---------- State updates ----------
  function update(patch) {
    if ("subject" in patch || "level" in patch) state.paper = 0;
    if ("paper" in patch) patch.paper = Number(patch.paper);
    Object.assign(state, patch);
    render();
  }

  function syncUrl() {
    const p = new URLSearchParams({
      subject: state.subject, level: state.level, year: state.year,
      doc: state.doc, paper: state.paper, lang: state.lang,
    });
    history.replaceState(null, "", `${location.pathname}?${p}`);
  }

  // ---------- Events ----------
  el.subject.addEventListener("change", (e) => update({ subject: e.target.value }));
  el.level.addEventListener("change", (e) => update({ level: e.target.value }));
  el.year.addEventListener("change", (e) => update({ year: Number(e.target.value) }));

  const stepYear = (dir) => {
    const y = years[years.indexOf(state.year) + dir];
    if (y) update({ year: y });
  };
  el.prevYear.addEventListener("click", () => stepYear(+1)); // older
  el.nextYear.addEventListener("click", () => stepYear(-1)); // newer

  document.addEventListener("keydown", (e) => {
    if (e.target.tagName === "SELECT") return;
    if (e.key === "ArrowLeft") stepYear(+1);
    if (e.key === "ArrowRight") stepYear(-1);
  });

  el.copy.addEventListener("click", async () => {
    const url = buildUrl();
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      el.copy.textContent = "Copied ✓";
    } catch {
      el.copy.textContent = "Copy failed";
    }
    setTimeout(() => (el.copy.textContent = "Copy link"), 1500);
  });

  render();
})();
