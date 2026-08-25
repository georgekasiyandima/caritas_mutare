const express = require('express');
const { body, validationResult } = require('express-validator');
const { dbGet, dbAll, dbRun } = require('../database/database');
const { daysAgo, monthsAgo, monthBucket } = require('../database/sqlCompat');
const { discardHoneypot } = require('../middleware/honeypot');
const { idParam, runValidation } = require('../middleware/validate');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

const PLEDGE_MESSAGE =
  'Thank you. Your intent to give has been received. Our team will confirm payment details shortly.';

const honeypot = discardHoneypot({ label: 'Donation', message: PLEDGE_MESSAGE });

// Public pledge — never records a completed payment. Card/mobile money
// processors come later, after Caritas owns the merchant account.
router.post(
  '/',
  honeypot,
  [
    body('donor_name')
      .trim()
      .notEmpty()
      .withMessage('Name is required')
      .isLength({ min: 2, max: 100 })
      .withMessage('Name must be between 2 and 100 characters'),
    body('amount').isFloat({ min: 1 }).withMessage('Amount must be greater than 0'),
    body('currency')
      .optional({ values: 'falsy' })
      .trim()
      .isLength({ min: 3, max: 8 }),
    body('donor_email')
      .optional({ values: 'falsy' })
      .trim()
      .isEmail()
      .withMessage('Please provide a valid email address')
      .normalizeEmail()
      .isLength({ max: 254 }),
    body('donor_phone').optional({ values: 'falsy' }).trim().isLength({ max: 40 }),
    body('message').optional({ values: 'falsy' }).trim().isLength({ max: 2000 }),
    body('payment_method').optional({ values: 'falsy' }).trim().isLength({ max: 80 }),
    body('frequency').optional({ values: 'falsy' }).isIn(['one_time', 'monthly']),
    body('designation').optional({ values: 'falsy' }).trim().isLength({ max: 80 }),
    body('is_anonymous').optional().isBoolean(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        donor_name,
        donor_email,
        donor_phone,
        amount,
        currency = 'USD',
        payment_method,
        message,
        is_anonymous = false,
        frequency = 'one_time',
        designation = 'most_needed',
      } = req.body;

      await dbRun(
        `INSERT INTO donations (
           donor_name, donor_email, donor_phone, amount, currency,
           payment_method, payment_status, message, is_anonymous,
           frequency, designation, source
         ) VALUES (?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?, ?, ?)`,
        [
          donor_name,
          donor_email ? String(donor_email).toLowerCase() : null,
          donor_phone || null,
          amount,
          currency,
          payment_method || null,
          message || null,
          is_anonymous ? 1 : 0,
          frequency,
          designation,
          'web_donate_page',
        ]
      );

      res.status(201).json({
        success: true,
        message: PLEDGE_MESSAGE,
      });
    } catch (error) {
      console.error('Error saving donation pledge:', error);
      res.status(500).json({ message: 'Server error processing donation pledge' });
    }
  }
);

