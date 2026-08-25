const express = require('express');
const { body, validationResult } = require('express-validator');
const { dbRun } = require('../database/database');

const router = express.Router();

const SUCCESS_MESSAGE =
  'Thank you. We have received your message and will be in touch soon.';

/**
 * Public contact form submission.
 * POST /api/contact
 *
 * Design notes:
 * - Validation is the real security boundary (never trust the client).
 * - We store first, then optionally notify. A row in the database is what
 *   staff can act on; email can be added later without changing this contract.
 * - A filled honeypot looks like success to the sender so bots do not learn
 *   to retry. We do not persist those submissions.
 */
function discardHoneypot(req, res, next) {
  const bait =
    typeof req.body?.company_website === 'string'
      ? req.body.company_website.trim()
      : '';

  if (bait) {
    console.warn('Contact honeypot triggered; submission discarded');
    return res.status(201).json({
      success: true,
      message: SUCCESS_MESSAGE,
    });
  }

  return next();
}

router.post(
  '/',
  discardHoneypot,
  [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Name is required')
      .isLength({ min: 2, max: 100 })
      .withMessage('Name must be between 2 and 100 characters'),
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Please provide a valid email address')
      .normalizeEmail()
      .isLength({ max: 254 })
      .withMessage('Email is too long'),
    body('subject')
      .trim()
      .notEmpty()
      .withMessage('Subject is required')
      .isLength({ min: 3, max: 150 })
      .withMessage('Subject must be between 3 and 150 characters'),
    body('message')
      .trim()
      .notEmpty()
      .withMessage('Message is required')
      .isLength({ min: 10, max: 5000 })
      .withMessage('Message must be between 10 and 5000 characters'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, subject, message } = req.body;

      await dbRun(
        `INSERT INTO contact_messages (name, email, subject, message)
         VALUES (?, ?, ?, ?)`,
        [name, String(email).toLowerCase(), subject, message]
      );

      res.status(201).json({
        success: true,
        message: SUCCESS_MESSAGE,
      });
    } catch (error) {
      console.error('Error saving contact message:', error);
      res.status(500).json({
        message: 'Something went wrong while sending your message. Please try again later.',
      });
    }
  }
);

module.exports = router;
