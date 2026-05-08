export const INDUSTRIES = [
  { id: 'software_engineering', label: 'Software Engineering' },
  { id: 'data_science', label: 'Data Science & AI' },
  { id: 'medical', label: 'Medical & Healthcare' },
  { id: 'marketing', label: 'Marketing & Sales' },
  { id: 'finance', label: 'Finance & Accounting' },
  { id: 'operations', label: 'Operations & HR' },
];

export const BENCHMARKS = {
  software_engineering: {
    keywords: [
      'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'SQL', 'Git',
      'AWS', 'Docker', 'REST API', 'Agile', 'System Design', 'Testing',
    ],
    skillGaps: [
      { skill: 'System Design', category: 'Engineering', importance: 'high' },
      { skill: 'Cloud (AWS/Azure)', category: 'Infrastructure', importance: 'high' },
      { skill: 'Unit Testing', category: 'Quality', importance: 'medium' },
    ]
  },
  data_science: {
    keywords: [
      'Python', 'Machine Learning', 'SQL', 'Statistics', 'NLP', 'PyTorch',
      'TensorFlow', 'Data Visualization', 'Pandas', 'Scikit-Learn', 'R',
    ],
    skillGaps: [
      { skill: 'Deep Learning', category: 'AI', importance: 'high' },
      { skill: 'Big Data Tools', category: 'Data', importance: 'medium' },
      { skill: 'Cloud Deployment', category: 'Engineering', importance: 'medium' },
    ]
  },
  medical: {
    keywords: [
      'Patient Care', 'HIPAA', 'Clinical Records', 'Diagnostics', 'CPR',
      'EMR Software', 'Health Informatics', 'Triage', 'Medical Ethics',
    ],
    skillGaps: [
      { skill: 'Specialized Certification', category: 'License', importance: 'high' },
      { skill: 'Digital Health Tools', category: 'Technology', importance: 'medium' },
    ]
  },
  marketing: {
    keywords: [
      'SEO', 'Content Strategy', 'Google Analytics', 'CRM', 'B2B Marketing',
      'Copywriting', 'E-mail Marketing', 'Brand Identity', 'PPC', 'Social Media',
    ],
    skillGaps: [
      { skill: 'Data Analytics', category: 'Performance', importance: 'high' },
      { skill: 'Automation Tools', category: 'Technology', importance: 'medium' },
    ]
  },
  finance: {
    keywords: [
      'Financial Analysis', 'Excel', 'GAAP', 'Risk Management', 'Auditing',
      'Budgeting', 'Tax Compliance', 'Equity Research', 'QuickBooks',
    ],
    skillGaps: [
      { skill: 'CPA/CFA Certification', category: 'Credential', importance: 'high' },
      { skill: 'Macro-Economic Analysis', category: 'Analysis', importance: 'medium' },
    ]
  },
  operations: {
    keywords: [
      'Project Management', 'Recruitment', 'Lean Six Sigma', 'Employee Relations',
      'Policy Development', 'Conflict Resolution', 'Supply Chain', 'HRIS',
    ],
    skillGaps: [
      { skill: 'Process Optimization', category: 'Operations', importance: 'high' },
      { skill: 'Leadership Development', category: 'Soft Skills', importance: 'medium' },
    ]
  }
};
