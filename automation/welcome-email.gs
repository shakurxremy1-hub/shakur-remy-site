/**
 * listedbyremy.com - welcome-email web app
 * Receives a form POST, emails the person a personalised reply with the
 * IABS + Consumer Protection Notice attached, and copies the owner.
 *
 * DEPLOY (once):
 *   1. script.google.com  ->  New project  ->  paste this over Code.gs
 *   2. Save. Run doGet once and approve the permission prompt
 *      (needs: send email as you, connect to an external service).
 *   3. Deploy  ->  New deployment  ->  Web app
 *        Execute as:  Me (sremy@reliverealty.com)
 *        Who has access:  Anyone
 *      Deploy, copy the Web app URL (ends in /exec).
 *   4. Put that URL in index.html data-welcome="..." on BOTH forms. Commit.
 *
 * Change wording later: edit the strings, then
 * Deploy -> Manage deployments -> edit -> Version: New version -> Deploy.
 *
 * NOTE: this file is deliberately plain ASCII so copy-paste cannot break it.
 */

var OWNER    = "sremy@reliverealty.com";
var AGENT    = "Shakur Remy";
var PHONE    = "(646) 688-3442";
var IABS_URL = "https://agent.reliverealty.com/TREC_ReliveRE.pdf";
var CPN_URL  = "https://agent.reliverealty.com/TCPN_ReliveRE.pdf";

function doPost(e) {
  try {
    var p = (e && e.parameter) || {};
    var kind     = (p.form || "").toLowerCase();          // "contact" | "newsletter"
    var name     = (p.name || "").trim();
    var first    = name.split(/\s+/)[0] || "there";
    var email    = (p.email || "").trim();
    var phone    = (p.phone || "").trim();
    var interest = (p.interest || p.list || "General enquiry").trim();
    var message  = (p.message || "").trim();
    var address  = (p.property_address || "").trim();

    var validEmail = email && email.indexOf("@") > 0;

    // ---------- newsletter: short confirmation, no attachments ----------
    if (kind === "newsletter") {
      if (validEmail) {
        MailApp.sendEmail({
          to: email, replyTo: OWNER, name: AGENT,
          subject: "You are subscribed - San Antonio market note",
          body: "Thanks for subscribing to the monthly San Antonio luxury market note.\n\n"
              + "You will get new and coming-soon listings in the top neighborhoods, plus a read on where "
              + "prices are heading. No spam - reply 'stop' any time to unsubscribe.\n\n"
              + "- " + AGENT + ", REALTOR(R)"
        });
      }
      MailApp.sendEmail({
        to: OWNER,
        subject: "Market-note signup: " + (email || "unknown"),
        body: "New subscriber: " + email
      });
      return _json({ ok: true });
    }

    // ---------- contact form: personalised welcome + attachments ----------
    var intro;
    switch (interest.toLowerCase()) {
      case "buying":
        intro = "Thanks for reaching out about buying in San Antonio. I will pull together a few options that fit "
              + "what you described and follow up personally within one business day. If you are not pre-approved "
              + "yet, I can introduce you to a local lender who knows this market.";
        break;
      case "selling":
      case "a home valuation":
        intro = "Thanks for reaching out about selling" + (address ? (" " + address) : "") + ". I will prepare a "
              + "considered valuation (recent comparable sales adjusted for your home, not an automated estimate) "
              + "and send it over within one business day.";
        break;
      case "buying and selling":
        intro = "Thanks for reaching out. Buying and selling at the same time is mostly about choreography - timing "
              + "and financing - and I will call within one business day to walk through how we would line the two up.";
        break;
      default:
        intro = "Thanks for reaching out. I have received your note and will follow up personally within one business day.";
    }

    var body =
      "Hi " + first + ",\n\n" +
      intro + "\n\n" +
      "You can reach me directly at " + PHONE + " or just reply to this email.\n\n" +
      "- " + AGENT + ", REALTOR(R)\n" +
      "Relive Real Estate Inc. - TREC License #844622\n\n" +
      "---\n" +
      "Texas requires that I share these with you. They are attached, and also here:\n" +
      "Information About Brokerage Services: " + IABS_URL + "\n" +
      "TREC Consumer Protection Notice: " + CPN_URL + "\n";

    var atts = [];
    try { atts.push(UrlFetchApp.fetch(IABS_URL).getBlob().setName("Information-About-Brokerage-Services.pdf")); } catch (err) {}
    try { atts.push(UrlFetchApp.fetch(CPN_URL).getBlob().setName("TREC-Consumer-Protection-Notice.pdf")); } catch (err) {}

    if (validEmail) {
      MailApp.sendEmail({
        to: email, replyTo: OWNER, name: AGENT,
        subject: "Thanks for reaching out - " + AGENT,
        body: body,
        attachments: atts
      });
    }

    MailApp.sendEmail({
      to: OWNER,
      subject: "New site enquiry: " + (name || email || "unknown") + " - " + interest,
      body: "Name: " + name + "\nEmail: " + email + "\nPhone: " + phone +
            "\nInterest: " + interest + (address ? ("\nAddress: " + address) : "") +
            "\n\nMessage:\n" + message
    });

    return _json({ ok: true });
  } catch (err) {
    return _json({ ok: false, error: String(err) });
  }
}

function doGet() { return ContentService.createTextOutput("OK"); }

function _json(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
