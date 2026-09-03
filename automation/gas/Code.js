/**
 * listedbyremy.com - welcome-email web app  (personal-Gmail edition)
 *
 * Sends the client a personalised reply FROM sremy@reliverealty.com with the
 * IABS + Consumer Protection Notice attached, and copies the owner.
 *
 * Runs on a PERSONAL Gmail account that has "Send mail as sremy@reliverealty.com"
 * set up and verified (Gmail -> Settings -> Accounts and Import -> Send mail as).
 * GmailApp is used (not MailApp) because only GmailApp can send from a verified alias.
 *
 * Deploy is handled by clasp. If the web app ever needs re-authorising:
 *   clasp open-script  ->  Run doGet  ->  Allow.
 */

var SENDER = "sremy@reliverealty.com";   // verified "send mail as" alias on this Gmail
var OWNER  = "sremy@reliverealty.com";   // where the lead copy goes
var AGENT  = "Shakur Remy";
var PHONE  = "(646) 688-3442";
var IABS   = "https://agent.reliverealty.com/TREC_ReliveRE.pdf";
var CPN    = "https://agent.reliverealty.com/TCPN_ReliveRE.pdf";

function doGet() {
  return ContentService.createTextOutput("OK");
}

function doPost(e) {
  try {
    var p = (e && e.parameter) || {};
    var kind     = (p.form || "").toLowerCase();       // "contact" | "newsletter"
    var name     = (p.name || "").trim();
    var first    = name.split(/\s+/)[0] || "there";
    var email    = (p.email || "").trim();
    var phone    = (p.phone || "").trim();
    var interest = (p.interest || p.list || "your enquiry").trim();
    var message  = (p.message || "").trim();
    var address  = (p.property_address || "").trim();
    var validEmail = email.indexOf("@") > 0;

    // ---- newsletter: short confirmation, no attachments ----
    if (kind === "newsletter") {
      if (validEmail) {
        GmailApp.sendEmail(email,
          "You are subscribed - San Antonio market note",
          "Thanks for subscribing to the monthly San Antonio luxury market note.\n\n"
        + "You will get new and coming-soon listings in the top neighborhoods, plus a read on where "
        + "prices are heading. No spam - reply 'stop' any time to unsubscribe.\n\n"
        + "- " + AGENT + ", REALTOR(R)",
          { from: SENDER, replyTo: OWNER, name: AGENT });
      }
      GmailApp.sendEmail(OWNER, "Market-note signup: " + (email || "unknown"),
        "New subscriber: " + email, { from: SENDER, name: AGENT });
      return _json({ ok: true });
    }

    // ---- contact form: personalised welcome + attachments ----
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
      "Information About Brokerage Services: " + IABS + "\n" +
      "TREC Consumer Protection Notice: " + CPN + "\n";

    var atts = [];
    try { atts.push(UrlFetchApp.fetch(IABS).getBlob().setName("Information-About-Brokerage-Services.pdf")); } catch (err) {}
    try { atts.push(UrlFetchApp.fetch(CPN).getBlob().setName("TREC-Consumer-Protection-Notice.pdf")); } catch (err) {}

    if (validEmail) {
      GmailApp.sendEmail(email,
        "Thanks for reaching out - " + AGENT,
        body,
        { from: SENDER, replyTo: OWNER, name: AGENT, attachments: atts });
    }

    GmailApp.sendEmail(OWNER,
      "New site enquiry: " + (name || email || "unknown") + " - " + interest,
      "Name: " + name + "\nEmail: " + email + "\nPhone: " + phone +
      "\nInterest: " + interest + (address ? ("\nAddress: " + address) : "") +
      "\n\nMessage:\n" + message,
      { from: SENDER, name: AGENT });

    return _json({ ok: true });
  } catch (err) {
    return _json({ ok: false, error: String(err) });
  }
}

function _json(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
