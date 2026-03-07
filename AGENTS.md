# Repository Guidelines

Concise contributor guide for maintaining a JSON Resume–based CV. Use the npm scripts to validate and export artifacts, and keep changes schema-compliant and reviewable.

## Project Structure & Module Organization
- `input/<lang>/resume.<template>.ats.json`: JSON Resume sources per role/language.
- `themes/jsonresume-theme-miprofessional/`: local theme (Handlebars templates, CSS, JS).
- `output/html/` and `output/pdf/`: generated files (e.g., `output/html/cv.html`, `output/pdf/cv.pdf`).
- `package.json`: scripts and dependencies; `node_modules/` for installed packages.
- `scripts/export.js` and `scripts/validate.js`: export/validate helpers that accept flags.

## Build, Test, and Development Commands
- `npm install`: install dependencies.
- `npm run validate -- --lang=en --template=frontend`: validate a specific input file.
- `npm run validate:all`: validate all JSON files under `input/`.
- `npm run export:html -- --lang=en --template=frontend --name=cv`: export HTML.
- `npm run export:pdf -- --lang=en --template=frontend --name=cv`: export PDF.
- `npm run export -- --lang=en --template=frontend --type=all --name=cv`: export both.
Example workflow: `npm run validate -- --lang=en --template=frontend && npm run export:html -- --lang=en --template=frontend --name=cv` to preview locally.

## Coding Style & Naming Conventions
- JSON: 2-space indent, double quotes, no trailing commas after the last item.
- Keys: camelCase per schema (e.g., `startDate`, `endDate`, `highlights`).
- Dates: `YYYY-MM-DD` or `YYYY-MM` only.
- File naming: lowercase with hyphens (e.g., `cv.json`, `package.json`).

## Testing Guidelines
- No automated tests. Use `npm run validate` to catch schema issues.
- Manual checks: open `output/html/cv.html`, verify layout, links, and dates; then export PDF.
- If editing the theme, re-run exports and verify sections (basics, work, education, skills).

## Commit & Pull Request Guidelines
- Commits: short, imperative, scoped messages (e.g., `feat(work): add senior role at X`).
- Before PR: run `npm run validate`, export HTML, and include a brief description of changes and screenshots of the HTML preview when relevant.
- Link related issues and note any theme changes affecting rendering.

## Security & Configuration Tips
- Do not commit secrets. The resumes in `input/` contain personal data—review before publishing.
- Pin changes to `input/` and theme files in separate commits to ease review.
