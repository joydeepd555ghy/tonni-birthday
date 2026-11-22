#!/usr/bin/env python3
"""
Media optimization pipeline for Tonni's Birthday Website.

Scans `assets/raw/` recursively (treating each subfolder as an album) and generates:
  - 480px WebP thumbnails (~40 KB) in `assets/photos/thumbs/`
  - 1600px WebP full images (~300 KB) in `assets/photos/full/`, EXIF/GPS stripped
  - 720p H.264 MP4 videos (max 20s, +faststart) + poster JPGs in `assets/videos/`
  - `assets/media.json` manifest

Usage:
  python tools/optimize.py
  python tools/optimize.py --force
"""

from __future__ import annotations

import argparse
import io
import json
import os
import re
import shutil
import subprocess
import sys
from datetime import datetime
from pathlib import Path

try:
    from PIL import ExifTags, Image, ImageOps
except ImportError:
    print("Error: Pillow is required. Install with: pip install Pillow", file=sys.stderr)
    sys.exit(1)

IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".webp", ".bmp", ".tiff", ".tif"}
VIDEO_EXTS = {".mp4", ".mov", ".m4v", ".webm", ".mkv", ".avi"}

MAX_FILE_MB = 100.0
MAX_SITE_MB = 800.0

THUMB_WIDTH = 480
THUMB_TARGET_KB = 45
FULL_WIDTH = 1600
FULL_TARGET_KB = 320
VIDEO_MAX_SECONDS = 20


def slugify(text: str) -> str:
    slug = re.sub(r"[^a-zA-Z0-9_-]+", "-", text.strip().lower()).strip("-")
    return slug or "album"


def rel_posix(path: Path, root: Path) -> str:
    return path.relative_to(root).as_posix()


def extract_image_date(img: Image.Image, src_path: Path) -> str:
    """Extract YYYY-MM-DD from EXIF, filename (e.g. IMG-20260211-WA...), or mtime."""
    try:
        exif = img.getexif()
        if exif:
            tag_map = {ExifTags.TAGS.get(k, k): v for k, v in exif.items()}
            for key in ("DateTimeOriginal", "DateTimeDigitized", "DateTime"):
                val = tag_map.get(key)
                if isinstance(val, str) and len(val) >= 10:
                    date_part = val[:10].replace(":", "-")
                    if re.match(r"^\d{4}-\d{2}-\d{2}$", date_part):
                        return date_part
    except Exception:
        pass
    m = re.search(r"(20\d{2})(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])", src_path.name)
    if m:
        return f"{m.group(1)}-{m.group(2)}-{m.group(3)}"
    mtime = src_path.stat().st_mtime
    return datetime.fromtimestamp(mtime).strftime("%Y-%m-%d")


def extract_video_date(src_path: Path) -> str:
    """Extract YYYY-MM-DD via ffprobe creation_time, falling back to mtime."""
    if shutil.which("ffprobe"):
        try:
            res = subprocess.run(
                [
                    "ffprobe",
                    "-v",
                    "quiet",
                    "-print_format",
                    "json",
                    "-show_entries",
                    "format_tags=creation_time",
                    str(src_path),
                ],
                capture_output=True,
                text=True,
                timeout=10,
            )
            if res.returncode == 0:
                data = json.loads(res.stdout or "{}")
                ct = data.get("format", {}).get("tags", {}).get("creation_time", "")
                if len(ct) >= 10 and re.match(r"^\d{4}-\d{2}-\d{2}$", ct[:10]):
                    return ct[:10]
        except Exception:
            pass
    mtime = src_path.stat().st_mtime
    return datetime.fromtimestamp(mtime).strftime("%Y-%m-%d")


def resize_to_width(img: Image.Image, max_width: int) -> Image.Image:
    w, h = img.size
    if w <= max_width:
        return img.copy()
    new_h = max(1, round(h * (max_width / w)))
    return img.resize((max_width, new_h), Image.Resampling.LANCZOS)


def save_webp_target(
    img: Image.Image, dest: Path, target_kb: int, start_quality: int = 84, min_quality: int = 50
) -> None:
    """Encode image as stripped WebP, stepping quality down if needed to approach target_kb."""
    dest.parent.mkdir(parents=True, exist_ok=True)
    # Convert to RGB/RGBA without any EXIF/ICC bloat
    if img.mode in ("RGBA", "LA") or (img.mode == "P" and "transparency" in img.info):
        clean = img.convert("RGBA")
    else:
        clean = img.convert("RGB")

    target_bytes = target_kb * 1024
    best_bytes = None

    for q in range(start_quality, min_quality - 1, -6):
        buf = io.BytesIO()
        clean.save(buf, format="WEBP", quality=q, method=6)
        data = buf.getvalue()
        best_bytes = data
        if len(data) <= target_bytes:
            break

    dest.write_bytes(best_bytes)


def is_up_to_date(src: Path, outputs: list[Path]) -> bool:
    src_mtime = src.stat().st_mtime
    return all(out.exists() and out.stat().st_mtime >= src_mtime for out in outputs)


