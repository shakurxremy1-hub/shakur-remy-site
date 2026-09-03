# Welcome-email automation

## Current state (parked)

**Live now:** FormSubmit's built-in `_autoresponse` on both forms. Every inquiry
gets an instant plain-text reply with **links** (not attachments) to the IABS
and Consumer Protection Notice. The lead notification to `sremy@reliverealty.com`
works. This is the interim.

**Not done:** the personalised welcome (by first name + request type) with the
two PDFs **attached**, sent from `sremy@reliverealty.com`.

### Why it's parked

Two blockers, both about not controlling the `reliverealty.com` domain:

1. **FormSubmit cannot attach files** to an auto-reply. Plain text only. No
   setting changes this.
2. **Apps Script** (`welcome-email.gs` / `gas/Code.js`) was built and deployed
   under `sremy@reliverealty.com` (script id `15wwOMwmy2pPrCXsrLD0g0U0RHRB8qtH8XrNOD752W3x5NSvnNy29FCOS`,
   deployment `AKfycbzDslAhyVr7...`), but the `reliverealty.com` Google Workspace
   admin has web-app deployment locked to domain-only, so the `/exec` URL returns
   "You need access" to anonymous requests (i.e. the website).

### To finish it later, pick one

- **Workspace admin flips one setting.** admin.google.com -> Apps -> Google
  Apps Script -> allow web apps for "anyone, anonymous". Then:
  `cd automation/gas && clasp push --force && clasp create-deployment` and paste
  the new `/exec` URL into `data-welcome="..."` on both forms in `index.html`.
  `Code.js` (MailApp version) already sends from `sremy@reliverealty.com`.
- **Send from an `@listedbyremy.com` address.** Set up email on that domain
  (Google Workspace / Zoho), use `gas/Code.js` (GmailApp version, currently in
  the repo) with a "send mail as" alias, or point it at a transactional API
  (Resend/Postmark) via `UrlFetchApp` from any Google account.

## Files

- `welcome-email.gs` — MailApp version (sends as the running account; needs the
  Workspace admin fix above).
- `gas/Code.js` — GmailApp version (sends from a verified "send mail as" alias;
  for the personal-Gmail route). `gas/appsscript.json` has the web-app manifest.
- `gas/.clasp.json` — points at the deployed script.

## Form wiring (already in index.html)

Both `<form id="contact-form">` and `<form class="news__form">` carry:
- `data-welcome=""` — paste the Apps Script `/exec` URL here to activate.
- hidden `form` field (`contact` / `newsletter`) so the script branches.
- `_autoresponse` — the interim FormSubmit reply.

The submit handler fires a no-cors POST to `data-welcome` (if set) alongside the
FormSubmit POST.
