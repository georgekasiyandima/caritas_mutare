/**
 * Spam trap for public form submissions.
 *
 * Every public form renders a hidden `company_website` field that a human
 * never sees and so never fills in. Bots populate every field they find, so a
 * non-empty value means the submission is almost certainly automated.
 *
 * We reply with the same 201 and success message a genuine submission would
 * receive, rather than an error, so the bot cannot tell it was rejected and
 * won't retry with the field stripped out.
 */
function discardHoneypot({ label, message }) {
  return function honeypotGuard(req, res, next) {
    const bait =
      typeof req.body?.company_website === 'string'
        ? req.body.company_website.trim()
        : '';

    if (bait) {
      console.warn(`${label} honeypot triggered; submission discarded`);
      return res.status(201).json({ success: true, message });
    }

    return next();
  };
}

module.exports = { discardHoneypot };
