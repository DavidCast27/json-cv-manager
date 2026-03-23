const fs = require('fs');
const path = require('path');
const { styleText: utilStyleText } = require('node:util');

const projectDir = path.resolve(__dirname, '..');

const options = {
  template: 'frontend',
  lang: 'en',
  json: null,
  pdf: null,
  jobUrl: null,
  jobText: null
};

process.argv.slice(2).forEach(arg => {
  if (arg.startsWith('--template=')) options.template = arg.split('=')[1];
  if (arg.startsWith('--lang=')) options.lang = arg.split('=')[1];
  if (arg.startsWith('--json=')) options.json = arg.split('=')[1];
  if (arg.startsWith('--pdf=')) options.pdf = arg.split('=')[1];
  if (arg.startsWith('--job-url=')) options.jobUrl = arg.split('=')[1];
  if (arg.startsWith('--job-text=')) options.jobText = arg.split('=')[1];
});

const defaultInputPath = path.join(
  projectDir,
  'input',
  options.lang,
  `resume.${options.template}.ats.json`
);

const requireDependency = (name) => {
  try {
    return require(name);
  } catch (error) {
    console.error(colorError(`Missing dependency: ${name}. Please run: npm install ${name}`));
    process.exit(1);
  }
};

const safeReadFile = (filePath) => {
  if (!fs.existsSync(filePath)) {
    console.error(colorError(`Error: File not found: ${filePath}`));
    process.exit(1);
  }
  return fs.readFileSync(filePath, 'utf-8');
};

