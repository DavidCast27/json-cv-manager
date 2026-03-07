const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const projectDir = path.resolve(__dirname, '..');

const options = {
  template: 'frontend',
  lang: 'en',
  type: 'pdf',
  name: 'cv'
};

process.argv.slice(2).forEach(arg => {
  if (arg.startsWith('--template=')) options.template = arg.split('=')[1];
  if (arg.startsWith('--lang=')) options.lang = arg.split('=')[1];
  if (arg.startsWith('--type=')) options.type = arg.split('=')[1];
  if (arg.startsWith('--name=')) options.name = arg.split('=')[1];
});

const inputPath = path.join(projectDir, 'input', options.lang, `resume.${options.template}.ats.json`);
const outputDir = path.join(projectDir, 'output');

if (!fs.existsSync(inputPath)) {
  console.error(`Error: Input file not found: ${inputPath}`);
  process.exit(1);
}

fs.mkdirSync(path.join(outputDir, 'html'), { recursive: true });
fs.mkdirSync(path.join(outputDir, 'pdf'), { recursive: true });

const resumeJsonPath = path.join(projectDir, 'resume.json');
const themePath = 'jsonresume-theme-miprofessional';

fs.copyFileSync(inputPath, resumeJsonPath);

const generatePdf = (name) => {
  const pdfPath = path.join(outputDir, 'pdf', `${name}.pdf`);
  const cmd = `npx resume-cli export "${pdfPath}" --format pdf --theme ${themePath}`;
  try {
    execSync(cmd, { 
      cwd: projectDir,
      stdio: 'inherit'
    });
    console.log(`PDF: ${pdfPath}`);
  } catch (e) {
    console.error('PDF generation failed:', e.message);
  }
};

const generateHtml = (name) => {
  const htmlPath = path.join(outputDir, 'html', `${name}.html`);
  const cmd = `npx resume-cli export "${htmlPath}" --format html --theme ${themePath}`;
  try {
    execSync(cmd, { 
      cwd: projectDir,
      stdio: 'inherit'
    });
    console.log(`HTML: ${htmlPath}`);
  } catch (e) {
    console.error('HTML generation failed:', e.message);
  }
};

if (options.type === 'pdf' || options.type === 'all') {
  generatePdf(options.name);
}
if (options.type === 'html' || options.type === 'all') {
  generateHtml(options.name);
}

fs.unlinkSync(resumeJsonPath);

console.log(`Done! Template: ${options.template}, Lang: ${options.lang}, Type: ${options.type}, Name: ${options.name}`);
