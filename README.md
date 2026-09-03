# shakurremy.com

Cinematic single-page site for **Shakur Remy**, REALTOR® — Relive Realty, San Antonio TX.
Built from the [cinematic-scroll-template](https://github.com/shakurxremy1-hub/cinematic-scroll-template).

- One `index.html`, no build. `main` == live.
- Scroll-scrubbed canvas flythrough of a luxury home (6 scenes) → About Shakur →
  Featured Areas → Contact.
- Primary CTA everywhere: **View listings** → https://a.nhb.app/u/shakur-remy

## Edit

| What | Where in `index.html` |
|---|---|
| Meta / title / OG | `<head>` |
| Palette + fonts | `:root` — `--sw-accent: #c9a86a` (champagne), Playfair Display |
| Scene copy / labels / accents | the `mountScrollWorld({ … sections: […] })` call at the bottom |
| Bio, headshot | `#founder` section |
| Neighborhood cards | `#tiers` section |
| Phone / email / license | `#contact` section |

Contact details in use: **(646) 688-3442**, **sremy@reliverealty.com**, TREC **#844622**.

## Frames

`assets/frames/` (384 × 1440w JPEG) and `assets/frames-m/` (384 × 640×1138 WebP)
were built by `./build-frames.sh` from the 6 Seedance clips in `src/` (gitignored).
To re-cut: drop new `src/sceneN.mp4` files, run `./build-frames.sh`, update
`frameCount` / `frameCountMobile` to the number it prints.

## Preview / deploy

```bash
./serve.sh            # http://localhost:8899
```
Deploy: GitHub Pages from `main` / root. Custom domain `shakurremy.com` once registered —
see `DEPLOY.md`, then fill in `RUNBOOK.md`.
