// src/app.js
// A tiny Express application used as the "thing we are building & deploying".
// We export `app` (so tests can call it without starting a server) and a
// small `add` helper (so we have a pure function to unit-test).

const express = require('express');
const app = express();

// A pure function — easy to unit-test in isolation.
function add(a, b) {
  return a + b;
}

// Root route.
app.get('/', (req, res) => {
  res.json({ message: 'Hello from the CI/CD demo app!' });
});

// Health check — pipelines and load balancers hit endpoints like this.
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// Example route that exercises the add() function.
app.get('/add', (req, res) => {
  const a = Number(req.query.a);
  const b = Number(req.query.b);
  res.json({ result: add(a, b) });
});

module.exports = { app, add };
