/**
 * Route order is the auth boundary. Public handlers are registered before
 * router.use(authenticateToken). A new staff route placed above that line
 * would answer without a token. This test calls every route the app
 * actually mounts and requires 401 unless the path is on the allowlist.
 */

const request = require('supertest');
const { createApp } = require('../app');

const PUBLIC_ROUTES = new Set([
  'GET /api/health',
  'POST /api/auth/login',
  'POST /api/contact',
  'GET /api/content/programs',
  'GET /api/content/programs/:id',
  'GET /api/content/settings',
  'POST /api/donations',
  'POST /api/volunteers',
  'GET /api/news',
  'GET /api/news/:id',
  'GET /api/news/featured/latest',
]);

function prefixFromLayer(layer) {
  const source = layer.regexp && layer.regexp.source;
  if (!source) return '';
  const cleaned = source
    .replace(/\\\//g, '/')
    .replace(/\(\?=\/\|\$\)/g, '')
    .replace(/\/\?/g, '')
    .replace(/^\^/, '')
    .replace(/\$$/, '');
  const match = cleaned.match(/^\/[A-Za-z0-9/_-]*/);
  return match ? match[0].replace(/\/$/, '') : '';
}

function listRoutes(app) {
  const routes = [];

  function walk(stack, prefix) {
    stack.forEach((layer) => {
      if (layer.route) {
        Object.keys(layer.route.methods)
          .filter((method) => layer.route.methods[method] && method !== 'head')
          .forEach((method) => {
            const path = `${prefix}${layer.route.path === '/' ? '' : layer.route.path}` || '/';
            routes.push({ method: method.toUpperCase(), path });
          });
        return;
      }
      if (layer.name === 'router' && layer.handle && layer.handle.stack) {
        walk(layer.handle.stack, prefixFromLayer(layer));
      }
    });
  }

  walk(app._router.stack, '');
  return routes;
}

describe('route authentication', () => {
  const app = createApp({ rateLimit: false, logging: false });
  const routes = listRoutes(app);

  it('discovers the public allowlist and the staff routes', () => {
    const keys = new Set(routes.map((route) => `${route.method} ${route.path}`));
    PUBLIC_ROUTES.forEach((route) => {
      expect(keys.has(route)).toBe(true);
    });
    expect(routes.length).toBeGreaterThan(PUBLIC_ROUTES.size);
  });

  it('returns 401 for every route that is not on the public allowlist', async () => {
    const staffRoutes = routes.filter((route) => !PUBLIC_ROUTES.has(`${route.method} ${route.path}`));
    expect(staffRoutes.length).toBeGreaterThan(0);

    for (const route of staffRoutes) {
      const path = route.path.replace(/:([A-Za-z_]+)/g, '1');
      const response = await request(app)[route.method.toLowerCase()](path);
      expect({
        route: `${route.method} ${path}`,
        status: response.status,
      }).toEqual({
        route: `${route.method} ${path}`,
        status: 401,
      });
    }
  });
});
