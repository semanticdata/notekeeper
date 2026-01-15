#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Configuration
const sharedDir = path.join(__dirname, '../shared');
const packagesDir = path.join(__dirname, '../packages');
const sharedFiles = ['script.js', 'styles.css', 'icon.svg', 'preload.js', 'export.js'];
const targets = ['newtab', 'sidebar'];

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function copyFile(source, destination) {
  try {
    // Ensure destination directory exists
    const destDir = path.dirname(destination);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    // Copy file
    fs.copyFileSync(source, destination);
    return true;
  } catch (error) {
    log(`Error copying ${source} to ${destination}: ${error.message}`, colors.yellow);
    return false;
  }
}

function build() {
  log('\n📦 Building NoteKeeper extensions...', colors.blue);

  let successCount = 0;
  let totalCopies = sharedFiles.length * targets.length;

  sharedFiles.forEach(file => {
    const source = path.join(sharedDir, file);

    // Check if source file exists
    if (!fs.existsSync(source)) {
      log(`Warning: ${file} not found in shared/`, colors.yellow);
      return;
    }

    targets.forEach(target => {
      const dest = path.join(packagesDir, target, file);
      const success = copyFile(source, dest);

      if (success) {
        successCount++;
        log(`  ✓ Copied ${file} to ${target}/`, colors.green);
      }
    });
  });

  log(`\n✅ Build complete: ${successCount}/${totalCopies} files copied`, colors.green);
  return successCount === totalCopies;
}

// Run build if executed directly
if (require.main === module) {
  build();
}

module.exports = { build };
