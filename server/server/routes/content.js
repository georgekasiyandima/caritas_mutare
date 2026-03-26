const express = require('express');
const { body, validationResult } = require('express-validator');
const { dbGet, dbAll, dbRun } = require('../database/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all programs (public)
router.get('/programs', async (req, res) => {
  try {
    const programs = await dbAll(
      'SELECT * FROM programs WHERE status = "active" ORDER BY order_index ASC, created_at DESC'
    );
    res.json({ programs });
  } catch (error) {
    console.error('Error fetching programs:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single program (public)
router.get('/programs/:id', async (req, res) => {
  try {
    const program = await dbGet(
      'SELECT * FROM programs WHERE id = ? AND status = "active"',
      [req.params.id]
    );

    if (!program) {
      return res.status(404).json({ message: 'Program not found' });
    }

    res.json({ program });
  } catch (error) {
    console.error('Error fetching program:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get site settings (public)
router.get('/settings', async (req, res) => {
  try {
    const settings = await dbAll('SELECT * FROM site_settings');
    
    // Convert to object format
    const settingsObj = {};
    settings.forEach(setting => {
      settingsObj[setting.key] = {
        en: setting.value_en,
        sh: setting.value_sh,
        type: setting.type
      };
    });

    res.json({ settings: settingsObj });
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin routes (require authentication)
router.use(authenticateToken);
router.use(requireAdmin);

// Create program
router.post('/programs', [
  body('title_en').notEmpty().withMessage('English title is required'),
  body('description_en').notEmpty().withMessage('English description is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title_en,
      title_sh,
      description_en,
      description_sh,
      image,
      order_index = 0
    } = req.body;

    const result = await dbRun(
      `INSERT INTO programs (title_en, title_sh, description_en, description_sh, image, order_index)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [title_en, title_sh, description_en, description_sh, image, order_index]
    );

    const program = await dbGet('SELECT * FROM programs WHERE id = ?', [result.id]);

    res.status(201).json({
      message: 'Program created successfully',
      program
    });
  } catch (error) {
    console.error('Error creating program:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update program
router.put('/programs/:id', [
  body('title_en').notEmpty().withMessage('English title is required'),
  body('description_en').notEmpty().withMessage('English description is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title_en,
      title_sh,
      description_en,
      description_sh,
      image,
      status,
      order_index
    } = req.body;

    const result = await dbRun(
      `UPDATE programs 
       SET title_en = ?, title_sh = ?, description_en = ?, description_sh = ?, 
           image = ?, status = ?, order_index = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [title_en, title_sh, description_en, description_sh, image, status, order_index, req.params.id]
    );

    if (result.changes === 0) {
      return res.status(404).json({ message: 'Program not found' });
    }

    const program = await dbGet('SELECT * FROM programs WHERE id = ?', [req.params.id]);

    res.json({
      message: 'Program updated successfully',
      program
    });
  } catch (error) {
    console.error('Error updating program:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete program
router.delete('/programs/:id', async (req, res) => {
  try {
    const result = await dbRun('DELETE FROM programs WHERE id = ?', [req.params.id]);

    if (result.changes === 0) {
      return res.status(404).json({ message: 'Program not found' });
    }

    res.json({ message: 'Program deleted successfully' });
  } catch (error) {
    console.error('Error deleting program:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all programs (admin - includes inactive)
router.get('/admin/programs', async (req, res) => {
  try {
    const programs = await dbAll(
      'SELECT * FROM programs ORDER BY order_index ASC, created_at DESC'
    );
    res.json({ programs });
  } catch (error) {
    console.error('Error fetching programs:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update site settings
router.put('/settings', async (req, res) => {
  try {
    const { settings } = req.body;

    if (!settings || typeof settings !== 'object') {
      return res.status(400).json({ message: 'Invalid settings format' });
    }

    const updatePromises = Object.entries(settings).map(async ([key, value]) => {
      if (typeof value === 'object' && value.en !== undefined) {
        return dbRun(
          'UPDATE site_settings SET value_en = ?, value_sh = ?, updated_at = CURRENT_TIMESTAMP WHERE key = ?',
          [value.en, value.sh, key]
        );
      } else {
        return dbRun(
          'UPDATE site_settings SET value_en = ?, updated_at = CURRENT_TIMESTAMP WHERE key = ?',
          [value, key]
        );
      }
    });

    await Promise.all(updatePromises);

    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get contact messages
router.get('/contact-messages', async (req, res) => {
  try {
    const messages = await dbAll(
      'SELECT * FROM contact_messages ORDER BY created_at DESC'
    );
    res.json({ messages });
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update contact message status
router.put('/contact-messages/:id', [
  body('status').isIn(['unread', 'read', 'replied', 'archived']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status } = req.body;

    const result = await dbRun(
      'UPDATE contact_messages SET status = ? WHERE id = ?',
      [status, req.params.id]
    );

    if (result.changes === 0) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.json({ message: 'Message status updated successfully' });
  } catch (error) {
    console.error('Error updating message status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

