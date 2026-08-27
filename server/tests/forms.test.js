/**
 * Public forms — contact, volunteer, donation pledges.
 *
 * These lock down the contracts a real person (or a bot) hits. The interesting
 * cases are the ones that look successful but must not persist, and the pledge
 * that must stay pending even if the client sends a completed status.
 */

const {
  knex,
  request,
  buildApp,
  setupDatabase,
  teardownDatabase,
  resetTables,
  loginAsAdmin,
} = require('./helpers/harness');

let app;

beforeAll(async () => {
  await setupDatabase();
  app = buildApp();
});

afterAll(async () => {
  await teardownDatabase();
});

afterEach(async () => {
  await resetTables('contact_messages', 'volunteers', 'donations');
});

describe('POST /api/contact', () => {
  const valid = {
    name: 'Chipo Moyo',
    email: 'chipo@example.com',
    subject: 'Soup kitchen',
    message: 'I would like to know the serving times this week.',
  };

  it('persists a valid submission', async () => {
    const res = await request(app).post('/api/contact').send(valid);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);

    const rows = await knex('contact_messages').select('name', 'email', 'subject');
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({
      name: valid.name,
      email: valid.email,
      subject: valid.subject,
    });
  });

  it('rejects a short message', async () => {
    const res = await request(app)
      .post('/api/contact')
      .send({ ...valid, message: 'hi' });

    expect(res.status).toBe(400);
    expect(await knex('contact_messages').select('id')).toHaveLength(0);
  });

  it('returns success for a honeypot fill but saves nothing', async () => {
    const res = await request(app)
      .post('/api/contact')
      .send({ ...valid, company_website: 'http://spam.example' });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(await knex('contact_messages').select('id')).toHaveLength(0);
  });
});

describe('POST /api/volunteers', () => {
  const valid = {
    full_name: 'Tariro Ncube',
    email: 'tariro@example.com',
    phone: '+263 77 123 4567',
    message: 'I can help at the soup kitchen on Saturdays.',
  };

  it('persists a valid application', async () => {
    const res = await request(app).post('/api/volunteers').send(valid);

    expect(res.status).toBe(201);
    const rows = await knex('volunteers').select('full_name', 'email', 'status');
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({
      full_name: valid.full_name,
      email: valid.email,
      status: 'pending',
    });
  });

  it('rejects a missing name', async () => {
    const res = await request(app)
      .post('/api/volunteers')
      .send({ email: 'x@example.com' });

    expect(res.status).toBe(400);
    expect(await knex('volunteers').select('id')).toHaveLength(0);
  });

  it('rejects a second application with the same email', async () => {
    await request(app).post('/api/volunteers').send(valid);
    const res = await request(app).post('/api/volunteers').send(valid);

    expect(res.status).toBe(409);
    expect(await knex('volunteers').select('id')).toHaveLength(1);
  });

  it('returns success for a honeypot fill but saves nothing', async () => {
    const res = await request(app)
      .post('/api/volunteers')
      .send({ ...valid, company_website: 'x' });

    expect(res.status).toBe(201);
    expect(await knex('volunteers').select('id')).toHaveLength(0);
  });
});

describe('POST /api/donations', () => {
  const valid = {
    donor_name: 'Farai Dube',
    donor_email: 'farai@example.com',
    amount: 50,
    currency: 'USD',
  };

  it('records a public submission as a pending pledge with no payment id', async () => {
    const res = await request(app).post('/api/donations').send(valid);

    expect(res.status).toBe(201);

    const row = await knex('donations').first();
    expect(row.donor_name).toBe(valid.donor_name);
    expect(row.payment_status).toBe('pending');
    expect(row.payment_id).toBeFalsy();
    expect(Number(row.amount)).toBe(50);
  });

  it('ignores a client-supplied completed status', async () => {
    // Honesty guarantee: the public form must not be able to mark money received.
    const res = await request(app)
      .post('/api/donations')
      .send({ ...valid, payment_status: 'completed', payment_id: 'fake-txn' });

    expect(res.status).toBe(201);
    const row = await knex('donations').first();
    expect(row.payment_status).toBe('pending');
    expect(row.payment_id).toBeFalsy();
  });

  it('rejects a zero amount', async () => {
    const res = await request(app)
      .post('/api/donations')
      .send({ ...valid, amount: 0 });

    expect(res.status).toBe(400);
    expect(await knex('donations').select('id')).toHaveLength(0);
  });

  it('returns success for a honeypot fill but saves nothing', async () => {
    const res = await request(app)
      .post('/api/donations')
      .send({ ...valid, company_website: 'bot' });

    expect(res.status).toBe(201);
    expect(await knex('donations').select('id')).toHaveLength(0);
  });

  it('lets an admin mark a pledge received', async () => {
    await request(app).post('/api/donations').send(valid);
    const token = await loginAsAdmin(app);
    const created = await knex('donations').first();

    const res = await request(app)
      .put(`/api/donations/admin/${created.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ payment_status: 'completed' });

    expect(res.status).toBe(200);
    const updated = await knex('donations').where({ id: created.id }).first();
    expect(updated.payment_status).toBe('completed');
  });
});
