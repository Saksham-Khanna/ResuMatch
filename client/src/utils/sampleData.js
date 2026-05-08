export const SAMPLE_DATA = {
  fileName: "John_Doe_Resume.pdf",
  jobTitle: "Senior Frontend Engineer",
  createdAt: new Date().toISOString(),
  atsScore: 72,
  scoreBreakdown: {
    sectionScore: 85,
    keywordScore: 65,
    formattingScore: 90,
    impactScore: 60
  },
  sections: [
    { name: "Contact Info", status: "found", score: 100 },
    { name: "Experience", status: "found", score: 90 },
    { name: "Education", status: "found", score: 100 },
    { name: "Skills", status: "found", score: 80 },
    { name: "Summary", status: "missing", score: 0 }
  ],
  strengths: [
    "Strong technical stack (React, TypeScript, Node.js)",
    "Clear project descriptions with measurable outcomes",
    "Excellent formatting and ATS readability",
    "Consistent work history in relevant roles"
  ],
  weaknesses: [
    "Missing professional summary section",
    "Some action verbs are passive (e.g., 'Responsible for')",
    "Keyword density for 'Cloud Architecture' is low",
    "Lack of open-source or community contributions mentioned"
  ],
  keywords: {
    detected: ["React", "TypeScript", "Node.js", "GraphQL", "Tailwind CSS", "Jest", "Git"],
    missing: ["AWS", "Docker", "CI/CD", "System Design", "Kubernetes", "Microservices"]
  },
  skillGaps: [
    { skill: "AWS / Cloud Infrastructure", gap: "High", impact: "Critical for Senior roles" },
    { skill: "Containerization (Docker)", gap: "Medium", impact: "High" },
    { skill: "Unit Testing (Cypress)", gap: "Low", impact: "Preferred" }
  ],
  optimizedBullets: [
    {
      original: "Responsible for building the user interface for the main dashboard.",
      improved: "Engineered a high-performance React dashboard using Tailwind CSS, improving load times by 40% and increasing user engagement by 15%."
    },
    {
      original: "Worked on fixing bugs in the legacy codebase.",
      improved: "Identified and resolved 50+ critical performance bottlenecks in legacy JavaScript codebase, reducing crash rates by 22%."
    }
  ],
  recommendations: [
    "Add a 3-4 sentence professional summary at the top to highlight your years of experience.",
    "Quantify your achievements more—use percentages and dollar amounts where possible.",
    "Include certifications for AWS or Cloud Practitioners to bridge the current skill gap.",
    "Ensure your LinkedIn profile is updated and matches the resume content."
  ],
  roadmap: [
    { step: "Immediate Fixes", task: "Add Professional Summary and fix passive verbs", time: "1 hour" },
    { step: "Skill Upgrading", task: "Complete a basic Docker/AWS certification", time: "1-2 weeks" },
    { step: "Experience Polish", task: "Add 2-3 metric-driven bullets to current role", time: "2 hours" }
  ]
};