def process_image(
    src: Path, thumb_out: Path, full_out: Path, force: bool
) -> tuple[str, str]:
    """Process a single image. Returns (status, date_str)."""
    with Image.open(src) as raw_img:
        date_str = extract_image_date(raw_img, src)
        if not force and is_up_to_date(src, [thumb_out, full_out]):
            return "skipped", date_str

        oriented = ImageOps.exif_transpose(raw_img)
        thumb_img = resize_to_width(oriented, THUMB_WIDTH)
        full_img = resize_to_width(oriented, FULL_WIDTH)

        save_webp_target(thumb_img, thumb_out, THUMB_TARGET_KB, start_quality=80, min_quality=48)
        save_webp_target(full_img, full_out, FULL_TARGET_KB, start_quality=85, min_quality=55)
        return "processed", date_str


def process_video(
    src: Path, video_out: Path, poster_out: Path, thumb_out: Path, force: bool
) -> tuple[str, str]:
    """Transcode video to 720p H.264 MP4 (<=20s, +faststart) + poster JPG + WebP thumb."""
    date_str = extract_video_date(src)
    if not force and is_up_to_date(src, [video_out, poster_out, thumb_out]):
        return "skipped", date_str

    if not shutil.which("ffmpeg"):
        raise RuntimeError(
            f"ffmpeg not found on PATH; cannot process video {src.name}."
        )

    video_out.parent.mkdir(parents=True, exist_ok=True)
    poster_out.parent.mkdir(parents=True, exist_ok=True)
    thumb_out.parent.mkdir(parents=True, exist_ok=True)

    # 1. Transcode MP4 (720p max height/width, <= 20s, faststart, H.264 + AAC)
    cmd = [
        "ffmpeg",
        "-y",
        "-i",
        str(src),
        "-t",
        str(VIDEO_MAX_SECONDS),
        "-vf",
        "scale='if(gt(iw,ih),min(1280,iw),-2)':'if(gt(iw,ih),-2,min(1280,ih))'",
        "-c:v",
        "libx264",
        "-preset",
        "medium",
        "-crf",
        "24",
        "-pix_fmt",
        "yuv420p",
        "-movflags",
        "+faststart",
        "-map_metadata",
        "-1",
        "-c:a",
        "aac",
        "-b:a",
        "128k",
        str(video_out),
    ]
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode != 0:
        raise RuntimeError(f"ffmpeg failed for {src}: {res.stderr[-400:]}")

    # 2. Extract poster JPG at 0.5s (or 0s fallback)
    poster_cmd = [
        "ffmpeg",
        "-y",
        "-ss",
        "0.5",
        "-i",
        str(video_out),
        "-vframes",
        "1",
        "-q:v",
        "3",
        str(poster_out),
    ]
    p_res = subprocess.run(poster_cmd, capture_output=True, text=True)
    if p_res.returncode != 0 or not poster_out.exists():
        subprocess.run(
            ["ffmpeg", "-y", "-i", str(video_out), "-vframes", "1", "-q:v", "3", str(poster_out)],
            capture_output=True,
            check=True,
        )

    # 3. Create 480px WebP thumb from poster for fast masonry loading
    with Image.open(poster_out) as p_img:
        thumb_img = resize_to_width(p_img, THUMB_WIDTH)
        save_webp_target(thumb_img, thumb_out, THUMB_TARGET_KB, start_quality=80, min_quality=48)

    return "processed", date_str


def dir_size_bytes(path: Path, exclude: set[Path] | None = None) -> list[tuple[Path, int]]:
    exclude = exclude or set()
    files: list[tuple[Path, int]] = []
    for root, dirs, filenames in os.walk(path):
        root_p = Path(root)
        # Skip excluded directories (e.g., assets/raw, .git)
        dirs[:] = [
            d for d in dirs
            if (root_p / d) not in exclude and d not in {".git", "__pycache__", ".venv", "venv"}
        ]
        for fn in filenames:
            fp = root_p / fn
            try:
                files.append((fp, fp.stat().st_size))
            except OSError:
                pass
    return files


