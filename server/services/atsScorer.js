/**
 * Algorithmic ATS scoring based on keyword matching + section detection
 * This runs WITHOUT an LLM and gives deterministic scores.
 */

// Common resume section headers
const SECTION_PATTERNS = {
  contact: /\b(email|phone|linkedin|github|address|contact)\b/i,
  summary: /\b(summary|objective|profile|about me|professional summary)\b/i,
  experience: /\b(experience|work experience|employment|work history|career)\b/i,
  education: /\b(education|academic|degree|university|college|school)\b/i,
  skills: /\b(skills|technical skills|core competencies|expertise|proficiencies)\b/i,
  projects: /\b(projects|portfolio|side projects|personal projects)\b/i,
  certifications: /\b(certifications|certificates|licenses|credentials)\b/i,
  achievements: /\b(achievements|awards|honors|recognition)\b/i,
};

// Weight of each section in section score
const SECTION_WEIGHTS = {
  contact: 15,
  summary: 10,
  experience: 30,
  education: 20,
  skills: 15,
  projects: 5,
  certifications: 3,
  achievements: 2,
};

/**
 * Tokenize text into normalized keywords
 */
function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s+#.]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2);
}

/**
 * Extract keyword phrases from job description (1-3 grams)
 */
function extractJDKeywords(jdText) {
  const words = tokenize(jdText);
  const wordSet = new Set(words);

  // Common tech skills and important terms
  const techTerms = [
    'javascript', 'typescript', 'react', 'node', 'nodejs', 'python', 'java', 'sql', 'nosql',
    'mongodb', 'postgresql', 'mysql', 'redis', 'docker', 'kubernetes', 'aws', 'azure', 'gcp',
    'git', 'api', 'rest', 'graphql', 'css', 'html', 'vue', 'angular', 'express', 'django',
    'flask', 'spring', 'agile', 'scrum', 'ci/cd', 'devops', 'machine learning', 'deep learning',
    'tensorflow', 'pytorch', 'data science', 'analytics', 'leadership', 'communication',
    'teamwork', 'problem solving', 'management', 'design', 'testing', 'security',
    'microservices', 'blockchain', 'ios', 'android', 'swift', 'kotlin', 'flutter',
  ];

  const found = new Set();
  const stopWords = new Set([
    'the', 'and', 'for', 'with', 'you', 'have', 'will', 'our', 'your', 'are',
    'this', 'that', 'not', 'can', 'all', 'any', 'from', 'into', 'over', 'than',
    'more', 'also', 'been', 'were', 'about', 'them', 'they', 'their', 'which',
  ]);

  // Add tech terms found in JD
  techTerms.forEach((term) => {
    if (jdText.toLowerCase().includes(term)) found.add(term);
  });

  // Add meaningful words from JD
  words.forEach((word) => {
    if (!stopWords.has(word) && word.length > 3 && isNaN(word)) {
      found.add(word);
    }
  });

  return [...found];
}

/**
 * Calculate keyword match score
 */
function calculateKeywordScore(resumeText, jdKeywords) {
  const resumeLower = resumeText.toLowerCase();
  const detected = [];
  const missing = [];

  jdKeywords.forEach((keyword) => {
    const found = resumeLower.includes(keyword.toLowerCase());
    const importance = getKeywordImportance(keyword);
    if (found) {
      detected.push({ word: keyword, found: true, importance });
    } else {
      missing.push({ word: keyword, found: false, importance });
    }
  });

  // Weight by importance
  let weightedMatches = 0;
  let totalWeight = 0;

  [...detected, ...missing].forEach(({ found, importance }) => {
    const w = importance === 'high' ? 3 : importance === 'medium' ? 2 : 1;
    totalWeight += w;
    if (found) weightedMatches += w;
  });

  const score = totalWeight > 0 ? Math.round((weightedMatches / totalWeight) * 100) : 0;

  return { score, detected, missing };
}

/**
 * Determine keyword importance heuristically
 */
function getKeywordImportance(keyword) {
  const highPriority = [
    'javascript', 'typescript', 'python', 'java', 'react', 'node', 'sql', 'aws',
    'docker', 'kubernetes', 'machine learning', 'leadership', 'management',
  ];
  const lowPriority = ['communication', 'teamwork', 'organized', 'detail'];

  if (highPriority.some((h) => keyword.toLowerCase().includes(h))) return 'high';
  if (lowPriority.some((l) => keyword.toLowerCase().includes(l))) return 'low';
  return 'medium';
}

/**
 * Detect which sections are present in resume
 */
function detectSections(resumeText) {
  const sections = [];

  Object.entries(SECTION_PATTERNS).forEach(([name, pattern]) => {
    const present = pattern.test(resumeText);
    const weight = SECTION_WEIGHTS[name] || 5;
    sections.push({ name, present, score: present ? weight : 0 });
  });

  return sections;
}

/**
 * Calculate section completeness score
 */
function calculateSectionScore(sections) {
  const total = Object.values(SECTION_WEIGHTS).reduce((a, b) => a + b, 0);
  const earned = sections.reduce((sum, s) => sum + (s.present ? (SECTION_WEIGHTS[s.name] || 5) : 0), 0);
  return Math.round((earned / total) * 100);
}

/**
 * Detect skill gaps
 */
function detectSkillGaps(missing) {
  const categories = {
    'Programming Languages': ['javascript', 'typescript', 'python', 'java', 'c++', 'go', 'ruby', 'swift', 'kotlin'],
    'Frameworks & Libraries': ['react', 'angular', 'vue', 'node', 'django', 'flask', 'spring', 'express', 'flutter'],
    'Databases': ['sql', 'mongodb', 'postgresql', 'mysql', 'redis', 'elasticsearch'],
    'Cloud & DevOps': ['aws', 'azure', 'gcp', 'docker', 'kubernetes', 'ci/cd', 'devops'],
    'Soft Skills': ['leadership', 'communication', 'teamwork', 'management', 'problem solving'],
  };

  return missing
    .filter((k) => k.importance === 'high' || k.importance === 'medium')
    .map((k) => {
      let category = 'Other Skills';
      Object.entries(categories).forEach(([cat, terms]) => {
        if (terms.some((t) => k.word.toLowerCase().includes(t))) category = cat;
      });
      return { skill: k.word, category, importance: k.importance };
    })
    .slice(0, 10);
}

/**
 * Main scoring function (no LLM)
 */
function calculateAtsScore(resumeText, jobDescription) {
  const jdKeywords = extractJDKeywords(jobDescription);
  const { score: keywordScore, detected, missing } = calculateKeywordScore(resumeText, jdKeywords);
  const sections = detectSections(resumeText);
  const sectionScore = calculateSectionScore(sections);

  // Composite score: If no keywords, use sectionScore as baseline (100% weight)
  // Otherwise, use traditional 60/40 weighting
  const atsScore = jdKeywords.length > 0 
    ? Math.round(keywordScore * 0.6 + sectionScore * 0.4)
    : sectionScore;


  const skillGaps = detectSkillGaps(missing);

  return {
    atsScore,
    scoreBreakdown: { keywordScore, sectionScore, aiScore: 0 },
    keywords: { detected, missing },
    sections,
    skillGaps,
  };
}

module.exports = { calculateAtsScore, extractJDKeywords };
