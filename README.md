# JSON CV Manager

CV versionado usando el esquema JSON Resume.

## Requisitos

- Node.js 12-18 (recomendado por `resume-cli`)
- npm

## Uso

Instalar dependencias:

```
npm install
```

Validar un JSON de `input/` (por defecto `lang=en`, `template=frontend`):

```
npm run validate -- --lang=en --template=frontend
```

Validar todos los JSON de `input/`:

```
npm run validate:all
```

Generar PDF (ATS-friendly):

```
npm run export:pdf -- --lang=en --template=frontend --name=cv
```

Generar HTML:

```
npm run export:html -- --lang=en --template=frontend --name=cv
```

Generar ambos:

```
npm run export -- --lang=en --template=frontend --type=all --name=cv
```

## Estructura

- `input/<lang>/resume.<template>.ats.json`: fuentes de CV
- `output/html/<name>.html`: exportación HTML
- `output/pdf/<name>.pdf`: exportación PDF
- `scripts/export.js`: exportador con flags
- `scripts/validate.js`: validador con flags
- `themes/jsonresume-theme-miprofessional/`: tema local

## Notas

- El tema usado es `jsonresume-theme-miprofessional` (local).
- `resume-cli` recomienda Node.js 12-18; si usas Node 20+ puede mostrar warnings.
