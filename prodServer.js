// This file configures a web server for testing the production build
// on your local machine.

const browserSync = require('browser-sync');
const historyApiFallback = require('connect-history-api-fallback');

/* eslint-disable no-console */

console.log('Opening production build...');

// Run Browsersync
browserSync({
  port: 4000,
  ui: {
    port: 4001
  },
  server: {
    baseDir: 'bundle'
  },

  middleware: [historyApiFallback()]
});
