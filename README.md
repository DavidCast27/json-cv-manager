# JSON CV Manager

CV versioned using the JSON Resume schema.

## Requirements

- Node.js 18+ (needed for `ats:check --job-url`; Node 20.12+ adds colored output)
- npm

Note: `resume-cli` recommends Node 12-18; using Node 18 keeps compatibility.

## Usage

Install dependencies:

```
npm install
```

Validate a JSON from `input/` (default `lang=en`, `template=frontend`):

```
npm run validate -- --lang=en --template=frontend
```

Validate all JSON files in `input/`:

```
npm run validate:all
```

Generate PDF (ATS-friendly):

```
npm run export:pdf -- --lang=en --template=frontend --name=cv
```

Generate HTML:

```
npm run export:html -- --lang=en --template=frontend --name=cv
```

Generate both formats:

```
npm run export -- --lang=en --template=frontend --type=all --name=cv
```

Run ATS checker (score + issues):

```
npm run ats:check
```

Note: Make sure `npm install` has been run so `pdf-parse` is available.

ATS checker with PDF:

```
npm run ats:check -- --pdf=output/pdf/cv.pdf
```

ATS checker with job match (URL):

```
npm run ats:check -- --job-url=https://example.com/job
```

ATS checker with job match (text file):

```
npm run ats:check -- --job-text=./job.txt
```

Additional examples:

Validate a specific file with custom language/template:
```
npm run validate -- --lang=es --template=backend
```

Export with custom output name:
```
npm run export:html -- --lang=en --template=frontend --name=my-resume
```

Use different themes (if available):
```
# Assuming you have another theme installed
npm run export:pdf -- --lang=en --template=frontend --theme=another-theme --name=cv
```

Full workflow example:
1. Fork this repository
2. Clone your fork: `git clone https://github.com/your-username/json-cv-manager.git`
3. Navigate to the project: `cd json-cv-manager`
4. Install dependencies: `npm install`
5. Modify input files in `input/en/` (e.g., `input/en/resume.frontend.ats.json`)
6. Validate your changes: `npm run validate -- --lang=en --template=frontend`
7. Generate HTML preview: `npm run export:html -- --lang=en --template=frontend --name=cv`
8. Check output in `output/html/cv.html`
9. Generate PDF: `npm run export:pdf -- --lang=en --template=frontend --name=cv`
10. Check output in `output/pdf/cv.pdf`

## Structure

- `input/<lang>/resume.<template>.ats.json`: CV sources
- `output/html/<name>.html`: HTML export
- `output/pdf/<name>.pdf`: PDF export
- `scripts/export.js`: Exporter with flags
- `scripts/validate.js`: Validator with flags
- `scripts/ats-check.js`: ATS checker with scoring + match
- `themes/jsonresume-theme-miprofessional/`: Local theme

## Forking and Cloning the Repo

1. Fork this repository on GitHub
2. Clone your fork: `git clone https://github.com/your-username/json-cv-manager.git`
3. Navigate to the project directory: `cd json-cv-manager`
4. Install dependencies: `npm install`
5. You're ready to start modifying CV files and generating outputs

## Modifying Input Files

Input files follow the naming convention: `input/<lang>/resume.<template>.ats.json`

Where:
- `<lang>` is the language code (e.g., `en` for English, `es` for Spanish)
- `<template>` is the template name (e.g., `frontend`, `backend`, `fullstack`)

To modify your CV:
1. Navigate to the appropriate language folder: `input/en/`
2. Edit the JSON file corresponding to your template: `resume.frontend.ats.json`
3. Ensure the JSON follows the [JSON Resume schema](https://jsonresume.org/schema/)
4. Dates should be in `YYYY-MM-DD` or `YYYY-MM` format
5. Use camelCase for all property names (e.g., `startDate`, `endDate`, `highlights`)

## Understanding Scripts

The project uses three main scripts:

### validate.js
Validates JSON files against the JSON Resume schema using `resume-cli`:
- Takes `--lang` and `--template` flags to specify which file to validate
- Creates a temporary `resume.json` in the project root
- Runs `npx resume-cli validate` on that file
- Cleans up the temporary file after validation

### export.js
Exports validated JSON to HTML or PDF:
- Takes `--lang`, `--template`, `--type`, and `--name` flags
- `--type` can be `html`, `pdf`, or `all`
- Uses the local theme in `themes/jsonresume-theme-miprofessional/`
- Outputs to `output/html/<name>.html` and/or `output/pdf/<name>.pdf`

### ats-check.js
Scores ATS compatibility and optional job matching:
- Takes `--json` or `--pdf` (defaults to `input/<lang>/resume.<template>.ats.json`)
- Optional `--job-url` or `--job-text` for vacancy matching
- Prints score, issues, and keyword overlap

## Troubleshooting

### Common Issues

1. **"Input file not found" error**
   - Cause: Incorrect language or template specified
   - Solution: Verify that `input/<lang>/resume.<template>.ats.json` exists
   - Example: For `npm run validate -- --lang=es --template=backend`, ensure `input/es/resume.backend.ats.json` exists

2. **Validation errors from resume-cli**
   - Cause: JSON doesn't conform to JSON Resume schema
   - Solution: Check that all required fields are present and correctly formatted
   - Refer to the [JSON Resume schema](https://jsonresume.org/schema/) for details

3. **Node version warnings**
   - Cause: Using Node.js 20+ with resume-cli
   - Solution: Use Node.js 18 for compatibility, or ignore warnings if functionality works

4. **Missing theme errors**
   - Cause: Theme not properly installed or referenced
   - Solution: Ensure `themes/jsonresume-theme-miprofessional/` exists and is correctly referenced in package.json

5. **ATS checker with job URLs returns low score**
   - Cause: Some sites inject extra markup and unrelated text
   - Solution: Use `--job-text` with the cleaned job description

### Getting Help
If you encounter issues not covered here:
1. Check that your JSON is valid using a JSON validator
2. Verify file paths and names match the expected pattern
3. Ensure all dependencies are installed with `npm install`
4. Consult the [JSON Resume documentation](https://jsonresume.org/)