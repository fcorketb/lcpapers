/*
 * Paper catalogue — edit this file to add or fix subjects.
 *
 * How examinations.ie names its files, e.g. LC003ALP100EV.pdf:
 *
 *   LC   003   A   L   P100   EV
 *   │    │     │       │      └─ version: EV English, IV Irish, BV bilingual
 *   │    │     │       └──────── paper part: P100 = Paper 1, P200 = Paper 2,
 *   │    │     │                 P000 = single paper, PA00 = listening (aural)
 *   │    │     └──────────────── level: A Higher, G Ordinary, B Foundation
 *   │    └────────────────────── subject code
 *   └─────────────────────────── LC = Leaving Certificate
 *
 * Subject fields:
 *   code          3-digit subject code
 *   levels        which of A / G / B exist
 *   version       file suffix for the papers (default "EV")
 *   irishVersion  true = an Irish-language version (IV) also exists,
 *                 so the English / Gaeilge switch is shown
 *   papers        list of { label, part, from?, to? }
 *                 `from` / `to` limit a paper to certain years — used when
 *                 a subject changed how its paper is split up.
 */
window.EXAM_CONFIG = {
  paperUrl: "https://www.examinations.ie/archive/exampapers",
  schemeUrl: "https://www.examinations.ie/archive/markingschemes",
  years: { from: 2015, to: 2026 },
  skipYears: [2020], // Leaving Cert exams were cancelled in 2020

  levelNames: { A: "Higher Level", G: "Ordinary Level", B: "Foundation Level" },

  subjects: [
    { id: "accounting", name: "Accounting", code: "032", levels: ["A", "G"], irishVersion: true,
      papers: [{ label: "Paper", part: "P000" }] },

    { id: "ag-science", name: "Agricultural Science", code: "024", levels: ["A", "G"], irishVersion: true,
      papers: [{ label: "Paper", part: "P000" }] },

    { id: "applied-maths", name: "Applied Mathematics", code: "020", levels: ["A", "G"], irishVersion: true,
      papers: [{ label: "Paper", part: "P000" }] },

    { id: "biology", name: "Biology", code: "025", levels: ["A", "G"], irishVersion: true,
      papers: [
        { label: "Sections A & B", part: "P038" },
        { label: "Section C", part: "P040" },
      ] },

    { id: "business", name: "Business", code: "033", levels: ["A", "G"], irishVersion: true,
      papers: [
        { label: "Paper", part: "P000", to: 2019 },
        { label: "Section 1", part: "P032", from: 2021 },
        { label: "Sections 2 & 3", part: "P041", from: 2021 },
      ] },

    { id: "chemistry", name: "Chemistry", code: "022", levels: ["A", "G"], irishVersion: true,
      papers: [{ label: "Paper", part: "P000" }] },

    { id: "computer-science", name: "Computer Science", code: "219", levels: ["A", "G"], irishVersion: true,
      papers: [
        { label: "Sections A & B", part: "P038", from: 2021 },
        { label: "Section C", part: "P040", from: 2021 },
      ] },

    { id: "economics", name: "Economics", code: "034", levels: ["A", "G"], irishVersion: true,
      papers: [{ label: "Paper", part: "P000" }] },

    { id: "english", name: "English", code: "002", levels: ["A", "G"],
      papers: [
        { label: "Paper 1", part: "P100" },
        { label: "Paper 2", part: "P200" },
      ] },

    { id: "french", name: "French", code: "010", levels: ["A", "G"], version: "BV",
      papers: [
        { label: "Written paper", part: "P000" },
        { label: "Listening paper", part: "PA00" },
      ] },

    { id: "geography", name: "Geography", code: "005", levels: ["A", "G"], irishVersion: true,
      papers: [
        { label: "Paper", part: "P000", to: 2019 },
        { label: "Part 1", part: "P042", from: 2021 },
        { label: "Part 2", part: "P043", from: 2021 },
      ] },

    { id: "german", name: "German", code: "011", levels: ["A", "G"], version: "BV",
      papers: [
        { label: "Written paper", part: "P000" },
        { label: "Listening paper", part: "PA00" },
      ] },

    { id: "history", name: "History", code: "004", levels: ["A", "G"], irishVersion: true,
      papers: [{ label: "Paper", part: "P000" }] },

    // Irish papers are only published in Irish (IV).
    { id: "irish", name: "Irish (Gaeilge)", code: "001", levels: ["A", "G", "B"], version: "IV",
      papers: [
        { label: "Páipéar 1", part: "P100" },
        { label: "Páipéar 2", part: "P200" },
      ] },

    { id: "maths", name: "Mathematics", code: "003", levels: ["A", "G", "B"], irishVersion: true,
      papers: [
        { label: "Paper 1", part: "P100" },
        { label: "Paper 2", part: "P200" },
      ],
      // Foundation Level has a single paper
      levelPapers: { B: [{ label: "Paper", part: "P000" }] } },

    { id: "physics", name: "Physics", code: "021", levels: ["A", "G"], irishVersion: true,
      papers: [{ label: "Paper", part: "P000" }] },

    { id: "spanish", name: "Spanish", code: "012", levels: ["A", "G"],
      papers: [
        { label: "Written paper", part: "P000" },
        { label: "Listening paper", part: "PA00" },
      ] },
  ],
};
