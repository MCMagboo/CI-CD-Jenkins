// src/server.js
// Separate entry point that actually starts the HTTP server.
// Keeping this apart from app.js means tests can import the app
// without a real server starting up.

const { app } = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
