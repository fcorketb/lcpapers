# Exam Paper Browser

A static, zero-dependency web app for browsing Leaving Certificate exam papers and marking schemes hosted on examinations.ie. No build step, no server, no stored PDFs — it just builds the right link and shows it.

## Files

| File | Purpose |
|---|---|
| `index.html` | Page layout |
| `styles.css` | Styling (responsive, automatic dark mode) |
| `app.js` | Selection logic, link building, viewer |
| `subjects.js` | **The subject list — edit this to add or fix subjects** |

## Run it locally

Open `index.html` in a browser. Or run a local server:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Features

- 17 Leaving Cert subjects: Accounting, Agricultural Science, Applied Maths, Biology, Business, Chemistry, Computer Science, Economics, English, French, Geography, German, History, Irish, Maths, Physics, Spanish
- Higher, Ordinary and (for Maths and Irish) Foundation Level
- Exam papers **and** marking schemes
- English / Gaeilge switch for subjects that have an Irish-language version
- ‹ › buttons and ← → keys to flip between years
- On a computer the paper shows inside the page; on a phone you get an **Open** button (phones can't show PDFs inside a web page)
- "Open in new tab" and "Copy link" are always available
- The current selection is kept in the page URL, so you can bookmark or share a specific paper
- 2020 is skipped (Leaving Cert exams were cancelled that year)

## Adding a subject

Open `subjects.js` and add an entry. Find the subject code by opening one of its papers on examinations.ie and reading the file name, e.g. `LC032ALP000EV.pdf` → code `032`, single paper `P000`.

```js
{ id: "music", name: "Music", code: "???", levels: ["A", "G"], irishVersion: true,
  papers: [{ label: "Paper", part: "P000" }] },
```

If a subject changed how its paper is split in a particular year, give each paper `from` / `to` years (see Business and Geography in `subjects.js`).

## Deploy for free

### Option A — GitHub Pages

1. Create a free account at github.com and click **New repository** (e.g. `exam-papers`), set it to **Public**.
2. On the new repo page click **uploading an existing file**, drag in `index.html`, `styles.css`, `app.js` and `subjects.js`, and click **Commit changes**.
3. Go to **Settings → Pages**. Under *Build and deployment*, choose **Deploy from a branch**, branch **main**, folder **/ (root)**, then **Save**.
4. After a minute or so the site is live at `https://<your-username>.github.io/exam-papers/`.

To update later, upload the changed files the same way — the site refreshes automatically.

### Option B — Netlify (drag and drop)

1. Go to app.netlify.com/drop and sign in.
2. Drag the project folder onto the page.
3. You get a live `*.netlify.app` URL immediately.

### Option C — Vercel

1. Put the files in a GitHub repo (steps 1–2 of Option A).
2. At vercel.com, click **Add New → Project** and import the repo.
3. Framework preset: **Other**. Leave the build settings empty. Click **Deploy**.

## Known limitations

- **If a paper doesn't appear in the page**, use *Open in new tab*. Browsers don't let one website check what's happening inside another website's page, so the app can't tell for sure whether a paper loaded.
- **Subject codes** come from examinations.ie file names. Irish (`001`) and the Ordinary/Foundation versions of some split papers follow the same pattern but weren't checked individually — if one gives an error page, compare with the real file name on examinations.ie and fix it in `subjects.js`.
- Separate map, picture and source papers (e.g. Geography's common-level map), listening-test MP3s and deferred exams aren't included.

Papers are © State Examinations Commission. This app links to them and does not host or redistribute them.
