import { execSync } from 'child_process';
import fs from 'fs';

interface PackageJson {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

function checkOutdatedDependencies() {
  try {
    console.log('Checking for outdated dependencies...');
    const output = execSync('npm outdated --json', { encoding: 'utf-8' });
    const outdated = JSON.parse(output);
    
    if (Object.keys(outdated).length > 0) {
      console.warn('Outdated dependencies found:', outdated);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Failed to check dependencies:', error);
    return false;
  }
}

function checkVulnerabilities() {
  try {
    console.log('Checking for vulnerabilities...');
    execSync('npm audit', { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error('Security vulnerabilities found');
    return false;
  }
}

function validatePeerDependencies() {
  const pkg: PackageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
  const nodeModules = fs.readdirSync('node_modules');
  
  console.log('Validating peer dependencies...');
  
  const dependencies = { ...pkg.dependencies, ...pkg.devDependencies };
  const missingDeps = Object.keys(dependencies).filter(dep => !nodeModules.includes(dep));
  
  if (missingDeps.length > 0) {
    console.error('Missing dependencies:', missingDeps);
    return false;
  }
  return true;
}

function main() {
  const checks = [
    checkOutdatedDependencies(),
    checkVulnerabilities(),
    validatePeerDependencies()
  ];
  
  if (checks.every(Boolean)) {
    console.log('All dependency checks passed');
  } else {
    console.error('Some dependency checks failed');
    process.exit(1);
  }
}

main();
