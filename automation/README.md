# Welcome-email automation

## Current state (live)

Both forms in `index.html` (`#contact-form`, `.news__form`) fire three
fire-and-forget requests on submit, plus the primary Web3Forms POST:

1. **Web3Forms** (`data-endpoint`/`action`) — delivers the lead to
   `sremy@reliverealty.com`. This is the one the on-page status message
   waits on.
2. **`data-welcome`** — a Twilio Function
   (`https://listedbyremy-lead-notify-1136.twil.io/send-welcome`) that calls
   Resend to send the lead a branded welcome email with both required PDFs
   attached (IABS - Information About Brokerage Services, and the TREC
   Consumer Protection Notice). Resend fetches the PDFs itself
   (attachments-by-URL), so the function never has to store or stream the
   files:
   - IABS: `https://listedbyremy-lead-notify-1136.twil.io/IABS_Relive_Realty.pdf`
     — a public Twilio Asset in this same Serverless Service, uploaded from
     `real-estate/07 Disclosures/IABS_Relive_Realty.pdf`. Re-upload a new
     version the same way (Assets -> `IABS_Relive_Realty` -> new Version at
     path `/IABS_Relive_Realty.pdf`) if the form ever needs to change.
   - TCPN: `https://agent.reliverealty.com/TCPN_ReliveRE.pdf` (unchanged).
3. **`data-notify`** — a second Twilio Function
   (`.../notify-lead`) that sends Shakur a WhatsApp message (via Twilio's
   WhatsApp Sandbox) with the lead's details.

Both Twilio Functions live in the same Serverless Service
(`listedbyremy-lead-notify`, SID `ZS96eb4e1eb87e3c2869c22e0b0af452fb`) and
share the `NOTIFY_SECRET` environment variable, passed as a `?secret=`
query param so random requests to the public URLs can't trigger sends.
`send-welcome` additionally uses the `RESEND_API_KEY` environment variable
(scoped to Resend's Sending-access-only, restricted to the
`listedbyremy.com` domain — see `config/mail-accounts.json` in remy-os for
the same key).

Both requests are sent as `application/x-www-form-urlencoded` (via
`URLSearchParams`, not raw `FormData`) — Twilio Functions' body parser
rejects `multipart/form-data` with a bare 415.

## Superseded (no longer used)

The original plan sent this from `sremy@reliverealty.com` via a Google Apps
Script web app, blocked because the Workspace admin for `reliverealty.com`
has web-app deployment locked to domain-only (`welcome-email.gs` /
`gas/Code.js` in this directory are dead code now, kept for reference only).
The current approach sidesteps that entirely by sending from
`shakur@listedbyremy.com` (a domain Shakur owns and has verified in Resend)
instead.

## To change the welcome-email copy or attachments

Edit the Twilio Function directly (Twilio Console -> Functions and Assets ->
Services -> `listedbyremy-lead-notify` -> `send-welcome`), or redeploy via
the Serverless REST API. The function body isn't stored in this repo.