// Get donation statistics (public)
router.get('/stats', async (req, res) => {
  try {
    // Get total donations
    const totalStats = await dbGet(
      "SELECT COUNT(*) as total_donations, SUM(amount) as total_amount, AVG(amount) as average_amount FROM donations WHERE payment_status = 'completed'"
    );

    // Get recent donations (last 30 days)
    const recentStats = await dbGet(
      `SELECT COUNT(*) as recent_donations, SUM(amount) as recent_amount 
       FROM donations 
       WHERE payment_status = 'completed' AND created_at >= ?`,
      [daysAgo(30)]
    );

    // Get donations by currency
    const currencyStats = await dbAll(
      "SELECT currency, COUNT(*) as count, SUM(amount) as total FROM donations WHERE payment_status = 'completed' GROUP BY currency"
    );

    res.json({
      total: {
        donations: totalStats.total_donations || 0,
        amount: totalStats.total_amount || 0,
        average: totalStats.average_amount || 0
      },
      recent: {
        donations: recentStats.recent_donations || 0,
        amount: recentStats.recent_amount || 0
      },
      by_currency: currencyStats
    });
  } catch (error) {
    console.error('Error fetching donation stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin routes (require authentication)
router.use(authenticateToken);
router.use(requireAdmin);

// Get all donations (admin)
router.get('/admin', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 25));
    const offset = (page - 1) * limit;
    const status = typeof req.query.status === 'string' ? req.query.status : '';
    const currency = typeof req.query.currency === 'string' ? req.query.currency : '';

    let whereClause = 'WHERE 1=1';
    const params = [];

    if (status) {
      whereClause += ' AND payment_status = ?';
      params.push(status);
    }

    if (currency) {
      whereClause += ' AND currency = ?';
      params.push(currency);
    }

    const donations = await dbAll(
      `SELECT * FROM donations ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    const totalCount = await dbGet(
      `SELECT COUNT(*) as count FROM donations ${whereClause}`,
      params
    );
    const pendingRow = await dbGet(
      `SELECT COUNT(*) as count FROM donations WHERE payment_status = ?`,
      ['pending']
    );

    res.json({
      donations,
      pagination: {
        page,
        limit,
        total: Number(totalCount?.count) || 0,
        pages: Math.ceil((Number(totalCount?.count) || 0) / limit),
      },
      pending_count: Number(pendingRow?.count) || 0,
    });
  } catch (error) {
    console.error('Error fetching donations:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Static path must sit before /admin/:id.
router.get('/admin/analytics', async (req, res) => {
  try {
    const monthExpr = monthBucket('created_at');
    const monthlyDonations = await dbAll(
      `SELECT 
        ${monthExpr} as month,
        COUNT(*) as count,
        SUM(amount) as total
       FROM donations 
       WHERE payment_status = 'completed' 
       AND created_at >= ?
       GROUP BY ${monthExpr}
       ORDER BY month DESC`,
      [monthsAgo(12)]
    );

    const paymentMethodStats = await dbAll(
      `SELECT payment_method, COUNT(*) as count, SUM(amount) as total
       FROM donations 
       WHERE payment_status = 'completed'
       GROUP BY payment_method`
    );

    const topDonors = await dbAll(
      `SELECT 
        CASE WHEN is_anonymous = 1 THEN 'Anonymous' ELSE donor_name END as donor_name,
        COUNT(*) as donation_count,
        SUM(amount) as total_amount
       FROM donations 
       WHERE payment_status = 'completed'
       GROUP BY donor_name, is_anonymous
       ORDER BY total_amount DESC
       LIMIT 10`
    );

    res.json({
      monthly_donations: monthlyDonations,
      payment_methods: paymentMethodStats,
      top_donors: topDonors
    });
  } catch (error) {
    console.error('Error fetching donation analytics:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single donation (admin)
router.get('/admin/:id', [idParam(), runValidation], async (req, res) => {
  try {
    const donation = await dbGet(
      'SELECT * FROM donations WHERE id = ?',
      [req.params.id]
    );

    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    res.json({ donation });
  } catch (error) {
    console.error('Error fetching donation:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update donation status (admin)
router.put('/admin/:id', [
  idParam(),
  body('payment_status').isIn(['pending', 'completed', 'failed', 'refunded']).withMessage('Invalid payment status'),
  runValidation
], async (req, res) => {
  try {
    const { payment_status } = req.body;

    const result = await dbRun(
      'UPDATE donations SET payment_status = ? WHERE id = ?',
      [payment_status, req.params.id]
    );

    if (result.changes === 0) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    const donation = await dbGet('SELECT * FROM donations WHERE id = ?', [req.params.id]);

    res.json({
      message: 'Donation updated successfully',
      donation
    });
  } catch (error) {
    console.error('Error updating donation:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

