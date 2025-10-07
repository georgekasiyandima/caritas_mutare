const express = require('express');
const { body, validationResult } = require('express-validator');
const { dbGet, dbAll, dbRun } = require('../database/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Submit volunteer application (public)
router.post('/', [
  body('full_name').notEmpty().withMessage('Full name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').optional().isMobilePhone().withMessage('Valid phone number is required')
], async (req, res) => {
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
      message
    } = req.body;

    // Check if volunteer already exists
    const existingVolunteer = await dbGet(
      'SELECT id FROM volunteers WHERE email = ?',
      [email]
    );

    if (existingVolunteer) {
      return res.status(400).json({ message: 'Volunteer application already exists for this email' });
    }

    const result = await dbRun(
      `INSERT INTO volunteers (full_name, email, phone, skills, availability, interests, message)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [full_name, email, phone, skills, availability, interests, message]
    );

    const volunteer = await dbGet('SELECT * FROM volunteers WHERE id = ?', [result.id]);

    res.status(201).json({
      message: 'Volunteer application submitted successfully',
      volunteer: {
        id: volunteer.id,
        full_name: volunteer.full_name,
        email: volunteer.email,
        status: volunteer.status,
        created_at: volunteer.created_at
      }
    });

  } catch (error) {
    console.error('Error submitting volunteer application:', error);
    res.status(500).json({ message: 'Server error processing volunteer application' });
  }
});

// Admin routes (require authentication)
router.use(authenticateToken);
router.use(requireAdmin);

// Get all volunteers (admin)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    const offset = (page - 1) * limit;

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
      [...params, parseInt(limit), offset]
    );

    const totalCount = await dbGet(
      `SELECT COUNT(*) as count FROM volunteers ${whereClause}`,
      params
    );

    res.json({
      volunteers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount.count,
        pages: Math.ceil(totalCount.count / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching volunteers:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single volunteer (admin)
router.get('/:id', async (req, res) => {
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
  body('status').isIn(['pending', 'approved', 'rejected', 'active', 'inactive']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

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
router.delete('/:id', async (req, res) => {
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

// Get volunteer statistics (admin)
router.get('/stats', async (req, res) => {
  try {
    // Get total volunteers
    const totalStats = await dbGet(
      'SELECT COUNT(*) as total_volunteers FROM volunteers'
    );

    // Get volunteers by status
    const statusStats = await dbAll(
      'SELECT status, COUNT(*) as count FROM volunteers GROUP BY status'
    );

    // Get recent volunteers (last 30 days)
    const recentStats = await dbGet(
      `SELECT COUNT(*) as recent_volunteers 
       FROM volunteers 
       WHERE created_at >= datetime('now', '-30 days')`
    );

    // Get volunteers by skills
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

// Export volunteers data (admin)
router.get('/export/csv', async (req, res) => {
  try {
    const volunteers = await dbAll(
      'SELECT full_name, email, phone, skills, availability, interests, status, created_at FROM volunteers ORDER BY created_at DESC'
    );

    // Convert to CSV format
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

module.exports = router;

