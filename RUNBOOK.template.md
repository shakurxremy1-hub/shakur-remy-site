# {{DOMAIN}} — Operations Runbook

Copy to `RUNBOOK.md` in the site repo and fill every {{blank}}. Keep it updated.

- Site: single `index.html`, no build. `main` == live.
- Repo: `{{GIT_REMOTE}}` (public — required for free GitHub Pages).
- Host: GitHub Pages, branch `main`, folder `/`.
- Registrar: {{REGISTRAR}}. Registration expires: **{{EXPIRY_DATE}}** (auto-renew ON).

## DNS

| Type | Host | Value |
|------|------|-------|
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| CNAME | `www` | `{{GH_OWNER}}.github.io` |

Repo file `CNAME` = `{{DOMAIN}}` — do not delete it.

## Health check

```bash
curl -sI https://{{DOMAIN}} | head -3           # HTTP/2 200, server: GitHub.com
curl -s https://{{DOMAIN}} | grep -c df-root     # > 0
dig +short {{DOMAIN}} A                           # four 185.199.108-111.153
```
External monitor: {{UPTIME_MONITOR_URL_OR_"none yet"}}

## Deploy

```bash
git add -A && git commit -m "…" && git push origin main   # live in 30-90s
./serve.sh                                                # preview first
```

## Roll back a bad deploy

```bash
git revert HEAD && git push origin main            # undo last commit
# or restore everything to a tagged good version:
git checkout {{LAST_GOOD_TAG}} -- . && git commit -m "roll back" && git push origin main
```
Known-good tags: {{TAGS}}

## Backups

```bash
git bundle create ~/backups/{{REPO}}-$(date +%Y%m%d).bundle --all
```
Rebuild: `git clone <bundle> recovered-site`. Also keep a copy in cloud storage.

## GitHub Pages problems

- Repo went private → make it Public again.
- HTTPS/cert error → Settings → Pages → re-tick Enforce HTTPS; or clear + re-enter
  the custom domain to force a re-issue.
- Not building → Settings → Pages: Source "Deploy from a branch", `main`, `/`.
  Check the Actions tab for a failed "pages build and deployment".
- Account lost → clone from a backup bundle to a new account, re-add the custom
  domain in Pages. DNS already points at Pages, so no DNS change needed.

## Account checklist

- [ ] 2FA on GitHub `{{GH_OWNER}}` + recovery codes offline
- [ ] 2FA on {{REGISTRAR}} + recovery method offline
- [ ] Registrar auto-renew ON, valid card, registration extended
- [ ] `main` branch protection ON (no force-push, no deletion)
- [ ] Recent backup bundle in `~/backups/` and in cloud storage

## Booking flow

"Book a call" links point to `{{BOOKING_URL}}` (set in the Calendly IIFE in
`index.html`). Confirmation email, reminders, and the join link are configured in
the scheduling tool itself, not the site — turn on the confirmation + reminder
emails and set the event location to Zoom/Google Meet so a join link is generated.