const cleanText = (text) => text
  .replace(/[“”]/g, '"')
  .replace(/[’]/g, "'")
  .replace(/\u00a0/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const splitWords = (text) => text
  .toLowerCase()
  .replace(/[^a-z0-9+.#\s]/g, ' ')
  .split(/\s+/)
  .filter(Boolean);

const stopWords = new Set([
  'the', 'and', 'for', 'with', 'from', 'this', 'that', 'was', 'were', 'are',
  'you', 'your', 'about', 'into', 'over', 'after', 'before', 'will', 'have',
  'has', 'had', 'been', 'but', 'not', 'all', 'any', 'can', 'our', 'their',
  'its', 'who', 'what', 'when', 'where', 'why', 'how', 'a', 'an', 'of', 'to',
  'in', 'on', 'at', 'by', 'as', 'or', 'is', 'it', 'we', 'i', 'they', 'he', 'she'
]);

const ignoredTokens = new Set([
  '.doc', '.docx', '.pdf', '.ppt', '.pptx', '.jpg', '.jpeg', '.png', '.gif',
  '.svg', '.webp', '.ico', '.map', '.zip', '.rar'
]);

const isNoisyToken = (token) => {
  if (token.startsWith('#')) return true;
  if (ignoredTokens.has(token)) return true;
  if (/^\d+$/.test(token)) return true;
  if (!/[a-z]/i.test(token)) return true;
  if (token.length > 40) return true;
  if (token.includes('+') && !['c++', 'c+'].includes(token)) return true;
  return false;
};

const extractKeywords = (text) => {
  const tokens = splitWords(text)
    .filter((token) => token.length > 2 && !stopWords.has(token) && !isNoisyToken(token));
  return new Set(tokens);
};

const clampScore = (score) => Math.max(0, Math.min(100, Math.round(score)));

const summarizeScore = (score) => {
  if (score >= 85) return 'Excelente';
  if (score >= 70) return 'Bueno';
  if (score >= 55) return 'Regular';
  return 'Bajo';
};

const styleText = (styles, text) => {
  if (typeof utilStyleText !== 'function') return text;
  return utilStyleText(styles, text);
};

const colorScore = (score, text) => {
  if (score >= 85) return styleText(['green', 'bold'], text);
  if (score >= 70) return styleText(['yellow', 'bold'], text);
  if (score >= 55) return styleText(['yellow'], text);
  return styleText(['red', 'bold'], text);
};

const colorTitle = (text) => styleText(['cyan', 'bold'], text);
const colorLabel = (text) => styleText(['white', 'bold'], text);
const colorWarn = (text) => styleText(['yellow'], text);
const colorError = (text) => styleText(['red'], text);

const flattenHighlights = (items, field) => {
  if (!Array.isArray(items)) return [];
  return items.flatMap((item) => {
    if (!item || !Array.isArray(item[field])) return [];
    return item[field].map((highlight) => String(highlight));
  });
};

const buildTextFromJson = (resume) => {
  const sections = [];
  if (resume.basics) {
    sections.push(resume.basics.summary || '');
    sections.push(resume.basics.name || '');
    sections.push(resume.basics.label || '');
    if (resume.basics.location) {
      sections.push(resume.basics.location.city || '');
      sections.push(resume.basics.location.region || '');
      sections.push(resume.basics.location.countryCode || '');
    }
    if (Array.isArray(resume.basics.profiles)) {
      resume.basics.profiles.forEach((profile) => {
        if (profile.network) sections.push(profile.network);
        if (profile.username) sections.push(profile.username);
        if (profile.url) sections.push(profile.url);
      });
    }
  }

  if (Array.isArray(resume.work)) {
    resume.work.forEach((job) => {
      sections.push(job.position || '');
      sections.push(job.name || '');
      sections.push(job.summary || '');
      sections.push((job.highlights || []).join(' '));
    });
  }

  if (Array.isArray(resume.education)) {
    resume.education.forEach((edu) => {
      sections.push(edu.institution || '');
      sections.push(edu.area || '');
      sections.push(edu.studyType || '');
    });
  }

  if (Array.isArray(resume.skills)) {
    resume.skills.forEach((skill) => {
      sections.push(skill.name || '');
      if (Array.isArray(skill.keywords)) {
        sections.push(skill.keywords.join(' '));
      }
    });
  }

  if (Array.isArray(resume.projects)) {
    resume.projects.forEach((project) => {
      sections.push(project.name || '');
      sections.push(project.summary || '');
      sections.push((project.highlights || []).join(' '));
    });
  }

  if (Array.isArray(resume.certificates)) {
    resume.certificates.forEach((cert) => {
      sections.push(cert.name || '');
      sections.push(cert.issuer || '');
    });
  }

  return cleanText(sections.filter(Boolean).join(' '));
};

const parseJsonResume = (filePath) => {
  const content = safeReadFile(filePath);
  try {
    return JSON.parse(content);
  } catch (error) {
    console.error(colorError(`Error: Invalid JSON in ${filePath}`));
    process.exit(1);
  }
};

const readJobText = async (jobUrl, jobTextPath) => {
  if (jobTextPath) {
    return cleanText(safeReadFile(jobTextPath));
  }

  if (!jobUrl) return '';

  if (!jobUrl.startsWith('http')) {
    console.error(colorError('Error: job-url must include http/https'));
    process.exit(1);
  }

  if (!global.fetch) {
    console.error(colorError('Error: Este comando requiere Node 18+ para usar fetch nativo.'));
    console.error(colorWarn('Usa --job-text con un archivo o actualiza Node.'));
    process.exit(1);
  }

  const response = await fetch(jobUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (ATS Checker)'
    }
  });
  if (!response.ok) {
    console.error(colorError(`Error: Failed to fetch job URL (${response.status})`));
    process.exit(1);
  }
  const html = await response.text();
  const text = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ');
  return cleanText(text);
};

const parsePdfText = async (filePath) => {
  const pdfParse = requireDependency('pdf-parse');
  const buffer = fs.readFileSync(filePath);
  const data = await pdfParse(buffer);
  return cleanText(data.text || '');
};

const calculateAtsScore = ({ resume, resumeText, isPdf }) => {
  const issues = [];
  let score = 100;
  const textLower = resumeText.toLowerCase();

  const hasSection = (patterns) => patterns.some((pattern) => pattern.test(textLower));
  const hasEmail = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(resumeText);
  const hasPhone = /(\+?\d[\d\s\-().]{7,}\d)/.test(resumeText);

  const experiencePatterns = [
    /\bexperience\b/,
    /\bwork experience\b/,
    /\bemployment\b/,
    /\bexperiencia\b/
  ];
  const educationPatterns = [
    /\beducation\b/,
    /\beducación\b/,
    /\beducacion\b/,
    /\bformación\b/,
    /\bformacion\b/
  ];
  const skillsPatterns = [
    /\bskills\b/,
    /\btech skills\b/,
    /\bcompetencias\b/,
    /\bhabilidades\b/
  ];
  const summaryPatterns = [
    /\bsummary\b/,
    /\bperfil\b/,
    /\bresumen\b/,
    /\babout me\b/,
    /\babout\b/
  ];

  if (resume) {
    const basics = resume.basics || null;
    const work = resume.work || null;
    const education = resume.education || null;
    const skills = resume.skills || null;

    if (!basics) {
      issues.push('Falta la sección basics.');
      score -= 15;
    }

    if (!work || work.length === 0) {
      issues.push('No hay experiencia laboral en work.');
      score -= 20;
    }

    if (!education || education.length === 0) {
      issues.push('No hay educación en education.');
      score -= 10;
    }

    if (!skills || skills.length === 0) {
      issues.push('No hay skills declaradas.');
      score -= 15;
    }

    if (basics) {
      if (!basics.email) {
        issues.push('Falta email en basics.');
        score -= 8;
      }
      if (!basics.phone) {
        issues.push('Falta phone en basics.');
        score -= 5;
      }
      if (!basics.summary) {
        issues.push('Falta summary en basics.');
        score -= 5;
      }
    }

    if (Array.isArray(work)) {
      const missingStartDates = work.filter((job) => !job.startDate);
      if (missingStartDates.length > 0) {
        issues.push('Hay posiciones de work sin startDate.');
        score -= 8;
      }

      const highlights = flattenHighlights(work, 'highlights');
      const longHighlights = highlights.filter((text) => text.split(' ').length > 35);
      if (longHighlights.length > 0) {
        issues.push('Hay highlights muy largos (más de 35 palabras).');
        score -= 4;
      }
    }

    if (Array.isArray(skills)) {
      const emptySkills = skills.filter((skill) => !skill.keywords || skill.keywords.length === 0);
      if (emptySkills.length > 0) {
        issues.push('Hay skills sin keywords asociadas.');
        score -= 6;
      }
    }
  } else {
    if (!hasSection(experiencePatterns)) {
      issues.push('No se detecta sección de experiencia en el PDF.');
      score -= 18;
    }
    if (!hasSection(educationPatterns)) {
      issues.push('No se detecta sección de educación en el PDF.');
      score -= 10;
    }
    if (!hasSection(skillsPatterns)) {
      issues.push('No se detecta sección de skills en el PDF.');
      score -= 12;
    }
    if (!hasSection(summaryPatterns)) {
      issues.push('No se detecta resumen/perfil en el PDF.');
      score -= 5;
    }
    if (!hasEmail) {
      issues.push('No se detecta email en el PDF.');
      score -= 8;
    }
    if (!hasPhone) {
      issues.push('No se detecta teléfono en el PDF.');
      score -= 5;
    }
  }

  if (isPdf && resumeText.length < 400) {
    issues.push('El PDF tiene poco texto extraíble; podría ser difícil de parsear por ATS.');
    score -= 20;
  }

  if (resumeText.length < 800) {
    issues.push('El CV tiene poco contenido textual; considera ampliar experiencia o skills.');
    score -= 8;
  }

  return {
    score: clampScore(score),
    summary: summarizeScore(score),
    issues
  };
};

const calculateMatchScore = (resumeText, jobText) => {
  if (!jobText) {
    return null;
  }

  const resumeKeywords = extractKeywords(resumeText);
  const jobKeywords = extractKeywords(jobText);

  if (jobKeywords.size === 0) {
    return {
      score: 0,
      summary: 'Sin datos',
      missing: [],
      matched: [],
      totalMissing: 0
    };
  }

  const matched = [];
  const missing = [];

  jobKeywords.forEach((keyword) => {
    if (resumeKeywords.has(keyword)) {
      matched.push(keyword);
    } else {
      missing.push(keyword);
    }
  });

  const score = clampScore((matched.length / jobKeywords.size) * 100);
  const cappedMissing = missing.sort().slice(0, 200);

  return {
    score,
    summary: summarizeScore(score),
    matched: matched.sort(),
    missing: cappedMissing,
    totalMissing: missing.length
  };
};

const resolveInput = () => {
  if (options.json && options.pdf) {
    console.error(colorError('Error: Use solo --json o --pdf, no ambos.'));
    process.exit(1);
  }

  if (options.json) {
    return { type: 'json', path: path.resolve(options.json) };
  }

  if (options.pdf) {
    return { type: 'pdf', path: path.resolve(options.pdf) };
  }

  return { type: 'json', path: defaultInputPath };
};

const printSection = (title) => {
  console.log('\n' + colorTitle(title));
  console.log('-'.repeat(title.length));
};

const printList = (items, limit = 20, formatter = (value) => value) => {
  if (!items || items.length === 0) {
    console.log('  (sin datos)');
    return;
  }
  items.slice(0, limit).forEach((item) => {
    console.log(`  - ${formatter(item)}`);
  });
  if (items.length > limit) {
    console.log(`  ... y ${items.length - limit} más`);
  }
};

const printCount = (label, value) => {
  console.log(`${colorLabel(label)} ${value}`);
};

const main = async () => {
  const input = resolveInput();

  let resume = null;
  let resumeText = '';

  if (input.type === 'json') {
    resume = parseJsonResume(input.path);
    resumeText = buildTextFromJson(resume);
  } else {
    resumeText = await parsePdfText(input.path);
  }

  const ats = calculateAtsScore({
    resume,
    resumeText,
    isPdf: input.type === 'pdf'
  });

  const jobText = await readJobText(options.jobUrl, options.jobText);
  const match = calculateMatchScore(resumeText, jobText);

  printSection('ATS Score');
  const atsScoreLine = `Score: ${ats.score}/100 (${ats.summary})`;
  console.log(colorScore(ats.score, atsScoreLine));
  if (ats.issues.length > 0) {
    console.log(colorLabel('Issues:'));
    printList(ats.issues, 20, colorWarn);
  } else {
    console.log(colorLabel('Issues:') + ' (sin problemas detectados)');
  }

  if (match) {
    printSection('Job Match');
    const matchScoreLine = `Score: ${match.score}/100 (${match.summary})`;
    console.log(colorScore(match.score, matchScoreLine));
    const totalKeywords = match.matched.length + match.totalMissing;
    printCount('Total keywords vacante:', totalKeywords);
    printCount('Keywords coincidentes:', match.matched.length);
    printCount('Keywords faltantes:', match.totalMissing);
    console.log(colorLabel('Keywords faltantes (muestra):'));
    printList(match.missing, 25, colorWarn);
    console.log(colorLabel('Keywords coincidentes (muestra):'));
    printList(match.matched, 25, (value) => styleText(['green'], value));
    if (totalKeywords > 300) {
      console.log(colorWarn('Nota: la vacante parece incluir mucho ruido; usa --job-text con el texto limpio.'));
    }
  }

  console.log(`
${colorLabel('Input:')} ${input.path}`);
  if (options.jobUrl) {
    console.log(`${colorLabel('Job URL:')} ${options.jobUrl}`);
  }
  if (options.jobText) {
    console.log(`${colorLabel('Job Text:')} ${path.resolve(options.jobText)}`);
  }


  if (match) {
    printSection('Job Match');
    console.log(`Score: ${match.score}/100 (${match.summary})`);
    console.log('Keywords faltantes:');
    printList(match.missing, 25);
    console.log('Keywords coincidentes:');
    printList(match.matched, 25);
  }

  console.log(`\nInput: ${input.path}`);
  if (options.jobUrl) {
    console.log(`Job URL: ${options.jobUrl}`);
  }
  if (options.jobText) {
    console.log(`Job Text: ${path.resolve(options.jobText)}`);
  }
};

main().catch((error) => {
  console.error(colorError(`ATS checker failed: ${error.message}`));
  process.exit(1);
});
