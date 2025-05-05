import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

function ensureDirectories() {
  const dirs = [
    'dist',
    'logs',
    'coverage',
    'temp'
  ];

  dirs.forEach(dir => {
    const dirPath = path.join(process.cwd(), dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`Created directory: ${dir}`);
    }
  });
}

function setupGitHooks() {
  try {
    execSync('npx husky install', { stdio: 'inherit' });
    console.log('Git hooks installed successfully');
  } catch (error) {
    console.error('Failed to install git hooks:', error);
  }
}

function setupEnvFiles() {
  const envFiles = ['.env.example', '.env.test'];
  
  envFiles.forEach(file => {
    if (!fs.existsSync(file)) {
      fs.copyFileSync(`${file}.template`, file);
      console.log(`Created ${file} from template`);
    }
  });
}

function main() {
  console.log('Starting project setup...');
  ensureDirectories();
  setupGitHooks();
  setupEnvFiles();
  console.log('Setup completed successfully');
}

main();
