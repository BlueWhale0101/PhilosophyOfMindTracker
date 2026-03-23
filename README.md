# Philosophy of Mind Tracker

A simple static web app for tracking progress through a philosophy of mind reading list.

## Features

- Ordered reading list
- Check off completed books and papers
- Keep notes for each item
- Progress summary with completion ring
- Data saved locally in the browser with `localStorage`
- Export and import progress as JSON
- Deployable on GitHub Pages with no build step

## Files

- `index.html`
- `styles.css`
- `script.js`

## Quick start

Open `index.html` in a browser.

## Deploy to GitHub Pages

1. Create a new GitHub repository.
2. Upload these files to the repository root.
3. Commit and push.
4. In GitHub, open **Settings** → **Pages**.
5. Under **Build and deployment**, choose:
   - **Source:** Deploy from a branch
   - **Branch:** `main` (or your default branch)
   - **Folder:** `/root`
6. Save.
7. GitHub will give you a public URL for the app.

## Notes

- Progress is stored in the browser on the device you use.
- If you want a backup or want to move devices, use **Export progress** and then **Import progress** on the other device.
