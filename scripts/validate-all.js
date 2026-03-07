const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const projectDir = path.resolve(__dirname, '..');
const inputDir = path.join(projectDir, 'input');

const resumeJsonPath = path.join(projectDir, 'resume.json');

const collectResumeFiles = (dir) => {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((entry) => {
      const entryPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        return collectResumeFiles(entryPath);
      }
      if (entry.isFile() && entry.name.endsWith('.json')) {
        return [entryPath];
      }
      return [];
    });
};

const inputFiles = collectResumeFiles(inputDir);

if (inputFiles.length === 0) {
  console.error(`Error: No input JSON files found in ${inputDir}`);
  process.exit(1);
}

let hasErrors = false;

inputFiles.forEach((filePath) => {
  try {
    fs.copyFileSync(filePath, resumeJsonPath);
    execSync('npx resume-cli validate', {
      cwd: projectDir,
      stdio: 'inherit'
    });
    console.log(`Validated: ${filePath}`);
  } catch (error) {
    hasErrors = true;
    console.error(`Validation failed for ${filePath}: ${error.message}`);
  } finally {
    if (fs.existsSync(resumeJsonPath)) {
      fs.unlinkSync(resumeJsonPath);
    }
  }
});

if (hasErrors) {
  process.exitCode = 1;
}

console.log(`Done! Validated ${inputFiles.length} file(s).`);
