import { execSync } from 'child_process';
import fs from 'fs';

function clean() {
  console.log('Cleaning dist directory...');
  execSync('rimraf dist', { stdio: 'inherit' });
}

function compile() {
  console.log('Compiling TypeScript...');
  execSync('tsc', { stdio: 'inherit' });
}

function copyFiles() {
  console.log('Copying additional files...');
  const filesToCopy = [
    'package.json',
    'README.md',
    'LICENSE',
    '.npmignore'
  ];

  filesToCopy.forEach(file => {
    fs.copyFileSync(file, `dist/${file}`);
  });
}

function updatePackageJson() {
  console.log('Updating package.json...');
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
  
  delete pkg.scripts.dev;
  delete pkg.scripts.test;
  delete pkg.devDependencies;
  
  fs.writeFileSync('dist/package.json', JSON.stringify(pkg, null, 2));
}

function main() {
  try {
    clean();
    compile();
    copyFiles();
    updatePackageJson();
    console.log('Build completed successfully');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

main();
