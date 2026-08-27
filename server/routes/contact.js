const express = require('express');
const { body, param, validationResult } = require('express-validator');
const { dbRun, dbGet, dbAll } = require('../database/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { discardHoneypot } = require('../middleware/honeypot');
const { writeAudit } = require('../middleware/audit');

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
const honeypot = discardHoneypot({ label: 'Contact', message: SUCCESS_MESSAGE });

router.post(
  '/',
  honeypot,
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

const MAX_PAGE_SIZE = 100;
const STATUSES = ['unread', 'read', 'replied', 'archived'];

function parsePagination(req) {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const pageSize = Math.min(
    MAX_PAGE_SIZE,
    Math.max(1, parseInt(req.query.pageSize, 10) || 25)
  );
  return { page, pageSize, offset: (page - 1) * pageSize };
}

function sendValidation(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return true;
  }
  return false;
}

// Everything below is staff-only. Public POST stays above this line so
// visitors never need a token.
router.use(authenticateToken);
router.use(requireAdmin);

router.get('/', async (req, res) => {
  try {
    const { page, pageSize, offset } = parsePagination(req);
    const status = typeof req.query.status === 'string' ? req.query.status : '';
    const q = typeof req.query.q === 'string' ? req.query.q.trim() : '';

    if (status && !STATUSES.includes(status)) {
      return res.status(400).json({ message: 'Invalid status filter' });
    }

    let where = 'WHERE 1=1';
    const params = [];

    if (status) {
      where += ' AND status = ?';
      params.push(status);
    }

    if (q) {
      where += ' AND (name LIKE ? OR email LIKE ? OR subject LIKE ?)';
      const term = `%${q}%`;
      params.push(term, term, term);
    }

    const rows = await dbAll(
      `SELECT id, name, email, subject, message, status, created_at
       FROM contact_messages ${where}
       ORDER BY CASE status WHEN 'unread' THEN 0 ELSE 1 END, created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, pageSize, offset]
    );

    const totalRow = await dbGet(
      `SELECT COUNT(*) as count FROM contact_messages ${where}`,
      params
    );
    const unreadRow = await dbGet(
      `SELECT COUNT(*) as count FROM contact_messages WHERE status = ?`,
      ['unread']
    );

    res.json({
      data: rows,
      pagination: {
        page,
        pageSize,
        total: Number(totalRow?.count) || 0,
      },
      unread_count: Number(unreadRow?.count) || 0,
    });
  } catch (error) {
    console.error('Error listing contact messages:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get(
  '/:id',
  [param('id').isInt({ min: 1 }).withMessage('Invalid message id')],
  async (req, res) => {
    try {
      if (sendValidation(req, res)) return;

      const message = await dbGet(
        `SELECT id, name, email, subject, message, status, created_at
         FROM contact_messages WHERE id = ?`,
        [req.params.id]
      );

      if (!message) {
        return res.status(404).json({ message: 'Message not found' });
      }

      res.json({ data: message });
    } catch (error) {
      console.error('Error fetching contact message:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

router.patch(
  '/:id',
  [
    param('id').isInt({ min: 1 }).withMessage('Invalid message id'),
    body('status').isIn(STATUSES).withMessage('Invalid status'),
  ],
  async (req, res) => {
    try {
      if (sendValidation(req, res)) return;

      const before = await dbGet(
        `SELECT id, status FROM contact_messages WHERE id = ?`,
        [req.params.id]
      );
      if (!before) {
        return res.status(404).json({ message: 'Message not found' });
      }

      await dbRun(
        'UPDATE contact_messages SET status = ? WHERE id = ?',
        [req.body.status, req.params.id]
      );

      const message = await dbGet(
        `SELECT id, name, email, subject, message, status, created_at
         FROM contact_messages WHERE id = ?`,
        [req.params.id]
      );

      await writeAudit(req, {
        action: 'update',
        entity: 'contact_messages',
        entityId: Number(req.params.id),
        before: { status: before.status },
        after: { status: message.status },
      });

      res.json({ data: message });
    } catch (error) {
      console.error('Error updating contact message:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

module.exports = router;
