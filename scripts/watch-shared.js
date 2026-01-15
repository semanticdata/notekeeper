#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Import the build function
const { build } = require('./copy-shared.js');

// Configuration
const sharedDir = path.join(__dirname, '../shared');
const sharedFiles = ['script.js', 'styles.css', 'icon.svg', 'preload.js', 'export.js'];

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

// Store file modification times to detect changes
const fileStats = {};

function watch() {
  log('\n👀 Watching shared/ directory for changes...', colors.cyan);
  log('Press Ctrl+C to stop\n', colors.reset);

  // Initial build
  build();

  // Track initial file stats
  sharedFiles.forEach(file => {
    const filePath = path.join(sharedDir, file);
    if (fs.existsSync(filePath)) {
      fileStats[file] = fs.statSync(filePath).mtimeMs;
    }
  });

  // Watch the shared directory
  fs.watch(sharedDir, { recursive: false }, (eventType, filename) => {
    if (!filename) return;

    // Only process shared files
    if (!sharedFiles.includes(filename)) return;

    const filePath = path.join(sharedDir, filename);

    // Wait a bit for the file write to complete
    setTimeout(() => {
      try {
        const currentStats = fs.statSync(filePath);
        const lastStats = fileStats[filename];

        // Only rebuild if file actually changed
        if (!lastStats || currentStats.mtimeMs > lastStats) {
          fileStats[filename] = currentStats.mtimeMs;
          log(`\n📝 Detected change in ${filename}`, colors.yellow);
          build();
          log('Watching for changes...\n', colors.cyan);
        }
      } catch (error) {
        log(`Error watching file: ${error.message}`, colors.yellow);
      }
    }, 100);
  });

  // Handle Ctrl+C gracefully
  process.on('SIGINT', () => {
    log('\n\n👋 Stopped watching', colors.reset);
    process.exit(0);
  });
}

// Run watch if executed directly
if (require.main === module) {
  watch();
}

module.exports = { watch };
