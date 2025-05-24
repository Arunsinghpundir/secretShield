#!/usr/bin/env node
const { execSync } = require('child_process');
const scanFilesForSecrets = require('../scripts/scan');
const chalk = require('chalk');

console.log("✅ SecretShield CLI is working!");
console.log('🔍 SecretShield scanning staged files...');

let files = [];

try {
  files = execSync('git diff --cached --name-only', { encoding: 'utf-8' })
    .split('\n')
    .filter(f => f.trim().length > 0);
} catch (err) {
  console.error(chalk.red("⚠️ Failed to scan files. Make sure Git is initialized and you have staged files."));
  process.exit(1);
}

if (files.length === 0) {
  console.log(chalk.yellow("⚠️ No staged files to scan."));
  process.exit(0);
}

const path = require('path');

const absolutePaths = files.map(file => path.resolve(process.cwd(), file));
const secretsFound = scanFilesForSecrets(absolutePaths);
if (secretsFound) {
  console.log('\n🛑 Commit blocked: Secrets detected!');
  process.exit(1);
} else {
  console.log('✅ No secrets found. You are good to commit.');
}