def main() -> int:
    parser = argparse.ArgumentParser(description="Optimize photos and videos for Tonni's site.")
    parser.add_argument("--force", action="store_true", help="Reprocess all files even if unchanged.")
    args = parser.parse_args()

    project_root = Path(__file__).resolve().parent.parent
    raw_dir = project_root / "assets" / "raw"
    thumbs_dir = project_root / "assets" / "photos" / "thumbs"
    full_dir = project_root / "assets" / "photos" / "full"
    videos_dir = project_root / "assets" / "videos"
    manifest_path = project_root / "assets" / "media.json"

    if not raw_dir.exists():
        raw_dir.mkdir(parents=True, exist_ok=True)
        print(f"Created {raw_dir}. Add album subfolders with photos/videos and re-run.")
        return 0

    # Load existing media.json to preserve user-edited captions and featured flags
    existing_by_full: dict[str, dict] = {}
    if manifest_path.exists():
        try:
            old_items = json.loads(manifest_path.read_text(encoding="utf-8"))
            if isinstance(old_items, list):
                for item in old_items:
                    if isinstance(item, dict) and item.get("full"):
                        existing_by_full[item["full"]] = item
        except Exception:
            pass

    media_items: list[dict] = []
    stats = {"photos_processed": 0, "photos_skipped": 0, "videos_processed": 0, "videos_skipped": 0, "errors": 0}

    raw_files = sorted(
        [p for p in raw_dir.rglob("*") if p.is_file() and not p.name.startswith(".")],
        key=lambda p: p.as_posix().lower(),
    )

    for src in raw_files:
        ext = src.suffix.lower()
        rel_from_raw = src.relative_to(raw_dir)
        album_name = rel_from_raw.parts[0] if len(rel_from_raw.parts) > 1 else "Moments"
        album_slug = slugify(album_name)
        stem_slug = slugify(src.stem)

        if ext in IMAGE_EXTS:
            thumb_out = thumbs_dir / album_slug / f"{stem_slug}.webp"
            full_out = full_dir / album_slug / f"{stem_slug}.webp"
            try:
                status, date_str = process_image(src, thumb_out, full_out, args.force)
                stats[f"photos_{status}"] += 1
                full_rel = rel_posix(full_out, project_root)
                prev = existing_by_full.get(full_rel, {})
                media_items.append(
                    {
                        "type": "photo",
                        "album": album_name,
                        "date": date_str,
                        "caption": prev.get("caption", ""),
                        "thumb": rel_posix(thumb_out, project_root),
                        "full": full_rel,
                        "poster": "",
                        "featured": bool(prev.get("featured", False)),
                    }
                )
            except Exception as exc:
                print(f"[ERROR] Image {src}: {exc}", file=sys.stderr)
                stats["errors"] += 1

        elif ext in VIDEO_EXTS:
            video_out = videos_dir / album_slug / f"{stem_slug}.mp4"
            poster_out = videos_dir / album_slug / f"{stem_slug}_poster.jpg"
            thumb_out = thumbs_dir / album_slug / f"{stem_slug}_video.webp"
            try:
                status, date_str = process_video(src, video_out, poster_out, thumb_out, args.force)
                stats[f"videos_{status}"] += 1
                full_rel = rel_posix(video_out, project_root)
                prev = existing_by_full.get(full_rel, {})
                media_items.append(
                    {
                        "type": "video",
                        "album": album_name,
                        "date": date_str,
                        "caption": prev.get("caption", ""),
                        "thumb": rel_posix(thumb_out, project_root),
                        "full": full_rel,
                        "poster": rel_posix(poster_out, project_root),
                        "featured": bool(prev.get("featured", False)),
                    }
                )
            except Exception as exc:
                print(f"[ERROR] Video {src}: {exc}", file=sys.stderr)
                stats["errors"] += 1

    # Ensure at least a few items are featured if none are marked yet
    if media_items and not any(item.get("featured") for item in media_items):
        for item in media_items[:min(5, len(media_items))]:
            item["featured"] = True

    manifest_path.parent.mkdir(parents=True, exist_ok=True)
    manifest_path.write_text(json.dumps(media_items, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    # Size report
    site_files = dir_size_bytes(project_root, exclude={raw_dir})
    total_mb = sum(sz for _, sz in site_files) / (1024 * 1024)
    largest_path, largest_bytes = max(site_files, key=lambda x: x[1], default=(project_root, 0))
    largest_mb = largest_bytes / (1024 * 1024)
    over_limit = [(p, sz / (1024 * 1024)) for p, sz in site_files if sz > MAX_FILE_MB * 1024 * 1024]

    print("\n=== Optimization Report ===")
    print(f"Photos : {stats['photos_processed']} processed, {stats['photos_skipped']} skipped")
    print(f"Videos : {stats['videos_processed']} processed, {stats['videos_skipped']} skipped")
    print(f"Errors : {stats['errors']}")
    print(f"Manifest: {manifest_path.relative_to(project_root)} ({len(media_items)} items)")
    print(f"Site size (excluding assets/raw): {total_mb:.2f} MB / {MAX_SITE_MB:.0f} MB limit")
    print(f"Largest output file: {largest_path.relative_to(project_root)} ({largest_mb:.2f} MB / {MAX_FILE_MB:.0f} MB limit)")

    if over_limit:
        print("\n[WARNING] Files exceeding 100 MB GitHub limit:", file=sys.stderr)
        for p, mb in over_limit:
            print(f"  - {p.relative_to(project_root)}: {mb:.2f} MB", file=sys.stderr)
        return 1

    if total_mb > MAX_SITE_MB:
        print(f"\n[WARNING] Total site size ({total_mb:.2f} MB) exceeds {MAX_SITE_MB:.0f} MB budget!", file=sys.stderr)
        return 1

    return 1 if stats["errors"] > 0 else 0


if __name__ == "__main__":
    raise SystemExit(main())
