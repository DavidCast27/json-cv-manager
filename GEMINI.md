# GEMINI.md - Project Context

## Project Overview
`json-cv-manager` is a Node.js-based toolkit designed to manage and export professional CVs using the [JSON Resume](https://jsonresume.org/) schema. It supports multi-language CVs and different career templates (e.g., frontend, fullstack).

The project centralizes CV data in JSON format, allowing for version control and automated generation of polished HTML and PDF outputs using a custom local theme. It also includes utility scripts for schema validation and ATS (Applicant Tracking System) compatibility analysis.

### Core Technologies
- **Node.js**: Runtime environment (v18+ recommended).
- **JSON Resume**: Schema for resume data.
- **resume-cli**: Tool for validating and exporting resumes.
- **Handlebars**: Templating engine for the custom theme.
- **pdf-parse**: Used for ATS analysis of PDF exports.

## Building and Running

### Prerequisites
- Node.js 18 or higher.
- npm.

### Setup
```bash
npm install
```

### Key Commands

- **Validation:**
  - Validate a specific file: `npm run validate -- --lang=<lang> --template=<template>`
  - Validate all files: `npm run validate:all`
- **Exporting:**
  - Export to PDF: `npm run export:pdf -- --lang=<lang> --template=<template> --name=<output_name>`
  - Export to HTML: `npm run export:html -- --lang=<lang> --template=<template> --name=<output_name>`
  - Export both: `npm run export -- --lang=<lang> --template=<template> --type=all --name=<output_name>`
- **ATS Checker:**
  - Basic check: `npm run ats:check -- --lang=<lang> --template=<template>`
  - Check against a job URL: `npm run ats:check -- --job-url=<url>`
  - Check against a job description text: `npm run ats:check -- --job-text=<file_path>`
  - Check an existing PDF: `npm run ats:check -- --pdf=output/pdf/cv.pdf`

## Directory Structure
- `input/`: Contains source JSON files organized by language (e.g., `input/en/`).
  - Files follow the naming convention: `resume.<template>.ats.json`.
- `output/`: Target directory for generated HTML and PDF files.
- `scripts/`: Custom Node.js scripts for automation (`export.js`, `validate.js`, `ats-check.js`).
- `themes/`: Contains the local theme `jsonresume-theme-miprofessional`.
- `CV-REVIEW.md`: Documentation for resume review and optimization notes.

## Development Conventions

### Input Data
- All resume data must strictly follow the JSON Resume schema.
- Property names should be in `camelCase`.
- Dates should use `YYYY-MM-DD` or `YYYY-MM` formats.
- Input files are located in `input/<lang>/` with the format `resume.<template>.ats.json`.

### Scripting Pattern
- Custom scripts often create a temporary `resume.json` in the root directory to interface with `resume-cli`, as it expects this specific filename. These temporary files are cleaned up automatically after execution.
- Scripts use `process.argv` for custom flag parsing (e.g., `--lang=en`, `--template=frontend`).

### Theming
- The project uses a local theme located in `themes/jsonresume-theme-miprofessional/`.
- The theme is based on Handlebars (`.hbs`) templates and Vanilla CSS.
- The theme is linked in `package.json` as a local file dependency: `"jsonresume-theme-miprofessional": "file:themes/jsonresume-theme-miprofessional"`.

### ATS Analysis
- The `ats-check.js` script performs keyword extraction and scoring.
- It uses a custom list of stop words and noisy tokens to identify relevant technical keywords.
- Scoring is based on section presence, contact information, and keyword overlap with job descriptions.
