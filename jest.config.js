// jest.config.js
// Tells Jest to emit a JUnit-style XML report (so Jenkins can display test
// results) and to collect coverage.

module.exports = {
  testEnvironment: 'node',
  collectCoverage: true,
  coverageDirectory: 'reports/coverage',
  reporters: [
    'default',
    ['jest-junit', {
      outputDirectory: 'reports/junit',
      outputName: 'results.xml'
    }]
  ]
};
