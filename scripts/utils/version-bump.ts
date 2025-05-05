import fs from 'fs';
import { execSync } from 'child_process';

type VersionType = 'major' | 'minor' | 'patch';

function updateVersion(type: VersionType) {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
  const [major, minor, patch] = pkg.version.split('.').map(Number);
  
  switch (type) {
    case 'major':
      pkg.version = `${major + 1}.0.0`;
      break;
    case 'minor':
      pkg.version = `${major}.${minor + 1}.0`;
      break;
    case 'patch':
      pkg.version = `${major}.${minor}.${patch + 1}`;
      break;
  }
  
  fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
  return pkg.version;
}

function createGitTag(version: string) {
  try {
    execSync(`git tag v${version}`);
    execSync('git push --tags');
    console.log(`Created and pushed tag v${version}`);
  } catch (error) {
    console.error('Failed to create git tag:', error);
  }
}

function updateChangelog(version: string) {
  const changelog = fs.readFileSync('CHANGELOG.md', 'utf-8');
  const date = new Date().toISOString().split('T')[0];
  
  const newEntry = `\n## [${version}] - ${date}\n\n### Added\n- \n\n### Changed\n- \n\n### Fixed\n- \n`;
  
  fs.writeFileSync('CHANGELOG.md', changelog.replace(
    /# Changelog/,
    `# Changelog${newEntry}`
  ));
}

function main() {
  const type = process.argv[2] as VersionType;
  
  if (!['major', 'minor', 'patch'].includes(type)) {
    console.error('Please specify version type: major, minor, or patch');
    process.exit(1);
  }
  
  const newVersion = updateVersion(type);
  updateChangelog(newVersion);
  createGitTag(newVersion);
  
  console.log(`Version bumped to ${newVersion}`);
}

main();
