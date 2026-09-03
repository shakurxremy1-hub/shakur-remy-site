# shakurremy.com — Operations Runbook

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

## DNS (once shakurremy.com is registered)

| Type | Host | Value |
|------|------|-------|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | shakurxremy1-hub.github.io |

Then: add `CNAME` file = `shakurremy.com`, set it in repo Settings → Pages,
tick Enforce HTTPS.

## Health check
```bash
curl -sI https://shakurremy.com | head -3
curl -s https://shakurremy.com | grep -c df-root
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

## Backups
```bash
git bundle create ~/backups/shakur-remy-site-$(date +%Y%m%d).bundle --all
```

## Accounts
- [ ] 2FA on GitHub {{GH_OWNER}} + recovery codes offline
- [ ] 2FA on registrar
- [ ] registrar auto-renew ON, card valid
- [ ] `main` branch protection (no force-push, no deletion)
