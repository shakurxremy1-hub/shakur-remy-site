# Welcome-email automation

`welcome-email.gs` is a Google Apps Script web app that runs alongside FormSubmit:

- **FormSubmit** still emails you the raw lead (already set up, already activated).
- **This script** sends the person who submitted a personalised reply —
  `Hi {first name}`, a different opening line per request type
  (Buying / Selling / Valuation / Buying+Selling / other), with the
  **IABS** and **Consumer Protection Notice** PDFs attached — and copies you.
- Newsletter signups get a short "you're subscribed" note, no attachments.

## One-time setup (~5 minutes)

1. Go to **script.google.com** signed in as **sremy@reliverealty.com** → **New project**.
2. Delete the sample code, paste in all of `welcome-email.gs`, **Save**.
3. In the toolbar, pick function **`doGet`** → **Run**. Approve the permission
   prompt (send email as you, connect to an external service). This only asks once.
4. **Deploy** (top right) → **New deployment** → gear icon → **Web app**:
   - Description: `welcome email`
   - Execute as: **Me (sremy@reliverealty.com)**
   - Who has access: **Anyone**
   - **Deploy** → copy the **Web app URL** (ends in `/exec`).
5. In `index.html`, paste that URL into `data-welcome="..."` on **both**
   `<form id="contact-form">` and `<form class="news__form">`. Commit + push.

Done. Test by submitting the form on the live site — you should get the lead
(twice: FormSubmit + this script) and the "person" should get the welcome.

## Changing the wording

Edit the strings near the top of `welcome-email.gs` (or the `switch` bodies),
then in Apps Script: **Deploy → Manage deployments → ✏️ edit → Version: New
version → Deploy**. The `/exec` URL stays the same.

## Limits

Gmail/Workspace send quota is 1,500 recipients/day (100 for a personal
@gmail) — far more than a lead form needs. PDFs are fetched fresh from
`agent.reliverealty.com` on each send.

## Interim (already live)

Until the script is deployed, the contact form uses FormSubmit's built-in
`_autoresponse`: a single generic reply with links (not attachments) to the
two disclosures. It has no personalisation. The script replaces it.
