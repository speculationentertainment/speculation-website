# How to Update My Website

My site lives on **GitHub** and publishes itself through **Netlify**.
Whenever I change something on GitHub, the live site updates on its own
in about **1 minute**. No downloads, no drag-and-drop.

- **Edit here:** github.com → my `speculation-website` repo
- **It goes live at:** my custom domain (automatically)
- Works from my **phone or computer**, in any web browser (just be logged in to GitHub).

---

## Add a gallery photo

1. On GitHub, open the repo → tap **`assets`** → tap **`gallery`**.
2. Tap **Add file** → **Upload files**.
3. Choose the photo(s) from my phone/computer.
4. Tap the green **Commit changes**.

Any filename is fine. The photo appears in the home-page carousel automatically,
and gets shrunk for fast loading on its own. Live in ~1 minute.

## Remove a gallery photo

1. Open **`assets`** → **`gallery`** and tap the photo I want gone.
2. Tap the **trash-can** icon (Delete this file).
3. Tap **Commit changes**.

It disappears from the carousel automatically.

## Change text (prices, dates, contact info, the promo bar)

1. Open the file that has the text:
   - **`index.html`** — home page
   - **`dj.html`** — Mobile DJ page (packages, prices)
   - **`bar.html`** — Mobile Bar page (packages, prices)
   - **`site.js`** — the yellow announcement/promo bar, and the upgrade prices list
2. Tap the **pencil (✏️)** icon to edit.
3. Change the words. **Only change the text between the marks — don't delete the
   `<` `>` symbols or quotes around things.**
4. Scroll down, tap **Commit changes**.

Live in ~1 minute.

---

## If something looks wrong

- Give it a full minute, then refresh the page (on phone: pull down to refresh).
- Check **app.netlify.com** — the latest deploy should say **Published**. If it says
  **Failed**, I probably changed a file in a way that broke it.
- If I'm stuck, undo isn't scary: every change is saved in GitHub's history and can be
  rolled back. Ask Claude and paste any red error text from Netlify.

## What still needs Claude

Day-to-day photo and text changes I do myself (above). Come back to Claude for the
bigger stuff:

- A new page or section
- Design / layout / color changes
- Anything where I'm not sure which file to touch

---

## How it works (just so I know)

- **GitHub** stores all the site's files.
- **Netlify** watches GitHub. On every change it runs `build.js` (which re-scans the
  `assets/gallery` folder and rebuilds the photo list), then publishes the site.
- Big photos are served through Netlify's automatic image resizer, so the page stays
  fast no matter how large the original photo is.
- I do **not** need the old `_deploy` download step anymore.
