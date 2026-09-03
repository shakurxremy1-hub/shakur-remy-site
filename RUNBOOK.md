# listedbyremy.com — Operations Runbook

Live now at **https://shakurxremy1-hub.github.io/shakur-remy-site/**
Fill the remaining {{blanks}} once the domain is registered.

- Site: single `index.html`, no build. `main` == live.
- Repo: git@github.com:shakurxremy1-hub/shakur-remy-site.git  (public — required for free GitHub Pages)
- Host: GitHub Pages, branch `main`, folder `/`
- Known-good tag: `v1.0` (commit d179a48) — launch build
- `main` branch protection: ON (no force-push, no deletion, enforce_admins)
- Agent: Shakur Remy · REALTOR® · Relive Realty · TREC #844622 · San Antonio, TX
- Contact shown on site: (646) 688-3442 · sremy@reliverealty.com
- Listings CTA target: https://a.nhb.app/u/shakur-remy
- Registrar: {{REGISTRAR}} · expires {{EXPIRY}} · auto-renew ON

## DNS (once listedbyremy.com is registered)

| Type | Host | Value |
|------|------|-------|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | shakurxremy1-hub.github.io |

Then: add `CNAME` file = `listedbyremy.com`, set it in repo Settings → Pages,
tick Enforce HTTPS.

## Health check
```bash
curl -sI https://listedbyremy.com | head -3
curl -s https://listedbyremy.com | grep -c df-root
```

## Deploy / roll back
```bash
git add -A && git commit -m "…" && git push origin main     # live in ~60s
git revert HEAD && git push origin main                      # undo last
git checkout {{LAST_GOOD_TAG}} -- . && git commit -m roll-back && git push
```

## Re-cut the flythrough
Drop new clips in `src/sceneN.mp4`, `./build-frames.sh`, update `frameCount` /
`frameCountMobile` in `index.html` to the printed number, commit.

## Lead forms (FormSubmit)
Contact form + market-note signup POST to `formsubmit.co/…/sremy@reliverealty.com`.
- FIRST submission from the live domain triggers a one-time activation email to
  that address — click the link once, then every submission is delivered.
- To hide the raw email in page source: after activation, FormSubmit gives a
  random alias (e.g. `formsubmit.co/ajax/xxxxxxxx`). Swap both `action` and
  `data-endpoint` on `#contact-form` and `.news__form`.
- Change recipient: edit those two attributes on both forms.

## Analytics
`index.html` head has a GA4 stub — replace `G-XXXXXXXXXX` with a real GA4
Measurement ID (analytics.google.com → Admin → Data streams). No-ops until set.
Swap for Plausible/GoatCounter if you prefer no cookie banner.

## Custom domain: listedbyremy.com (registered? then do this)
1. All in-page URLs (`og:url`, `og:image`, canonical, JSON-LD, robots, sitemap)
   already point to `https://listedbyremy.com/`.
2. At the registrar, add the 5 DNS records in the table above
   (4× A `@` → 185.199.108–111.153, plus `CNAME www` → `shakurxremy1-hub.github.io`).
3. Create a file named `CNAME` in the repo root containing exactly
   `listedbyremy.com` (no scheme, no trailing slash), commit, push.
   ⚠️ Do this only AFTER the DNS records exist — once a custom domain is set,
   GitHub redirects the `*.github.io` URL to it, so the site is unreachable
   until DNS resolves.
4. Repo → Settings → Pages: confirm the domain shows a green check, tick
   "Enforce HTTPS" (cert can take up to ~1 hour).

## Edit content
- Testimonials: `#references` — comment above the section shows the card format.
- Neighborhood link targets: `.tier__btn` hrefs in `#tiers` (homes.com per area).
- FAQ / Services / Process copy: plain markup in those sections.
- Book-a-call button: not added yet — give a Calendly/Cal.com URL to wire in.

## Backups
```bash
git bundle create ~/backups/shakur-remy-site-$(date +%Y%m%d).bundle --all
```

## Accounts
- [ ] 2FA on GitHub {{GH_OWNER}} + recovery codes offline
- [ ] 2FA on registrar
- [ ] registrar auto-renew ON, card valid
- [ ] `main` branch protection (no force-push, no deletion)
