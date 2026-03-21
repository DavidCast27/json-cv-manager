# CV Review Guide

Quick reference for reviewing, validating, and exporting CVs.

## Available Versions

| Template | File | Use case |
|----------|------|----------|
| `fullstack` | `input/en/resume.fullstack.ats.json` | Full-stack roles |
| `frontend` | `input/en/resume.frontend.ats.json` | Frontend-only roles |

## Export Commands

```bash
# Validate
npm run validate -- --lang=en --template=fullstack
npm run validate -- --lang=en --template=frontend
npm run validate:all

# Export (generates PDF + HTML in output/)
npm run export -- --lang=en --template=fullstack --type=all --name=cv
npm run export -- --lang=en --template=frontend --type=all --name=cv

# Export both to separate files
npm run export -- --lang=en --template=fullstack --type=all --name=cv-fullstack
npm run export -- --lang=en --template=frontend --type=all --name=cv-frontend
```

Output files: `output/pdf/cv.pdf`, `output/html/cv.html`

## Review Checklist

### 1. Readability
- [ ] No `Keywords:` lines in work summaries (covered by skills + highlights)
- [ ] No `mailto:`, `tel:`, or raw `https://` in PDF output
- [ ] 1 page max (remove Projects section if needed)

### 2. Language & Tone
- [ ] Varied action verbs (avoid 3+ consecutive bullets starting with "Designed and...")
- [ ] Senior-level framing: "Established", "Led", "Built", "Delivered" vs "Helped", "Assisted"
- [ ] No buzzword soup — each highlight should convey a concrete outcome

### 3. Role Alignment
- [ ] **Frontend CV**: emphasis on architecture, SSR, microfrontends, component libraries
- [ ] **Frontend CV**: avoid backend-heavy wording (e.g., don't lead with "data modeling")
- [ ] **Fullstack CV**: balanced frontend + backend ownership in summary
- [ ] Both CVs should mention backend integration (Node.js, Go) appropriately

### 4. ATS Optimization
- [ ] Keywords present in context (highlights + summary), not in keyword lists
- [ ] Standard job titles (e.g., "Senior Frontend Engineer", not "Code Artisan")
- [ ] Skills section covers main tech stack

## ATS Rules

Sistemas como Greenhouse, Lever, Workday y otros parsean el CV automáticamente. Lo que rompe el parsing:

**Formato**
- [ ] Usar headers estándar: Work Experience, Education, Skills (no inventar nombres)
- [ ] No tablas, columnas múltiples, ni gráficos en el PDF
- [ ] Fuentes estándar (sans-serif, 10-12pt) — evita fuentes decorativas
- [ ] Sin imágenes, iconos, ni barras de progreso para skills
- [ ] Info crítica (nombre, email, teléfono) NO en headers/footers del PDF

**Contenido**
- [ ] Fechas en formato consistente: `YYYY-MM-DD` o `YYYY-MM`
- [ ] Títulos de trabajo reconocibles ("Senior Software Engineer", no "Ninja Developer")
- [ ] Keywords distribuidos naturalmente en highlights y summary, no en listas artificiales
- [ ] Incluir ubicación (ciudad, país) — muchos ATS filtran por ubicación
- [ ] Números de teléfono con formato internacional (+57 XXXXXXXXXX)

**Archivo**
- [ ] Nombre del archivo limpio: `cv.pdf`, no `cv_v2_final_REAL_final.pdf`
- [ ] PDF generado desde el sistema (no escaneado/foto)
- [ ] Texto seleccionable en el PDF (no imagen rasterizada)

**Lo que NO importa tanto** (a nivel ATS)
- Diseño visual bonito — el ATS extrae texto, ignora estilo
- Colores, bordes, sombras
- Iconos de LinkedIn/GitHub (los links bastan)

### 5. Consistency
- [ ] Same education, languages, contact info across both CVs
- [ ] Parallel improvements applied to both versions when relevant
- [ ] Dates in `YYYY-MM-DD` or `YYYY-MM` format

## Common Fixes

| Issue | Fix |
|-------|-----|
| Keywords in summary | Remove `Keywords: ...` line, rely on highlights |
| Repetitive "Designed and..." | Vary: Established, Built, Implemented, Delivered |
| URLs showing in PDF | Theme uses `.hide-in-print` class in `style.css` |
| Spills to 2nd page | Remove Projects section or tighten highlights |
| Typos | Check `institution` (not "institucion"), dates valid |

## File Structure

```
input/en/
  resume.fullstack.ats.json    # Fullstack CV source
  resume.frontend.ats.json     # Frontend CV source

themes/jsonresume-theme-miprofessional/
  partials/basics.hbs          # Header/contact template
  style.css                    # Print styles (.hide-in-print)

output/
  pdf/cv.pdf                   # Latest PDF export
  html/cv.html                 # Latest HTML export
```
