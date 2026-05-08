const mongoose = require('mongoose');

const KeywordSchema = new mongoose.Schema({
  word: String,
  found: Boolean,
  importance: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
});

const SectionSchema = new mongoose.Schema({
  name: String,
  present: Boolean,
  score: Number,
});

const AnalysisSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    resumeText: {

      type: String,
      required: true,
    },
    jobDescription: {
      type: String,
      required: false,
    },
    fileName: {
      type: String,
      default: 'resume.pdf',
    },
    atsScore: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
    },
    scoreBreakdown: {
      keywordScore: { type: Number, default: 0 },
      sectionScore: { type: Number, default: 0 },
      aiScore: { type: Number, default: 0 },
    },
    keywords: {
      detected: [KeywordSchema],
      missing: [KeywordSchema],
    },
    sections: [SectionSchema],
    strengths: [String],
    weaknesses: [String],
    recommendations: [
      {
        title: String,
        description: String,
        priority: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
      },
    ],
    skillGaps: [
      {
        skill: String,
        category: String,
        importance: String,
      },
    ],
    optimizedBullets: [
      {
        original: String,
        improved: String,
      },
    ],
    roadmap: {
      projects: [
        {
          title: String,
          description: String,
          difficulty: String,
        },
      ],
      certifications: [
        {
          title: String,
          provider: String,
          link: String,
        },
      ],
    },
    jobTitle: String,
    industry: String,
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'completed',
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
AnalysisSchema.index({ createdAt: -1 });
AnalysisSchema.index({ atsScore: -1 });

module.exports = mongoose.model('Analysis', AnalysisSchema);
