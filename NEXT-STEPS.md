# Next steps — the 4 things that raise the site's rating

Everything on the site side is already wired. Each item below needs one thing
from you; once you send it, the change goes live in minutes.

---

## 1. Real testimonials  ← biggest impact

The References section (`#references`, titled "The standard on every deal") is
built as a 3-card grid. Right now the cards hold my service commitments. Swap in
real client quotes and it becomes true social proof.

### What to send me
3–5 quotes, each with:
- The quote (1–3 sentences, their words — light cleanup is fine)
- First name + last initial (e.g. "Marcus T.")
- Neighborhood or area (e.g. "Converse", "Stone Oak")
- Buyer / Seller, and the year

Raw texts or emails from happy clients are perfect — paste them as-is and I'll
tighten them. **Get a yes from each client first** (the request message in
section 5 does that for you).

### Where they go
Straight into the existing `.refs__card` blocks. Format:

```html
<div class="refs__card">
  <p class="refs__quote">&ldquo;Shakur walked us through our first purchase without ever making us feel rushed. We closed in 31 days.&rdquo;</p>
  <p class="refs__who">Marcus T. &middot; Converse &middot; Buyer, 2025</p>
</div>
```

---

## 2. Real scheduler (Cal.com)

"Book a call" buttons currently scroll to the contact form. Give me a scheduling
link and every one of them opens your real calendar instead. The code is already
listening — I just paste the URL into one line.

### Set up Cal.com (free, ~5 minutes)
1. Go to **cal.com** → **Sign up** (use your Google account for the fastest path).
2. Pick the username `shakur-remy` (or similar) → your base link is
   `https://cal.com/shakur-remy`.
3. **Connect your calendar**: Settings → Calendars → connect the Google account
   you actually use. This is what stops double-booking.
4. **Create one event type**: name it "Intro call", 20 min, location = Phone call
   (it'll ask the booker for their number). Save.
5. **Set availability**: Availability tab → set the days/hours you take calls.
6. Copy the event link — it looks like `https://cal.com/shakur-remy/intro-call`.
   **Send me that link.**

(Calendly works too — same idea, send me the event link. Cal.com's free tier is
less restrictive, which is why I'm pointing you there.)

### What I do with it
Paste it into `var CAL = '...'` near the bottom of `index.html`. Done. Every
"Book a call" button (top nav, About section, first-time-buyer section) then
opens it in a new tab. Leave it blank and the form fallback stays.

---

## 3. Proof of production

A short stats strip near the top — the kind of numbers a buyer scans in two
seconds to know you're active.

### What to send me (only what's true and you're comfortable showing)
Any of:
- Total sales volume closed (e.g. "$4.2M")
- Number of transactions / families helped (e.g. "14")
- Years licensed / active (e.g. "since 2023")
- Price range you work across (e.g. "$230K–$1M+")

If you want a "recently sold" row with photos, send me 3–4 of **your own**
listings (address, neighborhood, sale price, close month). Showing other
brokerages' sales as yours is a TREC problem, so we stick to yours.

### What I do
Build a `.statstrip` under the trust bar and drop the numbers in. Structure will
look like:

```
  $4.2M closed   ·   14 families   ·   licensed since 2023   ·   $230K–$1M+
```

---

## 4. Intro video (30–60 seconds)

Face-to-camera is the highest-converting thing the site doesn't have yet.

### Script (say it your way — don't read it stiff)
> "Hey — I'm Shakur Remy, a REALTOR® here in San Antonio with Relive Realty.
>
> Most of the people I work with aren't buying mansions. They're buying their
> first place, moving up for more room, or relocating here for work — and they
> want one person who actually picks up the phone.
>
> That's what I do. First tour to closing table, same agent the whole way. I'll
> tell you what a home is really worth, what you'll net, and when to walk.
>
> If you're thinking about buying or selling this year, book a call — it's a
> conversation, not a pitch."

### Shooting notes
- Phone is fine. Shoot **horizontal (landscape)**.
- Daylight from a window in front of you, not behind.
- Steady — lean the phone on something or use a tripod.
- Business-casual, quiet room, look at the lens.
- 2–3 takes, send me the best one (or all of them).

### What I do
Compress it, generate a poster frame, and place it in the About section with
lazy-loading so it doesn't slow the page. Host options: self-hosted MP4 (cleanest,
no branding) or an unlisted YouTube embed — your call.

---

## 5. Message to send past clients (for #1 and the Google review link)

Send this to clients you've closed with. Text first; email version below.

### Text message
> Hey [name] — Shakur here. I'm putting a few client stories on my website and
> I'd love to include yours. Would you be up for a sentence or two about what it
> was like working with me on the [neighborhood] [purchase/sale]? No pressure on
> wording — even a rough note is great, I'll tidy it and run the final by you
> before it goes up.
>
> And if you've got 60 seconds, a Google review helps more than anything:
> [REVIEW LINK]
>
> Either way — good to still have you as a neighbor. Thanks.

### Email version
> **Subject:** A quick favor — one or two sentences?
>
> Hi [name],
>
> I hope the [house / new place] still feels like home.
>
> I'm adding real client stories to my website and yours is one I'd want on
> there. Could you send me a sentence or two on how the [buying / selling]
> process went — anything that stuck with you? Send it however it comes out;
> I'll clean it up and get your okay before anything is published.
>
> First name and last initial only, with your neighborhood — e.g. "Marcus T.,
> Converse."
>
> If you're willing to leave a Google review as well, that's the single most
> helpful thing for a solo agent: [REVIEW LINK]
>
> Thank you — it means a lot.
>
> Shakur Remy
> REALTOR® · Relive Real Estate Inc. · TREC #844622
> (210) 871-1562 · sremy@reliverealty.com

### Getting your Google review link
1. Search your business name on Google, or open your Google Business Profile.
2. Business Profile manager → **Ask for reviews** → copy the short link
   (`https://g.page/r/…/review`).
3. Send it to me — I'll paste it into `var REVIEW = '...'` and the
   "Leave a Google review" line appears in the References section automatically.

---

## Summary — what I need from you

| Item | Send me |
|------|---------|
| Testimonials | 3–5 quotes + first name/last initial + area + buyer/seller + year |
| Scheduler | Your Cal.com (or Calendly) event link |
| Proof | Real numbers: volume, # deals, years, price range — and/or your own sold listings |
| Video | One 30–60s landscape phone video |
| Review link | Your Google Business Profile "write a review" link |
