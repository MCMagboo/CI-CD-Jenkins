// test/app.test.js
// Tests run automatically in the "Unit Tests" pipeline stage.
// Mixing a pure-function test with HTTP endpoint tests shows students both styles.

const request = require('supertest');
const { app, add } = require('../src/app');

describe('add()', () => {
  test('adds two positive numbers', () => {
    expect(add(2, 3)).toBe(5);
  });

  test('handles negatives', () => {
    expect(add(-4, 1)).toBe(-3);
  });
});

describe('GET /health', () => {
  test('returns a healthy status', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('healthy');
  });
});

describe('GET /add', () => {
  test('adds the query parameters', async () => {
    const res = await request(app).get('/add?a=4&b=5');
    expect(res.statusCode).toBe(200);
    expect(res.body.result).toBe(9);
  });
});
