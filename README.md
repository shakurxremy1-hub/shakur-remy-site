# Cinematic Scroll Template

A single-file, zero-dependency landing page with an **Apple-style scroll-scrubbed
camera flight**: the hero is a `<canvas>` playing a pre-rendered frame sequence,
scrubbed by scroll position. Below it, a founder section, a pricing grid, and a
contact block flow out of the flight with no visible seam.

Built from `opmventuresllc.com`. Everything here is the real, working code.

- **No build step.** One `index.html` (inline CSS + JS). What you deploy is what runs.
- **No dependencies.** Vanilla JS. Google Fonts is the only external request.
- **iOS-safe.** The flight is a canvas blitting JPEG/WebP frames — not a scrubbed
  `<video>` (which stalls on `currentTime` seeks and won't autoplay on iOS).
- **Instant.** Frame 1 is preloaded in `<head>`; the flight is scrubbable the
  moment it lands (~0.15 s local, ~0.5 s cold on GitHub Pages).
- **Mobile gets its own portrait frame set** (640×1138 WebP, ~half the bytes) and
  a more aggressive loader so the scrub keeps up on cellular.

---

## File map

```
index.html            The whole site. Editable spots are marked  ✏️ EDIT.
build-frames.sh        Turn 6 scene clips into the desktop + mobile frame sets.
serve.sh               Local preview server (with HTTP range support).
DEPLOY.md              GitHub Pages + custom domain + DNS + hardening.
RUNBOOK.template.md    Per-site ops runbook — copy into each new project, fill {{...}}.
assets/
  frames/             f0001.jpg …   desktop landscape frames (~1440w, JPEG q4)
  frames-m/           f0001.webp …  mobile portrait frames  (640×1138, WebP q72)
  img/
    logo.png          circular brand mark, ~256px, transparent PNG
    founder.png       portrait with the background cut out
    og.jpg            1200×630 social share card
    favicon-32.png / favicon-180.png / favicon-192.png   (transparent, circular)
```

`frames/` and `frames-m/` **must contain the same number of files.** That number
goes in the config as `frameCount` and `frameCountMobile`.

---

## Make a new site (≈30 min once you have footage)

### 1. Copy the folder
```bash
cp -r ~/projects/cinematic-scroll-template ~/projects/my-new-site
cd ~/projects/my-new-site
```

### 2. Frames  →  see "Frame pipeline" below
Drop your 6 rendered scene clips in `src/` and run `./build-frames.sh`. It writes
`assets/frames/` and `assets/frames-m/` and prints the frame count.

### 3. Brand images
Replace `assets/img/logo.png`, `founder.png`, `og.jpg`, and the three favicons.
Favicons: resize `logo.png` keeping alpha (transparent corners render circular) —
```bash
for s in 32 180 192; do sips -Z $s assets/img/logo.png --out assets/img/favicon-$s.png; done
```

### 4. Edit `index.html` — only the `✏️ EDIT` spots
| Where | What |
|---|---|
| `<head>` | title, description, `og:`/`twitter:` tags, `og:url`, `og:image`, `theme-color` |
| `mountScrollWorld({…})` (bottom) | `frameCount` + `frameCountMobile` = your frame count; `brand.name` / `brand.logo`; `cta`; each of the 6 `sections` (`accent` hex, `eyebrow`, `title`, `body`, `tags[]`); `cta` on the last section only |
| `#founder` section | portrait `src`/`alt`, eyebrow, `<h2>`, two `<p>`, two buttons |
| `#tiers` section | eyebrow, `<h2>`, one `.tier` card per plan; recommended one gets `class="tier tier--feature"` + `<span class="tier__badge">Recommended</span>` |
| `#contact` section | eyebrow, `<h2>`, lead, 3 buttons, fine-print line |
| Calendly IIFE (after `#contact`) | `CAL = 'your-scheduling-url'` |

Optional palette: `:root` at the top of `<style>` — `--sw-bg` (dark base; also set
`<meta name="theme-color">` to match), `--sw-ink`, `--sw-accent`, and the two
font variables. Per-scene `accent` in the config overrides `--sw-accent` at runtime.

### 5. Preview
```bash
./serve.sh          # http://localhost:8899
```
Check: flight scrubs from the top with no "loading" gap; desktop nav pills +
right-side dot rail work; on a phone-width window the portrait frames load and
`.df-root--m` is on `#world`; founder/tiers/contact flow with no seam; no console
errors.

### 6. Deploy → `DEPLOY.md`

---

## Frame pipeline

The flight is `N` still frames. Any source that gives you a continuous camera move
works — AI video (Seedance / Runway / Kling), a 3D render, drone footage. The
reference site used **6 clips of ~8 s each at 8 fps ≈ 386 frames**.

### If you're generating the clips with AI video
- Render **two aspect ratios**: 16:9 for desktop, 9:16 for mobile. (Or render 16:9
  only and let `build-frames.sh` centre-crop to portrait — softer result.)
- Keep the camera moving forward the whole time; the cut between clips should land
  on a matching composition so the join is invisible.
- To keep re-renders seam-matched, lock each clip's **first frame = previous
  clip's last frame** (most video APIs take `first_frame` / `last_frame`).
- Dark, high-contrast, slow moves scrub best. Avoid fast pans and bright flashes.

### Build
```bash
# put clips in src/ named scene1.mp4 … scene6.mp4 (portrait 9:16 preferred)
./build-frames.sh
```
It concatenates them, then:
- **desktop** `assets/frames/fNNNN.jpg` — scaled to 1440w, JPEG q4, 8 fps
- **mobile**  `assets/frames-m/fNNNN.webp` — 640×1138, WebP q72, 8 fps

Then set `frameCount` and `frameCountMobile` in `index.html` to the number it
prints, and update the 6 `<link rel="preload">` frame lines in `<head>` only if
you changed the file extension or directory (paths, not counts).

### Tuning knobs (config in `index.html`)
| Key | Default | Effect |
|---|---|---|
| `diveScroll` | 1.3 | viewport-heights of scroll per scene (whole flight length) |
| `sections[i].scroll` | — | per-scene override of `diveScroll` (longer = slower dwell) |
| `sections[i].linger` | 0 | 0–0.6; settles the camera mid-scene where the copy peaks |
| `scrollPerMobile` | 1.15 | per-scene scroll on phones |
| `maxParallelMobile` | 24 | concurrent frame downloads on phones |
| `lookAheadMobile` | 26 | frames prefetched ahead of the scrub on phones |
| `chaseMobile` | 0.12 | scrub-follow easing on phones (lower = smoother, lazier) |

---

## Why it's built this way

- **Canvas + frames, not `<video>`.** `video.currentTime = x` triggers a decoder
  seek and needs the file buffered; `ctx.drawImage(frame)` is instant. iOS also
  blocks inline video autoplay. The progressive loader draws the nearest loaded
  frame and streams the rest, so there's never a blank state.
- **Separate mobile frame set.** A 16:9 frame wastes >half its pixels on a phone.
  A native 9:16 WebP set is smaller *and* sharper. WebP decodes faster than JPEG
  on iOS.
- **Continuous flow.** The `#founder` section's top ~34vh is transparent with a
  gradient fade, and `.df-bg` (the canvas) is deliberately *not* faded when you
  scroll past the flight — so the last frame stays painted behind the fade and the
  page reads as one space.
- **`prefers-reduced-motion`.** Grain, cursor glow, float, aurora, and the rise-in
  reveals all switch off. The flight still works (scrubs without the eased chase).
- **Everything is GPU-cheap.** Effects are `transform`/`opacity` only; particle
  canvases pause when off-screen; no effect adds a second `requestAnimationFrame`
  loop competing with the scrub.

---

## What NOT to touch

- The big `<script>` after `#contact` (`mountScrollWorld`, `mountDesktopFlight`,
  `mountMobileStory`, the vendored engine).
- The effects CSS blocks: `#fx-grain`, `#fx-glow`, `.tier` sheen/specular/ring,
  `.fx-shine`, `.fx-rise`, `.df-*`, `.mv2-*`.
- The premium-details `<script>` (cursor glow, magnetic buttons, tilt, scramble,
  count-up, motes, reveals) and the smooth-anchor `<script>`.

Rebrand = content + assets + the config object. That's it.
