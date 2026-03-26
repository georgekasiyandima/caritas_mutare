const express = require('express');
const { body, validationResult } = require('express-validator');
const { dbGet, dbAll, dbRun } = require('../database/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Submit donation (public)
router.post('/', [
  body('donor_name').notEmpty().withMessage('Donor name is required'),
  body('amount').isFloat({ min: 1 }).withMessage('Amount must be greater than 0'),
  body('donor_email').optional().isEmail().withMessage('Valid email is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      donor_name,
      donor_email,
      amount,
      currency = 'USD',
      payment_method,
      message,
      is_anonymous = false
    } = req.body;

    // In a real implementation, you would integrate with a payment gateway here
    // For now, we'll simulate a successful payment
    const payment_id = `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const result = await dbRun(
      `INSERT INTO donations (donor_name, donor_email, amount, currency, payment_method, payment_status, payment_id, message, is_anonymous)
       VALUES (?, ?, ?, ?, ?, 'completed', ?, ?, ?)`,
      [donor_name, donor_email, amount, currency, payment_method, payment_id, message, is_anonymous]
    );

    const donation = await dbGet('SELECT * FROM donations WHERE id = ?', [result.id]);

    res.status(201).json({
      message: 'Donation processed successfully',
      donation: {
        id: donation.id,
        amount: donation.amount,
        currency: donation.currency,
        payment_id: donation.payment_id,
        created_at: donation.created_at
      }
    });

  } catch (error) {
    console.error('Error processing donation:', error);
    res.status(500).json({ message: 'Server error processing donation' });
  }
});

// Get donation statistics (public)
router.get('/stats', async (req, res) => {
  try {
    // Get total donations
    const totalStats = await dbGet(
      'SELECT COUNT(*) as total_donations, SUM(amount) as total_amount, AVG(amount) as average_amount FROM donations WHERE payment_status = "completed"'
    );

    // Get recent donations (last 30 days)
    const recentStats = await dbGet(
      `SELECT COUNT(*) as recent_donations, SUM(amount) as recent_amount 
       FROM donations 
       WHERE payment_status = "completed" AND created_at >= datetime('now', '-30 days')`
    );

    // Get donations by currency
    const currencyStats = await dbAll(
      'SELECT currency, COUNT(*) as count, SUM(amount) as total FROM donations WHERE payment_status = "completed" GROUP BY currency'
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
    const { page = 1, limit = 20, status, currency } = req.query;
    const offset = (page - 1) * limit;

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
      [...params, parseInt(limit), offset]
    );

    const totalCount = await dbGet(
      `SELECT COUNT(*) as count FROM donations ${whereClause}`,
      params
    );

    res.json({
      donations,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount.count,
        pages: Math.ceil(totalCount.count / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching donations:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single donation (admin)
router.get('/admin/:id', async (req, res) => {
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
  body('payment_status').isIn(['pending', 'completed', 'failed', 'refunded']).withMessage('Invalid payment status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

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

// Get donation analytics (admin)
router.get('/admin/analytics', async (req, res) => {
  try {
    const { period = '30' } = req.query; // days

    // Monthly donations for the last 12 months
    const monthlyDonations = await dbAll(
      `SELECT 
        strftime('%Y-%m', created_at) as month,
        COUNT(*) as count,
        SUM(amount) as total
       FROM donations 
       WHERE payment_status = 'completed' 
       AND created_at >= datetime('now', '-12 months')
       GROUP BY strftime('%Y-%m', created_at)
       ORDER BY month DESC`
    );

    // Donations by payment method
    const paymentMethodStats = await dbAll(
      `SELECT payment_method, COUNT(*) as count, SUM(amount) as total
       FROM donations 
       WHERE payment_status = 'completed'
       GROUP BY payment_method`
    );

    // Top donors
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

module.exports = router;

