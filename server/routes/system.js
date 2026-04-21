/**
 * Admin-facing operational API.
 *
 * All routes require a valid admin token. Mutations write to the audit trail.
 *
 * Conventions:
 *   - List endpoints accept ?page=&pageSize=&q=&<filters> and respond with { data, pagination }.
 *   - Mutations return the updated row and record a before/after snapshot to audit_logs.
 *   - CSV export endpoints stream text/csv with a filename timestamp.
 */

const express = require('express');
const { body, validationResult, param, query } = require('express-validator');
const knex = require('../database/knex');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { writeAudit } = require('../middleware/audit');

const router = express.Router();

router.use(authenticateToken);
router.use(requireAdmin);

/* --------------------------------- helpers -------------------------------- */

const MAX_PAGE_SIZE = 200;

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

function parseVulnerabilityTags(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.map((v) => String(v).trim()).filter(Boolean);
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed.map((v) => String(v).trim()).filter(Boolean);
    } catch (_e) {
      // fall through to csv parsing
    }
    return value
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean);
  }
  return [];
}

function beneficiaryOut(row) {
  if (!row) return row;
  return { ...row, vulnerability_tags: parseVulnerabilityTags(row.vulnerability_tags) };
}

function escapeCsv(value) {
  if (value === null || value === undefined) return '';
  const str = typeof value === 'string' ? value : JSON.stringify(value);
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function rowsToCsv(rows, columns) {
  const header = columns.map((c) => escapeCsv(c.label)).join(',');
  const body = rows
    .map((row) =>
      columns
        .map((c) => escapeCsv(typeof c.value === 'function' ? c.value(row) : row[c.value]))
        .join(',')
    )
    .join('\n');
  return `${header}\n${body}\n`;
}

function sendCsv(res, filename, csv) {
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="${filename}-${new Date().toISOString().slice(0, 10)}.csv"`
  );
  res.send(csv);
}

/* -------------------------------- overview -------------------------------- */

router.get('/overview', async (_req, res) => {
  try {
    const [projects, beneficiaries, soup, activity] = await Promise.all([
      knex('system_projects').count({ count: '*' }).first(),
      knex('system_beneficiaries').count({ count: '*' }).first(),
      knex('system_soup_kitchen_logs').count({ count: '*' }).first(),
      knex('system_activity_logs').count({ count: '*' }).first(),
    ]);

    const byStatus = await knex('system_projects')
      .select('status')
      .count({ count: '*' })
      .groupBy('status');

    const byGender = await knex('system_beneficiaries')
      .select('gender')
      .count({ count: '*' })
      .groupBy('gender');

    const byDisability = await knex('system_beneficiaries')
      .select('disability_inclusion')
      .count({ count: '*' })
      .groupBy('disability_inclusion');

    const recentProjects = await knex('system_projects')
      .select('id', 'name', 'status', 'thematic_area', 'district', 'updated_at')
      .orderBy('updated_at', 'desc')
      .limit(5);

    res.json({
      totals: {
        projects: projects?.count || 0,
        beneficiaries: beneficiaries?.count || 0,
        soup_kitchen_logs: soup?.count || 0,
        activity_logs: activity?.count || 0,
      },
      breakdowns: {
        projects_by_status: byStatus,
        beneficiaries_by_gender: byGender,
        beneficiaries_by_disability: byDisability,
      },
      recent_projects: recentProjects,
    });
  } catch (error) {
    console.error('Error fetching system overview:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/* -------------------------------- projects -------------------------------- */

const PROJECT_FIELDS = [
  'code',
  'name',
  'thematic_area',
  'donor',
  'district',
  'ward',
  'start_date',
  'end_date',
  'status',
  'notes',
];

function projectFilters(qb, req) {
  const { q, status, thematic_area, district } = req.query;
  if (status) qb.where('status', status);
  if (thematic_area) qb.where('thematic_area', thematic_area);
  if (district) qb.where('district', district);
  if (q) {
    const like = `%${String(q).trim()}%`;
    qb.andWhere((b) =>
      b
        .where('name', 'like', like)
        .orWhere('code', 'like', like)
        .orWhere('donor', 'like', like)
        .orWhere('district', 'like', like)
        .orWhere('ward', 'like', like)
        .orWhere('notes', 'like', like)
    );
  }
}

router.get('/projects', async (req, res) => {
  try {
    const { page, pageSize, offset } = parsePagination(req);
    const base = knex('system_projects');
    projectFilters(base, req);

    const [{ count }] = await base.clone().count({ count: '*' });
    const rows = await base
      .clone()
      .orderBy('created_at', 'desc')
      .limit(pageSize)
      .offset(offset);

    res.json({
      data: rows,
      pagination: { page, pageSize, total: Number(count) || 0 },
    });
  } catch (error) {
    console.error('Error fetching system projects:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/projects/filter-options', async (_req, res) => {
  try {
    const [statuses, thematicAreas, districts] = await Promise.all([
      knex('system_projects').distinct('status').whereNotNull('status').pluck('status'),
      knex('system_projects').distinct('thematic_area').whereNotNull('thematic_area').pluck('thematic_area'),
      knex('system_projects').distinct('district').whereNotNull('district').pluck('district'),
    ]);
    res.json({ statuses, thematicAreas, districts: districts.filter(Boolean) });
  } catch (error) {
    console.error('Error fetching project filter options:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/projects/export', async (req, res) => {
  try {
    const base = knex('system_projects');
    projectFilters(base, req);
    const rows = await base.orderBy('created_at', 'desc');

    const csv = rowsToCsv(rows, [
      { label: 'ID', value: 'id' },
      { label: 'Code', value: 'code' },
      { label: 'Name', value: 'name' },
      { label: 'Thematic Area', value: 'thematic_area' },
      { label: 'Donor', value: 'donor' },
      { label: 'District', value: 'district' },
      { label: 'Ward', value: 'ward' },
      { label: 'Status', value: 'status' },
      { label: 'Start Date', value: 'start_date' },
      { label: 'End Date', value: 'end_date' },
      { label: 'Notes', value: 'notes' },
      { label: 'Created At', value: 'created_at' },
    ]);

    await writeAudit(req, {
      action: 'export',
      entity: 'projects',
      metadata: { filters: req.query, count: rows.length },
    });

    sendCsv(res, 'caritas-projects', csv);
  } catch (error) {
    console.error('Error exporting projects:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get(
  '/projects/:id',
  [param('id').isInt().toInt()],
  async (req, res) => {
    if (sendValidation(req, res)) return;
    try {
      const project = await knex('system_projects').where({ id: req.params.id }).first();
      if (!project) return res.status(404).json({ message: 'Project not found' });

      const [beneficiaryCount, activityCount] = await Promise.all([
        knex('system_beneficiaries').where({ project_id: project.id }).count({ count: '*' }).first(),
        knex('system_activity_logs').where({ project_id: project.id }).count({ count: '*' }).first(),
      ]);

      res.json({
        project,
        stats: {
          beneficiaries: Number(beneficiaryCount?.count) || 0,
          activity_logs: Number(activityCount?.count) || 0,
        },
      });
    } catch (error) {
      console.error('Error fetching project:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

router.post(
  '/projects',
  [
    body('name').notEmpty().withMessage('Project name is required'),
    body('thematic_area').notEmpty().withMessage('Thematic area is required'),
    body('status').optional().isIn(['planning', 'active', 'completed', 'on_hold', 'cancelled']),
  ],
  async (req, res) => {
    if (sendValidation(req, res)) return;
    try {
      const payload = {};
      for (const field of PROJECT_FIELDS) {
        if (req.body[field] !== undefined) payload[field] = req.body[field] || null;
      }
      payload.status = payload.status || 'planning';
      payload.name = req.body.name;
      payload.thematic_area = req.body.thematic_area;
      payload.created_by = req.user.id;
      payload.updated_by = req.user.id;

      const [id] = await knex('system_projects').insert(payload);
      const project = await knex('system_projects').where({ id }).first();

      await writeAudit(req, {
        action: 'create',
        entity: 'projects',
        entityId: id,
        after: project,
      });

      res.status(201).json({ message: 'Project created', project });
    } catch (error) {
      console.error('Error creating project:', error);
      if (error && /UNIQUE/i.test(error.message)) {
        return res.status(409).json({ message: 'Project code already exists' });
      }
      res.status(500).json({ message: 'Server error' });
    }
  }
);

router.patch(
  '/projects/:id',
  [
    param('id').isInt().toInt(),
    body('status').optional().isIn(['planning', 'active', 'completed', 'on_hold', 'cancelled']),
  ],
  async (req, res) => {
    if (sendValidation(req, res)) return;
    try {
      const before = await knex('system_projects').where({ id: req.params.id }).first();
      if (!before) return res.status(404).json({ message: 'Project not found' });

      const payload = {};
      for (const field of PROJECT_FIELDS) {
        if (req.body[field] !== undefined) payload[field] = req.body[field] === '' ? null : req.body[field];
      }
      payload.updated_by = req.user.id;
      payload.updated_at = knex.fn.now();

      await knex('system_projects').where({ id: req.params.id }).update(payload);
      const after = await knex('system_projects').where({ id: req.params.id }).first();

      await writeAudit(req, {
        action: 'update',
        entity: 'projects',
        entityId: req.params.id,
        before,
        after,
      });

      res.json({ message: 'Project updated', project: after });
    } catch (error) {
      console.error('Error updating project:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

router.delete(
  '/projects/:id',
  [param('id').isInt().toInt()],
  async (req, res) => {
    if (sendValidation(req, res)) return;
    try {
      const before = await knex('system_projects').where({ id: req.params.id }).first();
      if (!before) return res.status(404).json({ message: 'Project not found' });

      await knex('system_projects').where({ id: req.params.id }).delete();

      await writeAudit(req, {
        action: 'delete',
        entity: 'projects',
        entityId: req.params.id,
        before,
      });

      res.json({ message: 'Project deleted' });
    } catch (error) {
      console.error('Error deleting project:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

/* ------------------------------ beneficiaries ----------------------------- */

const BENEFICIARY_FIELDS = [
  'project_id',
  'beneficiary_type',
  'full_name',
  'household_name',
  'phone',
  'district',
  'ward',
  'village',
  'gender',
  'age_group',
  'date_of_birth',
  'household_size',
  'consent_collected',
  'disability_inclusion',
  'registered_on',
  'notes',
];

function beneficiaryFilters(qb, req) {
  const { q, project_id, district, gender, disability_inclusion } = req.query;
  if (project_id) qb.where('b.project_id', project_id);
  if (district) qb.where('b.district', district);
  if (gender) qb.where('b.gender', gender);
  if (disability_inclusion) qb.where('b.disability_inclusion', disability_inclusion);
  if (q) {
    const like = `%${String(q).trim()}%`;
    qb.andWhere((w) =>
      w
        .where('b.full_name', 'like', like)
        .orWhere('b.household_name', 'like', like)
        .orWhere('b.phone', 'like', like)
        .orWhere('b.district', 'like', like)
        .orWhere('b.ward', 'like', like)
        .orWhere('b.village', 'like', like)
    );
  }
}

function beneficiaryListQuery() {
  return knex('system_beneficiaries as b').leftJoin(
    'system_projects as p',
    'p.id',
    'b.project_id'
  );
}

router.get('/beneficiaries', async (req, res) => {
  try {
    const { page, pageSize, offset } = parsePagination(req);
    const base = beneficiaryListQuery();
    beneficiaryFilters(base, req);

    const countBase = beneficiaryListQuery();
    beneficiaryFilters(countBase, req);
    const [{ count }] = await countBase.count({ count: '*' });

    const rows = await base
      .select('b.*', 'p.name as project_name')
      .orderBy('b.created_at', 'desc')
      .limit(pageSize)
      .offset(offset);

    res.json({
      data: rows.map(beneficiaryOut),
      pagination: { page, pageSize, total: Number(count) || 0 },
    });
  } catch (error) {
    console.error('Error fetching beneficiaries:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/beneficiaries/export', async (req, res) => {
  try {
    const base = beneficiaryListQuery();
    beneficiaryFilters(base, req);
    const rows = await base
      .select('b.*', 'p.name as project_name')
      .orderBy('b.created_at', 'desc');

    const csv = rowsToCsv(rows, [
      { label: 'ID', value: 'id' },
      { label: 'Full Name', value: 'full_name' },
      { label: 'Household Name', value: 'household_name' },
      { label: 'Type', value: 'beneficiary_type' },
      { label: 'Project', value: 'project_name' },
      { label: 'Gender', value: 'gender' },
      { label: 'Age Group', value: 'age_group' },
      { label: 'Household Size', value: 'household_size' },
      { label: 'District', value: 'district' },
      { label: 'Ward', value: 'ward' },
      { label: 'Village', value: 'village' },
      { label: 'Phone', value: 'phone' },
      { label: 'Disability Inclusion', value: 'disability_inclusion' },
      { label: 'Consent Collected', value: 'consent_collected' },
      { label: 'Vulnerability Tags', value: (r) => parseVulnerabilityTags(r.vulnerability_tags).join('; ') },
      { label: 'Registered On', value: 'registered_on' },
      { label: 'Notes', value: 'notes' },
      { label: 'Created At', value: 'created_at' },
    ]);

    await writeAudit(req, {
      action: 'export',
      entity: 'beneficiaries',
      metadata: { filters: req.query, count: rows.length },
    });

    sendCsv(res, 'caritas-beneficiaries', csv);
  } catch (error) {
    console.error('Error exporting beneficiaries:', error);
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
    body('gender').optional().isIn(['female', 'male', 'other', 'unspecified']),
    body('age_group')
      .optional()
      .isIn(['under_5', '5_12', '13_17', '18_35', '36_59', '60_plus', 'unspecified']),
    body('household_size').optional().isInt({ min: 0, max: 50 }),
    body('consent_collected').optional().isBoolean().toBoolean(),
  ],
  async (req, res) => {
    if (sendValidation(req, res)) return;
    try {
      const payload = {};
      for (const field of BENEFICIARY_FIELDS) {
        if (req.body[field] !== undefined) payload[field] = req.body[field];
      }

      payload.project_id = payload.project_id ? Number(payload.project_id) : null;
      payload.beneficiary_type = payload.beneficiary_type || 'individual';
      payload.gender = payload.gender || 'unspecified';
      payload.age_group = payload.age_group || 'unspecified';
      payload.disability_inclusion = payload.disability_inclusion || 'not_specified';
      payload.consent_collected = payload.consent_collected ? 1 : 0;
      payload.registered_on = payload.registered_on || new Date().toISOString().slice(0, 10);
      payload.vulnerability_tags = req.body.vulnerability_tags
        ? JSON.stringify(parseVulnerabilityTags(req.body.vulnerability_tags))
        : null;
      payload.created_by = req.user.id;
      payload.updated_by = req.user.id;

      const [id] = await knex('system_beneficiaries').insert(payload);
      const beneficiary = await knex('system_beneficiaries').where({ id }).first();

      await writeAudit(req, {
        action: 'create',
        entity: 'beneficiaries',
        entityId: id,
        after: beneficiary,
      });

      res.status(201).json({ message: 'Beneficiary created', beneficiary: beneficiaryOut(beneficiary) });
    } catch (error) {
      console.error('Error creating beneficiary:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

router.patch(
  '/beneficiaries/:id',
  [
    param('id').isInt().toInt(),
    body('beneficiary_type').optional().isIn(['individual', 'household']),
    body('gender').optional().isIn(['female', 'male', 'other', 'unspecified']),
    body('age_group')
      .optional()
      .isIn(['under_5', '5_12', '13_17', '18_35', '36_59', '60_plus', 'unspecified']),
    body('household_size').optional().isInt({ min: 0, max: 50 }),
    body('consent_collected').optional().isBoolean().toBoolean(),
  ],
  async (req, res) => {
    if (sendValidation(req, res)) return;
    try {
      const before = await knex('system_beneficiaries').where({ id: req.params.id }).first();
      if (!before) return res.status(404).json({ message: 'Beneficiary not found' });

      const payload = {};
      for (const field of BENEFICIARY_FIELDS) {
        if (req.body[field] !== undefined) {
          payload[field] = req.body[field] === '' ? null : req.body[field];
        }
      }
      if (payload.project_id !== undefined) {
        payload.project_id = payload.project_id ? Number(payload.project_id) : null;
      }
      if (payload.consent_collected !== undefined) {
        payload.consent_collected = payload.consent_collected ? 1 : 0;
      }
      if (req.body.vulnerability_tags !== undefined) {
        payload.vulnerability_tags = req.body.vulnerability_tags
          ? JSON.stringify(parseVulnerabilityTags(req.body.vulnerability_tags))
          : null;
      }
      payload.updated_by = req.user.id;
      payload.updated_at = knex.fn.now();

      await knex('system_beneficiaries').where({ id: req.params.id }).update(payload);
      const after = await knex('system_beneficiaries').where({ id: req.params.id }).first();

      await writeAudit(req, {
        action: 'update',
        entity: 'beneficiaries',
        entityId: req.params.id,
        before,
        after,
      });

      res.json({ message: 'Beneficiary updated', beneficiary: beneficiaryOut(after) });
    } catch (error) {
      console.error('Error updating beneficiary:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

router.delete(
  '/beneficiaries/:id',
  [param('id').isInt().toInt()],
  async (req, res) => {
    if (sendValidation(req, res)) return;
    try {
      const before = await knex('system_beneficiaries').where({ id: req.params.id }).first();
      if (!before) return res.status(404).json({ message: 'Beneficiary not found' });

      await knex('system_beneficiaries').where({ id: req.params.id }).delete();

      await writeAudit(req, {
        action: 'delete',
        entity: 'beneficiaries',
        entityId: req.params.id,
        before,
      });

      res.json({ message: 'Beneficiary deleted' });
    } catch (error) {
      console.error('Error deleting beneficiary:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

/* ------------------------------ activity logs ----------------------------- */

const ACTIVITY_FIELDS = ['project_id', 'activity_date', 'activity_title', 'output_count', 'notes'];

router.get(
  '/activity-logs',
  [query('project_id').optional().isInt().toInt()],
  async (req, res) => {
    try {
      const { page, pageSize, offset } = parsePagination(req);
      const base = knex('system_activity_logs as a').leftJoin(
        'system_projects as p',
        'p.id',
        'a.project_id'
      );
      if (req.query.project_id) base.where('a.project_id', req.query.project_id);

      const countBase = knex('system_activity_logs as a');
      if (req.query.project_id) countBase.where('a.project_id', req.query.project_id);
      const [{ count }] = await countBase.count({ count: '*' });

      const rows = await base
        .select('a.*', 'p.name as project_name')
        .orderBy('a.activity_date', 'desc')
        .limit(pageSize)
        .offset(offset);

      res.json({
        data: rows,
        pagination: { page, pageSize, total: Number(count) || 0 },
      });
    } catch (error) {
      console.error('Error fetching activity logs:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

router.get('/activity-logs/export', async (req, res) => {
  try {
    const base = knex('system_activity_logs as a').leftJoin(
      'system_projects as p',
      'p.id',
      'a.project_id'
    );
    if (req.query.project_id) base.where('a.project_id', req.query.project_id);
    const rows = await base.select('a.*', 'p.name as project_name').orderBy('a.activity_date', 'desc');

    const csv = rowsToCsv(rows, [
      { label: 'ID', value: 'id' },
      { label: 'Date', value: 'activity_date' },
      { label: 'Project', value: 'project_name' },
      { label: 'Activity', value: 'activity_title' },
      { label: 'Output Count', value: 'output_count' },
      { label: 'Notes', value: 'notes' },
      { label: 'Created At', value: 'created_at' },
    ]);

    await writeAudit(req, {
      action: 'export',
      entity: 'activity_logs',
      metadata: { filters: req.query, count: rows.length },
    });

    sendCsv(res, 'caritas-activity-logs', csv);
  } catch (error) {
    console.error('Error exporting activity logs:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post(
  '/activity-logs',
  [
    body('project_id').isInt().toInt(),
    body('activity_date').notEmpty().withMessage('Activity date is required'),
    body('activity_title').notEmpty().withMessage('Activity title is required'),
    body('output_count').optional().isInt({ min: 0 }).toInt(),
  ],
  async (req, res) => {
    if (sendValidation(req, res)) return;
    try {
      const payload = {};
      for (const field of ACTIVITY_FIELDS) {
        if (req.body[field] !== undefined) payload[field] = req.body[field];
      }
      payload.output_count = payload.output_count || 0;
      payload.created_by = req.user.id;

      const [id] = await knex('system_activity_logs').insert(payload);
      const row = await knex('system_activity_logs').where({ id }).first();

      await writeAudit(req, {
        action: 'create',
        entity: 'activity_logs',
        entityId: id,
        after: row,
      });

      res.status(201).json({ message: 'Activity log created', activity_log: row });
    } catch (error) {
      console.error('Error creating activity log:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

router.patch(
  '/activity-logs/:id',
  [param('id').isInt().toInt(), body('output_count').optional().isInt({ min: 0 }).toInt()],
  async (req, res) => {
    if (sendValidation(req, res)) return;
    try {
      const before = await knex('system_activity_logs').where({ id: req.params.id }).first();
      if (!before) return res.status(404).json({ message: 'Activity log not found' });

      const payload = {};
      for (const field of ACTIVITY_FIELDS) {
        if (req.body[field] !== undefined) payload[field] = req.body[field] === '' ? null : req.body[field];
      }

      await knex('system_activity_logs').where({ id: req.params.id }).update(payload);
      const after = await knex('system_activity_logs').where({ id: req.params.id }).first();

      await writeAudit(req, {
        action: 'update',
        entity: 'activity_logs',
        entityId: req.params.id,
        before,
        after,
      });

      res.json({ message: 'Activity log updated', activity_log: after });
    } catch (error) {
      console.error('Error updating activity log:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

router.delete(
  '/activity-logs/:id',
  [param('id').isInt().toInt()],
  async (req, res) => {
    if (sendValidation(req, res)) return;
    try {
      const before = await knex('system_activity_logs').where({ id: req.params.id }).first();
      if (!before) return res.status(404).json({ message: 'Activity log not found' });

      await knex('system_activity_logs').where({ id: req.params.id }).delete();

      await writeAudit(req, {
        action: 'delete',
        entity: 'activity_logs',
        entityId: req.params.id,
        before,
      });

      res.json({ message: 'Activity log deleted' });
    } catch (error) {
      console.error('Error deleting activity log:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

/* ---------------------------- soup kitchen logs --------------------------- */

const SOUP_FIELDS = [
  'service_date',
  'location',
  'meals_served',
  'beneficiary_count',
  'volunteer_count',
  'stock_notes',
  'notes',
];

router.get('/soup-kitchen', async (req, res) => {
  try {
    const { page, pageSize, offset } = parsePagination(req);
    const { from, to, location } = req.query;

    const base = knex('system_soup_kitchen_logs');
    if (from) base.where('service_date', '>=', from);
    if (to) base.where('service_date', '<=', to);
    if (location) base.where('location', 'like', `%${location}%`);

    const countBase = base.clone();
    const [{ count }] = await countBase.count({ count: '*' });

    const rows = await base
      .clone()
      .orderBy('service_date', 'desc')
      .limit(pageSize)
      .offset(offset);

    const [totals] = await base
      .clone()
      .sum({ meals: 'meals_served' })
      .sum({ beneficiaries: 'beneficiary_count' })
      .sum({ volunteers: 'volunteer_count' });

    res.json({
      data: rows,
      pagination: { page, pageSize, total: Number(count) || 0 },
      totals: {
        meals: Number(totals?.meals) || 0,
        beneficiaries: Number(totals?.beneficiaries) || 0,
        volunteers: Number(totals?.volunteers) || 0,
      },
    });
  } catch (error) {
    console.error('Error fetching soup kitchen logs:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/soup-kitchen/export', async (req, res) => {
  try {
    const base = knex('system_soup_kitchen_logs');
    if (req.query.from) base.where('service_date', '>=', req.query.from);
    if (req.query.to) base.where('service_date', '<=', req.query.to);
    const rows = await base.orderBy('service_date', 'desc');

    const csv = rowsToCsv(rows, [
      { label: 'ID', value: 'id' },
      { label: 'Service Date', value: 'service_date' },
      { label: 'Location', value: 'location' },
      { label: 'Meals Served', value: 'meals_served' },
      { label: 'Beneficiary Count', value: 'beneficiary_count' },
      { label: 'Volunteer Count', value: 'volunteer_count' },
      { label: 'Stock Notes', value: 'stock_notes' },
      { label: 'Notes', value: 'notes' },
      { label: 'Created At', value: 'created_at' },
    ]);

    await writeAudit(req, {
      action: 'export',
      entity: 'soup_kitchen_logs',
      metadata: { filters: req.query, count: rows.length },
    });

    sendCsv(res, 'caritas-soup-kitchen', csv);
  } catch (error) {
    console.error('Error exporting soup kitchen logs:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post(
  '/soup-kitchen',
  [
    body('service_date').notEmpty().withMessage('Service date is required'),
    body('meals_served').optional().isInt({ min: 0 }).toInt(),
    body('beneficiary_count').optional().isInt({ min: 0 }).toInt(),
    body('volunteer_count').optional().isInt({ min: 0 }).toInt(),
  ],
  async (req, res) => {
    if (sendValidation(req, res)) return;
    try {
      const payload = {};
      for (const field of SOUP_FIELDS) {
        if (req.body[field] !== undefined) payload[field] = req.body[field];
      }
      payload.meals_served = payload.meals_served || 0;
      payload.beneficiary_count = payload.beneficiary_count || 0;
      payload.volunteer_count = payload.volunteer_count || 0;
      payload.created_by = req.user.id;

      const [id] = await knex('system_soup_kitchen_logs').insert(payload);
      const row = await knex('system_soup_kitchen_logs').where({ id }).first();

      await writeAudit(req, {
        action: 'create',
        entity: 'soup_kitchen_logs',
        entityId: id,
        after: row,
      });

      res.status(201).json({ message: 'Soup kitchen log created', log: row });
    } catch (error) {
      console.error('Error creating soup kitchen log:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

router.patch(
  '/soup-kitchen/:id',
  [
    param('id').isInt().toInt(),
    body('meals_served').optional().isInt({ min: 0 }).toInt(),
    body('beneficiary_count').optional().isInt({ min: 0 }).toInt(),
    body('volunteer_count').optional().isInt({ min: 0 }).toInt(),
  ],
  async (req, res) => {
    if (sendValidation(req, res)) return;
    try {
      const before = await knex('system_soup_kitchen_logs').where({ id: req.params.id }).first();
      if (!before) return res.status(404).json({ message: 'Soup kitchen log not found' });

      const payload = {};
      for (const field of SOUP_FIELDS) {
        if (req.body[field] !== undefined) payload[field] = req.body[field] === '' ? null : req.body[field];
      }

      await knex('system_soup_kitchen_logs').where({ id: req.params.id }).update(payload);
      const after = await knex('system_soup_kitchen_logs').where({ id: req.params.id }).first();

      await writeAudit(req, {
        action: 'update',
        entity: 'soup_kitchen_logs',
        entityId: req.params.id,
        before,
        after,
      });

      res.json({ message: 'Soup kitchen log updated', log: after });
    } catch (error) {
      console.error('Error updating soup kitchen log:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

router.delete(
  '/soup-kitchen/:id',
  [param('id').isInt().toInt()],
  async (req, res) => {
    if (sendValidation(req, res)) return;
    try {
      const before = await knex('system_soup_kitchen_logs').where({ id: req.params.id }).first();
      if (!before) return res.status(404).json({ message: 'Soup kitchen log not found' });

      await knex('system_soup_kitchen_logs').where({ id: req.params.id }).delete();

      await writeAudit(req, {
        action: 'delete',
        entity: 'soup_kitchen_logs',
        entityId: req.params.id,
        before,
      });

      res.json({ message: 'Soup kitchen log deleted' });
    } catch (error) {
      console.error('Error deleting soup kitchen log:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

/* -------------------------------- audit log ------------------------------- */

router.get(
  '/audit-logs',
  [
    query('entity').optional().isString(),
    query('action').optional().isString(),
    query('actor_id').optional().isInt().toInt(),
  ],
  async (req, res) => {
    try {
      const { page, pageSize, offset } = parsePagination(req);
      const base = knex('audit_logs');
      if (req.query.entity) base.where('entity', req.query.entity);
      if (req.query.action) base.where('action', req.query.action);
      if (req.query.actor_id) base.where('actor_id', req.query.actor_id);

      const [{ count }] = await base.clone().count({ count: '*' });
      const rows = await base
        .clone()
        .orderBy('created_at', 'desc')
        .limit(pageSize)
        .offset(offset);

      res.json({
        data: rows.map((r) => ({
          ...r,
          before: r.before_json ? JSON.parse(r.before_json) : null,
          after: r.after_json ? JSON.parse(r.after_json) : null,
          metadata: r.metadata_json ? JSON.parse(r.metadata_json) : null,
        })),
        pagination: { page, pageSize, total: Number(count) || 0 },
      });
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

module.exports = router;
