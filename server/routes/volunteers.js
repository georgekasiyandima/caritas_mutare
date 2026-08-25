const express = require('express');
const { body, validationResult } = require('express-validator');
const { dbGet, dbAll, dbRun } = require('../database/database');
const { daysAgo } = require('../database/sqlCompat');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { discardHoneypot } = require('../middleware/honeypot');
const { idParam, runValidation } = require('../middleware/validate');

const router = express.Router();

const SUCCESS_MESSAGE =
  'Thank you. Your volunteer application has been received. We will be in touch.';

const honeypot = discardHoneypot({ label: 'Volunteer', message: SUCCESS_MESSAGE });

// Submit volunteer application (public)
router.post(
  '/',
  honeypot,
  [
    body('full_name')
      .trim()
      .notEmpty()
      .withMessage('Full name is required')
      .isLength({ min: 2, max: 100 })
      .withMessage('Full name must be between 2 and 100 characters'),
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Please provide a valid email address')
      .normalizeEmail()
      .isLength({ max: 254 })
      .withMessage('Email is too long'),
    // isMobilePhone() is locale-specific and rejects many valid Zimbabwe numbers.
    // Length + trim is enough at this slice; staff can follow up by phone.
    body('phone')
      .optional({ values: 'falsy' })
      .trim()
      .isLength({ max: 40 })
      .withMessage('Phone number is too long'),
    body('skills').optional({ values: 'falsy' }).trim().isLength({ max: 2000 }),
    body('availability').optional({ values: 'falsy' }).trim().isLength({ max: 1000 }),
    body('interests').optional({ values: 'falsy' }).trim().isLength({ max: 1000 }),
    body('message').optional({ values: 'falsy' }).trim().isLength({ max: 5000 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        full_name,
        email,
        phone,
        skills,
        availability,
        interests,
        message,
      } = req.body;

      const normalisedEmail = String(email).toLowerCase();

      const existingVolunteer = await dbGet(
        'SELECT id FROM volunteers WHERE email = ?',
        [normalisedEmail]
      );

      if (existingVolunteer) {
        return res.status(409).json({
          message: 'We already have a volunteer application for this email address.',
        });
      }

      await dbRun(
        `INSERT INTO volunteers (full_name, email, phone, skills, availability, interests, message)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          full_name,
          normalisedEmail,
          phone || null,
          skills || null,
          availability || null,
          interests || null,
          message || null,
        ]
      );

      res.status(201).json({
        success: true,
        message: SUCCESS_MESSAGE,
      });
    } catch (error) {
      console.error('Error submitting volunteer application:', error);
      res.status(500).json({ message: 'Server error processing volunteer application' });
    }
  }
);

// Admin routes (require authentication)
router.use(authenticateToken);
router.use(requireAdmin);

// Get all volunteers (admin)
router.get('/', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 25));
    const offset = (page - 1) * limit;
    const status = typeof req.query.status === 'string' ? req.query.status : '';
    const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';

    let whereClause = 'WHERE 1=1';
    const params = [];

    if (status) {
      whereClause += ' AND status = ?';
      params.push(status);
    }

    if (search) {
      whereClause += ' AND (full_name LIKE ? OR email LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm);
    }

    const volunteers = await dbAll(
      `SELECT * FROM volunteers ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    const totalCount = await dbGet(
      `SELECT COUNT(*) as count FROM volunteers ${whereClause}`,
      params
    );
    const pendingRow = await dbGet(
      `SELECT COUNT(*) as count FROM volunteers WHERE status = ?`,
      ['pending']
    );

    res.json({
      volunteers,
      pagination: {
        page,
        limit,
        total: Number(totalCount?.count) || 0,
        pages: Math.ceil((Number(totalCount?.count) || 0) / limit),
      },
      pending_count: Number(pendingRow?.count) || 0,
    });
  } catch (error) {
    console.error('Error fetching volunteers:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Static admin paths must be registered before /:id or they are treated as ids.
router.get('/stats', async (req, res) => {
  try {
    const totalStats = await dbGet(
      'SELECT COUNT(*) as total_volunteers FROM volunteers'
    );

    const statusStats = await dbAll(
      'SELECT status, COUNT(*) as count FROM volunteers GROUP BY status'
    );

    const recentStats = await dbGet(
      `SELECT COUNT(*) as recent_volunteers 
       FROM volunteers 
       WHERE created_at >= ?`,
      [daysAgo(30)]
    );

    const skillsStats = await dbAll(
      `SELECT 
        CASE 
          WHEN skills IS NULL OR skills = '' THEN 'No skills specified'
          ELSE skills 
        END as skill_category,
        COUNT(*) as count
       FROM volunteers 
       GROUP BY skill_category
       ORDER BY count DESC
       LIMIT 10`
    );

    res.json({
      total: totalStats.total_volunteers || 0,
      recent: recentStats.recent_volunteers || 0,
      by_status: statusStats,
      by_skills: skillsStats
    });
  } catch (error) {
    console.error('Error fetching volunteer stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/export/csv', async (req, res) => {
  try {
    const volunteers = await dbAll(
      'SELECT full_name, email, phone, skills, availability, interests, status, created_at FROM volunteers ORDER BY created_at DESC'
    );

    const csvHeader = 'Full Name,Email,Phone,Skills,Availability,Interests,Status,Created At\n';
    const csvData = volunteers.map(volunteer => {
      return [
        `"${volunteer.full_name}"`,
        `"${volunteer.email}"`,
        `"${volunteer.phone || ''}"`,
        `"${volunteer.skills || ''}"`,
        `"${volunteer.availability || ''}"`,
        `"${volunteer.interests || ''}"`,
        `"${volunteer.status}"`,
        `"${volunteer.created_at}"`
      ].join(',');
    }).join('\n');

    const csv = csvHeader + csvData;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=volunteers.csv');
    res.send(csv);
  } catch (error) {
    console.error('Error exporting volunteers:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single volunteer (admin)
router.get('/:id', [idParam(), runValidation], async (req, res) => {
  try {
    const volunteer = await dbGet(
      'SELECT * FROM volunteers WHERE id = ?',
      [req.params.id]
    );

    if (!volunteer) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }

    res.json({ volunteer });
  } catch (error) {
    console.error('Error fetching volunteer:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update volunteer status (admin)
router.put('/:id', [
  idParam(),
  body('status').isIn(['pending', 'approved', 'rejected', 'active', 'inactive']).withMessage('Invalid status'),
  runValidation
], async (req, res) => {
  try {
    const { status } = req.body;

    const result = await dbRun(
      'UPDATE volunteers SET status = ? WHERE id = ?',
      [status, req.params.id]
    );

    if (result.changes === 0) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }

    const volunteer = await dbGet('SELECT * FROM volunteers WHERE id = ?', [req.params.id]);

    res.json({
      message: 'Volunteer status updated successfully',
      volunteer
    });
  } catch (error) {
    console.error('Error updating volunteer:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete volunteer (admin)
router.delete('/:id', [idParam(), runValidation], async (req, res) => {
  try {
    const result = await dbRun('DELETE FROM volunteers WHERE id = ?', [req.params.id]);

    if (result.changes === 0) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }

    res.json({ message: 'Volunteer deleted successfully' });
  } catch (error) {
    console.error('Error deleting volunteer:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

