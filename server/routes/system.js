const express = require('express');
const { body, validationResult } = require('express-validator');
const { dbGet, dbAll, dbRun } = require('../database/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.use(authenticateToken);
router.use(requireAdmin);

router.get('/overview', async (_req, res) => {
  try {
    const projects = await dbGet('SELECT COUNT(*) AS count FROM system_projects');
    const beneficiaries = await dbGet('SELECT COUNT(*) AS count FROM system_beneficiaries');
    const soupKitchenLogs = await dbGet('SELECT COUNT(*) AS count FROM system_soup_kitchen_logs');

    res.json({
      totals: {
        projects: projects?.count || 0,
        beneficiaries: beneficiaries?.count || 0,
        soup_kitchen_logs: soupKitchenLogs?.count || 0,
      },
    });
  } catch (error) {
    console.error('Error fetching system overview:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/projects', async (_req, res) => {
  try {
    const projects = await dbAll(
      'SELECT * FROM system_projects ORDER BY created_at DESC'
    );
    res.json({ projects });
  } catch (error) {
    console.error('Error fetching system projects:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post(
  '/projects',
  [
    body('name').notEmpty().withMessage('Project name is required'),
    body('thematic_area').notEmpty().withMessage('Thematic area is required'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        code,
        name,
        thematic_area,
        donor,
        district,
        ward,
        start_date,
        end_date,
        status = 'planning',
        notes,
      } = req.body;

      const result = await dbRun(
        `INSERT INTO system_projects
          (code, name, thematic_area, donor, district, ward, start_date, end_date, status, notes, created_by, updated_by)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          code || null,
          name,
          thematic_area,
          donor || null,
          district || null,
          ward || null,
          start_date || null,
          end_date || null,
          status,
          notes || null,
          req.user.id,
          req.user.id,
        ]
      );

      const project = await dbGet('SELECT * FROM system_projects WHERE id = ?', [result.id]);
      res.status(201).json({ message: 'Project created successfully', project });
    } catch (error) {
      console.error('Error creating system project:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

router.get('/beneficiaries', async (req, res) => {
  try {
    const { project_id } = req.query;
    const where = project_id ? 'WHERE b.project_id = ?' : '';
    const params = project_id ? [project_id] : [];
    const beneficiaries = await dbAll(
      `SELECT b.*, p.name AS project_name
       FROM system_beneficiaries b
       LEFT JOIN system_projects p ON p.id = b.project_id
       ${where}
       ORDER BY b.created_at DESC`,
      params
    );
    res.json({ beneficiaries });
  } catch (error) {
    console.error('Error fetching beneficiaries:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post(
  '/beneficiaries',
  [
    body('full_name').notEmpty().withMessage('Beneficiary name is required'),
    body('beneficiary_type')
      .optional()
      .isIn(['individual', 'household'])
      .withMessage('beneficiary_type must be individual or household'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        project_id,
        beneficiary_type = 'individual',
        full_name,
        household_name,
        phone,
        district,
        ward,
        village,
        disability_inclusion = 'not_specified',
        vulnerability_tags,
        notes,
      } = req.body;

      const result = await dbRun(
        `INSERT INTO system_beneficiaries
          (project_id, beneficiary_type, full_name, household_name, phone, district, ward, village,
           disability_inclusion, vulnerability_tags, notes, created_by, updated_by)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          project_id || null,
          beneficiary_type,
          full_name,
          household_name || null,
          phone || null,
          district || null,
          ward || null,
          village || null,
          disability_inclusion,
          vulnerability_tags ? JSON.stringify(vulnerability_tags) : null,
          notes || null,
          req.user.id,
          req.user.id,
        ]
      );

      const beneficiary = await dbGet('SELECT * FROM system_beneficiaries WHERE id = ?', [result.id]);
      res.status(201).json({ message: 'Beneficiary created successfully', beneficiary });
    } catch (error) {
      console.error('Error creating beneficiary:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

module.exports = router;
