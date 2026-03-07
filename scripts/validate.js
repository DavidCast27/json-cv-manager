const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const projectDir = path.resolve(__dirname, '..');

const options = {
  template: 'frontend',
  lang: 'en'
};

process.argv.slice(2).forEach(arg => {
  if (arg.startsWith('--template=')) options.template = arg.split('=')[1];
  if (arg.startsWith('--lang=')) options.lang = arg.split('=')[1];
});

const inputPath = path.join(
  projectDir,
  'input',
  options.lang,
  `resume.${options.template}.ats.json`
);
const resumeJsonPath = path.join(projectDir, 'resume.json');

if (!fs.existsSync(inputPath)) {
  console.error(`Error: Input file not found: ${inputPath}`);
  process.exit(1);
}

try {
  fs.copyFileSync(inputPath, resumeJsonPath);
  const command = 'npx resume-cli validate';
  execSync(command, {
    cwd: projectDir,
    stdio: 'inherit'
  });
  console.log(`Validated: ${inputPath}`);
} catch (error) {
  console.error('Validation failed:', error.message);
  process.exitCode = 1;
} finally {
  if (fs.existsSync(resumeJsonPath)) {
    fs.unlinkSync(resumeJsonPath);
  }
}

console.log(`Done! Template: ${options.template}, Lang: ${options.lang}`);
