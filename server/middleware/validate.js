/**
 * Shared request-validation helpers.
 *
 * `routes/system.js` has a local `sendValidation(req, res)` that each handler
 * calls on its first line. That works, but it puts validation *inside* the
 * handler, so forgetting the call silently disables validation — which is how
 * several legacy routes ended up unvalidated.
 *
 * These helpers run as middleware instead: the request never reaches the
 * handler if validation fails, so the handler body can assume clean input.
 * The 400 response shape stays `{ errors: [...] }` to match what the rest of
 * the API and the admin client already expect.
 */

const { param, validationResult } = require('express-validator');

/** Validator chain asserting a route parameter is an integer id. */
function idParam(name = 'id') {
  return param(name).isInt({ min: 1 }).withMessage(`${name} must be a positive integer`);
}

/** Middleware that rejects the request if any earlier validator failed. */
function runValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  return next();
}

module.exports = { idParam, runValidation };
