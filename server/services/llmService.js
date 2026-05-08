const { GoogleGenerativeAI } = require('@google/generative-ai');

let geminiModel = null;

function getClient() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured in .env');
  }
  
  if (!geminiModel) {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    geminiModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }
  return geminiModel;
}


/**
 * Get full AI analysis of resume vs job description
 */
async function analyzeWithAI(resumeText, jobDescription) {
  const model = getClient();

  const prompt = `You are an expert ATS (Applicant Tracking System) analyzer and career coach.

Analyze this resume ${jobDescription.trim() ? 'against the job description' : 'and provide general career feedback'} and respond with ONLY a valid JSON object (no markdown, no explanation).

${jobDescription.trim() ? `Job Description:\n${jobDescription.substring(0, 2000)}` : 'No job description provided. Provide general resume best practices and feedback.'}


Resume:
${resumeText.substring(0, 3000)}

Respond with this exact JSON structure:
{
  "aiScore": <number 0-100, representing AI assessment of fit>,
  "jobTitle": "<detected job title from JD>",
  "industry": "<detected industry>",
  "strengths": [
    "<specific strength 1 based on resume content>",
    "<specific strength 2>",
    "<specific strength 3>",
    "<specific strength 4>"
  ],
  "weaknesses": [
    "<specific weakness/gap 1>",
    "<specific weakness/gap 2>",
    "<specific weakness/gap 3>"
  ],
  "recommendations": [
    {
      "title": "<Short action title>",
      "description": "<Specific actionable recommendation with details>",
      "priority": "high"
    },
    {
      "title": "<Short action title>",
      "description": "<Specific actionable recommendation>",
      "priority": "medium"
    },
    {
      "title": "<Short action title>",
      "description": "<Specific actionable recommendation>",
      "priority": "medium"
    },
    {
      "title": "<Short action title>",
      "description": "<Specific actionable recommendation>",
      "priority": "low"
    }
  ],
  "roadmap": {
    "projects": [
      {
        "title": "<Project title>",
        "description": "<A specific project idea that fills your skill gaps>",
        "difficulty": "<Beginner|Intermediate|Advanced>"
      },
      { "title": "<Project 2>", "description": "<Description>", "difficulty": "<Difficulty>" }
    ],
    "certifications": [
      {
        "title": "<Certification name>",
        "provider": "<e.g., Coursera, AWS, Google>",
        "link": "<Relevant search link or name>"
      }
    ]
  }
}`;

  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: 'application/json',
    },
  });

  const text = result.response.text() || '{}';
  return JSON.parse(text);
}

/**
 * Optimize resume bullet points using AI
 */
async function optimizeBullets(resumeText, jobDescription) {
  const model = getClient();

  // Extract bullet points from resume
  const bulletPattern = /^[\s]*[•\-\*\–\—]\s*(.+)$/gm;
  const bullets = [];
  let match;
  while ((match = bulletPattern.exec(resumeText)) !== null && bullets.length < 5) {
    if (match[1].length > 20) bullets.push(match[1].trim());
  }

  if (bullets.length === 0) {
    return [];
  }

const prompt = `You are a professional resume writer. Improve these resume bullet points to be more impactful.
Use strong action verbs, quantify achievements where possible, and ${jobDescription.trim() ? 'align with the job description' : 'optimize for clarity and impact'}.

${jobDescription.trim() ? `Job Description (first 500 chars): ${jobDescription.substring(0, 500)}` : 'No job description provided. Focus on general professional standards.'}

Bullet points to improve (max 5):
${bullets.map((b, i) => `${i + 1}. ${b}`).join('\n')}

Respond with ONLY a valid JSON object in this exact format:
{
  "bullets": [
    {"original": "<original bullet 1>", "improved": "<improved version>"}
  ]
}`;

  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: 'application/json',
    },
  });

  const text = result.response.text() || '{"bullets":[]}';
  const parsed = JSON.parse(text);
  return Array.isArray(parsed.bullets) ? parsed.bullets : [];
}

/**
 * Fallback analysis when no API key is set
 */
function getFallbackAnalysis(keywordScore, sectionScore) {
  const score = keywordScore === 0 ? sectionScore : Math.round(keywordScore * 0.5 + sectionScore * 0.5);

  return {
    aiScore: score,
    jobTitle: 'Software Engineer',
    industry: 'Technology',
    strengths: [
      'Resume contains relevant keywords for the position',
      'Educational background aligns with requirements',
      'Technical skills section is present and structured',
      'Professional experience clearly outlined',
    ],
    weaknesses: [
      'Some key skills from the job description are missing',
      'Bullet points could be more quantified with metrics',
      'Consider adding more industry-specific keywords',
    ],
    recommendations: [
      { title: 'Quantify Achievements', description: 'Add metrics (%, $, numbers) to your bullet points.', priority: 'high' },
      { title: 'Keyword Optimization', description: 'Include more skills from the job description.', priority: 'medium' }
    ],
    roadmap: {
      projects: [
        {
          title: 'Full-Stack Portfolio Generator',
          description: 'Build a project that automates portfolio creation for developers using React and Node.js.',
          difficulty: 'Intermediate',
        },
        {
          title: 'Server-Side Analytics Engine',
          description: 'Create a lightweight logging and analytics engine to track API performance.',
          difficulty: 'Intermediate',
        },
      ],
      certifications: [
        { title: 'AWS Certified Cloud Practitioner', provider: 'Amazon', link: 'https://aws.amazon.com/certification/' },
        { title: 'Meta Front-End Developer', provider: 'Coursera', link: 'https://www.coursera.org/professional-certificates/meta-front-end-developer' },
      ],
    },
  };
}

module.exports = { analyzeWithAI, optimizeBullets, getFallbackAnalysis };
