# Happy Birthday, Tonni

A private, romantic, mobile-first birthday website built with plain HTML, CSS, and JavaScript (no build step) for GitHub Pages.

## 1. Prerequisites for Media Optimization

Before adding your own photos and videos, install:

- **Python 3.10+** — [python.org](https://www.python.org/downloads/)
- **Pillow** (Python image library):
  ```bash
  pip install Pillow
  ```
- **ffmpeg** (video transcoding & poster extraction):
  - **Windows**: `winget install Gyan.FFmpeg` (or download from [ffmpeg.org](https://ffmpeg.org/download.html) and add `bin/` to `PATH`)
  - **macOS**: `brew install ffmpeg`
  - **Linux (Ubuntu/Debian)**: `sudo apt install ffmpeg`

## 2. How to Add Photos and Videos

1. Put your original photos and videos inside `assets/raw/`, organized into subfolders by album name:
   ```text
   assets/raw/
     First Dates/
       cafe.jpg
       walk.mp4
     Durga Puja/
       pandal.jpg
   ```
   *(Note: `assets/raw/` is listed in `.gitignore`, so your huge originals will never be pushed to GitHub.)*

2. Run the optimizer from the project root:
   ```bash
   python tools/optimize.py
   ```
   This will:
   - Create `480px` WebP thumbnails (~40 KB) in `assets/photos/thumbs/`
   - Create `1600px` WebP full images (~300 KB) in `assets/photos/full/` with EXIF/GPS metadata stripped
   - Transcode videos to `720p` H.264 MP4 (max 20 seconds, `+faststart`) + poster JPGs in `assets/videos/`
   - Generate `assets/media.json` (preserving any captions or `featured: true` flags you already edited)
   - Skip files that are already processed (pass `--force` to rebuild everything)
   - Print a size report confirming every file is under 100 MB and the total site is under 800 MB.

3. *(Optional)* Open `assets/media.json` to add handwritten `caption` strings or set `"featured": true` on items you want in the top 3D carousel.

## 3. How to Edit Text, Dates, Reasons & Letter

All editable text lives in [`js/config.js`](js/config.js):
- **Gate screen**: Set `gate.enabled` to `true` or `false`, or customize `questionBn`, `questionEn`, and `acceptedAnswers`.
- **Names & Start Date**: Update `meta.startDate` (`"2026-02-10"`) and names in `meta`.
- **Album Chapter Names**: Add Bengali + English display names for your `assets/raw/` folder names under `gallery.albums`.
- **Timeline, Reasons, Cake & Letter**: Edit `timeline.stops`, `reasons.items`, and `letter.paragraphs` directly in `js/config.js`.

## 4. How to Replace the Music

1. Place your MP3 file at `assets/music/song.mp3` (or update `meta.musicSrc` in `js/config.js`).
2. Keep the file reasonably sized (e.g. 3–8 MB) for fast mobile loading.
3. If `assets/music/song.mp3` is not present, the site plays a gentle built-in Web Audio music-box melody as a fallback when Tonni taps **Tap to play music**.

## 5. How to Deploy on GitHub Pages

1. Create a new repository on GitHub.
2. Push all files in this folder (`.gitignore` automatically excludes `assets/raw/`).
3. Go to **Settings → Pages → Build and deployment**:
   - Source: **Deploy from a branch**
   - Branch: **`main`** and **`/ (root)`**
   - Click **Save**.
4. Wait ~1 minute and open your live URL: `https://YOUR-USERNAME.github.io/REPO-NAME/`.
