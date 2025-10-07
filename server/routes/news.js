const express = require('express');
const { body, validationResult } = require('express-validator');
const { dbGet, dbAll, dbRun } = require('../database/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all published news articles (public)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, category } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE status = "published"';
    const params = [];

    if (category) {
      whereClause += ' AND category = ?';
      params.push(category);
    }

    const news = await dbAll(
      `SELECT id, title_en, title_sh, excerpt_en, excerpt_sh, featured_image, published_at, created_at
       FROM news ${whereClause} ORDER BY published_at DESC LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    const totalCount = await dbGet(
      `SELECT COUNT(*) as count FROM news ${whereClause}`,
      params
    );

    res.json({
      news,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount.count,
        pages: Math.ceil(totalCount.count / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single news article (public)
router.get('/:id', async (req, res) => {
  try {
    const article = await dbGet(
      'SELECT * FROM news WHERE id = ? AND status = "published"',
      [req.params.id]
    );

    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    res.json({ article });
  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get featured/latest articles (public)
router.get('/featured/latest', async (req, res) => {
  try {
    const { limit = 5 } = req.query;

    const articles = await dbAll(
      `SELECT id, title_en, title_sh, excerpt_en, excerpt_sh, featured_image, published_at
       FROM news 
       WHERE status = "published" 
       ORDER BY published_at DESC 
       LIMIT ?`,
      [parseInt(limit)]
    );

    res.json({ articles });
  } catch (error) {
    console.error('Error fetching latest articles:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin routes (require authentication)
router.use(authenticateToken);
router.use(requireAdmin);

// Get all articles (admin - includes drafts)
router.get('/admin/all', async (req, res) => {
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
      whereClause += ' AND (title_en LIKE ? OR title_sh LIKE ? OR content_en LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    const articles = await dbAll(
      `SELECT * FROM news ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    const totalCount = await dbGet(
      `SELECT COUNT(*) as count FROM news ${whereClause}`,
      params
    );

    res.json({
      articles,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount.count,
        pages: Math.ceil(totalCount.count / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create news article
router.post('/', [
  body('title_en').notEmpty().withMessage('English title is required'),
  body('content_en').notEmpty().withMessage('English content is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title_en,
      title_sh,
      content_en,
      content_sh,
      excerpt_en,
      excerpt_sh,
      featured_image,
      status = 'draft'
    } = req.body;

    const published_at = status === 'published' ? new Date().toISOString() : null;

    const result = await dbRun(
      `INSERT INTO news (title_en, title_sh, content_en, content_sh, excerpt_en, excerpt_sh, featured_image, status, author_id, published_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title_en, title_sh, content_en, content_sh, excerpt_en, excerpt_sh, featured_image, status, req.user.id, published_at]
    );

    const article = await dbGet('SELECT * FROM news WHERE id = ?', [result.id]);

    res.status(201).json({
      message: 'Article created successfully',
      article
    });
  } catch (error) {
    console.error('Error creating article:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update news article
router.put('/:id', [
  body('title_en').notEmpty().withMessage('English title is required'),
  body('content_en').notEmpty().withMessage('English content is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title_en,
      title_sh,
      content_en,
      content_sh,
      excerpt_en,
      excerpt_sh,
      featured_image,
      status
    } = req.body;

    // Get current article to check status change
    const currentArticle = await dbGet('SELECT status FROM news WHERE id = ?', [req.params.id]);
    if (!currentArticle) {
      return res.status(404).json({ message: 'Article not found' });
    }

    let published_at = currentArticle.published_at;
    
    // Set published_at if status changed from draft to published
    if (status === 'published' && currentArticle.status !== 'published') {
      published_at = new Date().toISOString();
    }

    const result = await dbRun(
      `UPDATE news 
       SET title_en = ?, title_sh = ?, content_en = ?, content_sh = ?, 
           excerpt_en = ?, excerpt_sh = ?, featured_image = ?, status = ?, 
           published_at = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [title_en, title_sh, content_en, content_sh, excerpt_en, excerpt_sh, featured_image, status, published_at, req.params.id]
    );

    if (result.changes === 0) {
      return res.status(404).json({ message: 'Article not found' });
    }

    const article = await dbGet('SELECT * FROM news WHERE id = ?', [req.params.id]);

    res.json({
      message: 'Article updated successfully',
      article
    });
  } catch (error) {
    console.error('Error updating article:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete news article
router.delete('/:id', async (req, res) => {
  try {
    const result = await dbRun('DELETE FROM news WHERE id = ?', [req.params.id]);

    if (result.changes === 0) {
      return res.status(404).json({ message: 'Article not found' });
    }

    res.json({ message: 'Article deleted successfully' });
  } catch (error) {
    console.error('Error deleting article:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single article (admin)
router.get('/admin/:id', async (req, res) => {
  try {
    const article = await dbGet(
      'SELECT * FROM news WHERE id = ?',
      [req.params.id]
    );

    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    res.json({ article });
  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get news statistics (admin)
router.get('/admin/stats', async (req, res) => {
  try {
    // Get total articles
    const totalStats = await dbGet(
      'SELECT COUNT(*) as total_articles FROM news'
    );

    // Get articles by status
    const statusStats = await dbAll(
      'SELECT status, COUNT(*) as count FROM news GROUP BY status'
    );

    // Get recent articles (last 30 days)
    const recentStats = await dbGet(
      `SELECT COUNT(*) as recent_articles 
       FROM news 
       WHERE created_at >= datetime('now', '-30 days')`
    );

    // Get articles by author
    const authorStats = await dbAll(
      `SELECT u.username, COUNT(*) as count
       FROM news n
       JOIN users u ON n.author_id = u.id
       GROUP BY n.author_id, u.username
       ORDER BY count DESC`
    );

    res.json({
      total: totalStats.total_articles || 0,
      recent: recentStats.recent_articles || 0,
      by_status: statusStats,
      by_author: authorStats
    });
  } catch (error) {
    console.error('Error fetching news stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

