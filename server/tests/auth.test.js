/**
 * Slice 1 — the authentication boundary.
 *
 * These are integration tests: they drive the real Express app against a real
 * database. That is deliberate. Every bug found in the recent audit — SQL that
 * only ran on SQLite, a route shadowed by a parameterised one, endpoints with
 * no validation — lived in the wiring between units, not inside them. Unit
 * tests of the handlers would have caught none of them.
 */

const jwt = require('jsonwebtoken');

const {
  knex,
  request,
  buildApp,
  setupDatabase,
  teardownDatabase,
  loginAsAdmin,
  SEEDED_ADMIN,
} = require('./helpers/harness');

let app;

beforeAll(async () => {
  await setupDatabase();
  app = buildApp();
});

afterAll(async () => {
  await teardownDatabase();
});

describe('POST /api/auth/login', () => {
  it('returns a token and the user for correct credentials', async () => {
    const res = await request(app).post('/api/auth/login').send(SEEDED_ADMIN);

    expect(res.status).toBe(200);
    expect(typeof res.body.token).toBe('string');
    expect(res.body.user).toMatchObject({
      username: SEEDED_ADMIN.username,
      role: 'admin',
    });
  });

  it('never returns the password hash', async () => {
    const res = await request(app).post('/api/auth/login').send(SEEDED_ADMIN);

    expect(res.body.user).not.toHaveProperty('password_hash');
    expect(JSON.stringify(res.body)).not.toContain('$2a$');
  });

  it('issues a token carrying the user id, username and role', async () => {
    const res = await request(app).post('/api/auth/login').send(SEEDED_ADMIN);
    const claims = jwt.verify(res.body.token, process.env.JWT_SECRET);

    expect(claims).toMatchObject({ username: SEEDED_ADMIN.username, role: 'admin' });
    expect(typeof claims.userId).toBe('number');
  });

  it('rejects a wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: SEEDED_ADMIN.username, password: 'not-the-password' });

    expect(res.status).toBe(401);
    expect(res.body.token).toBeUndefined();
  });

  it('rejects an unknown username', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'nobody', password: 'whatever-long-enough' });

    expect(res.status).toBe(401);
    expect(res.body.token).toBeUndefined();
  });

  it('does not reveal whether the username exists', async () => {
    // Different messages for "no such user" and "wrong password" let an
    // attacker enumerate valid accounts.
    const unknownUser = await request(app)
      .post('/api/auth/login')
      .send({ username: 'nobody', password: 'whatever-long-enough' });
    const wrongPassword = await request(app)
      .post('/api/auth/login')
      .send({ username: SEEDED_ADMIN.username, password: 'whatever-long-enough' });

    expect(unknownUser.status).toBe(wrongPassword.status);
    expect(unknownUser.body.message).toBe(wrongPassword.body.message);
  });

  it('rejects a missing username with a validation error', async () => {
    const res = await request(app).post('/api/auth/login').send({ password: 'longenough' });

    expect(res.status).toBe(400);
    expect(res.body.errors).toEqual(expect.any(Array));
  });
});

describe('GET /api/auth/verify', () => {
  it('accepts a valid token', async () => {
    const token = await loginAsAdmin(app);
    const res = await request(app)
      .get('/api/auth/verify')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.user).toMatchObject({ username: SEEDED_ADMIN.username });
  });

  it('rejects a request with no token', async () => {
    const res = await request(app).get('/api/auth/verify');
    expect(res.status).toBe(401);
  });

  it('rejects a malformed token', async () => {
    const res = await request(app)
      .get('/api/auth/verify')
      .set('Authorization', 'Bearer not-a-real-token');

    expect(res.status).toBe(403);
  });

  it('rejects a token signed with the wrong secret', async () => {
    const forged = jwt.sign({ userId: 1, username: 'admin', role: 'admin' }, 'wrong-secret');
    const res = await request(app)
      .get('/api/auth/verify')
      .set('Authorization', `Bearer ${forged}`);

    expect(res.status).toBe(403);
  });

  it('rejects an expired token', async () => {
    const expired = jwt.sign(
      { userId: 1, username: 'admin', role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '-1s' }
    );
    const res = await request(app)
      .get('/api/auth/verify')
      .set('Authorization', `Bearer ${expired}`);

    expect(res.status).toBe(403);
  });

  it('rejects a validly-signed token for a user that no longer exists', async () => {
    // The middleware re-reads the user from the database rather than trusting
    // the claims, so deleting an account must invalidate its tokens.
    const orphan = jwt.sign(
      { userId: 999999, username: 'ghost', role: 'admin' },
      process.env.JWT_SECRET
    );
    const res = await request(app)
      .get('/api/auth/verify')
      .set('Authorization', `Bearer ${orphan}`);

    expect(res.status).toBe(401);
  });
});

describe('protected routes', () => {
  it('refuses an admin endpoint without a token', async () => {
    const res = await request(app).get('/api/system/overview');
    expect(res.status).toBe(401);
  });

  it('allows an admin endpoint with a valid token', async () => {
    const token = await loginAsAdmin(app);
    const res = await request(app)
      .get('/api/system/overview')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
  });

  it('refuses a non-admin user on an admin-gated endpoint', async () => {
    await knex('users').insert({
      username: 'helper',
      email: 'helper@example.com',
      // bcrypt hash of "password"
      password_hash: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
      role: 'viewer',
    });

    const login = await request(app)
      .post('/api/auth/login')
      .send({ username: 'helper', password: 'password' });
    expect(login.status).toBe(200);

    const res = await request(app)
      .get('/api/system/overview')
      .set('Authorization', `Bearer ${login.body.token}`);

    expect(res.status).toBe(403);

    await knex('users').where({ username: 'helper' }).del();
  });
});

describe('POST /api/auth/register', () => {
  afterEach(async () => {
    await knex('users').whereNotIn('username', [SEEDED_ADMIN.username]).del();
  });

  it('requires authentication', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ username: 'newbie', email: 'n@example.com', password: 'longenough' });

    expect(res.status).toBe(401);
  });

  it('creates a user when called by an admin', async () => {
    const token = await loginAsAdmin(app);
    const res = await request(app)
      .post('/api/auth/register')
      .set('Authorization', `Bearer ${token}`)
      .send({ username: 'newbie', email: 'newbie@example.com', password: 'longenough' });

    expect(res.status).toBe(201);

    const created = await knex('users').where({ username: 'newbie' }).first();
    expect(created).toBeDefined();
    expect(created.password_hash).not.toBe('longenough');
  });

  it('rejects a role outside the whitelist', async () => {
    const token = await loginAsAdmin(app);
    const res = await request(app)
      .post('/api/auth/register')
      .set('Authorization', `Bearer ${token}`)
      .send({
        username: 'eve',
        email: 'eve@example.com',
        password: 'longenough',
        role: 'superuser',
      });

    expect(res.status).toBe(400);
    expect(await knex('users').where({ username: 'eve' }).first()).toBeUndefined();
  });

  it('rejects a duplicate username', async () => {
    const token = await loginAsAdmin(app);
    const res = await request(app)
      .post('/api/auth/register')
      .set('Authorization', `Bearer ${token}`)
      .send({
        username: SEEDED_ADMIN.username,
        email: 'different@example.com',
        password: 'longenough',
      });

    expect(res.status).toBe(400);
  });
});
