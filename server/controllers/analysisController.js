const multer = require('multer');
const { extractText } = require('../services/pdfParser');
const { calculateAtsScore } = require('../services/atsScorer');
const { analyzeWithAI, optimizeBullets, getFallbackAnalysis } = require('../services/llmService');
const Analysis = require('../models/Analysis');

// Multer configuration - store in memory
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max
  },
  fileFilter: (req, file, cb) => {
    const allowed = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
    ];
    if (allowed.includes(file.mimetype) || file.originalname.match(/\.(pdf|docx|txt)$/i)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, DOCX, and TXT files are allowed'), false);
    }
  },
});

/**
 * POST /api/analysis/analyze
 * Analyze a resume against a job description
 */
const analyzeResume = [
  upload.single('resume'),
  async (req, res) => {
    try {
      const jobDescription = req.body.jobDescription || '';

      // We no longer require JD to be 50+ chars. If it's missing, we do a general analysis.


      if (!req.file) {
        return res.status(400).json({ error: 'Please upload a resume file.' });
      }

      // Extract text from file
      let resumeText;
      try {
        resumeText = await extractText(req.file.buffer, req.file.mimetype, req.file.originalname);
      } catch (err) {
        return res.status(422).json({ error: err.message });
      }

      if (resumeText.length < 100) {
        return res.status(422).json({
          error: 'Could not extract sufficient text from the resume. Please ensure the file is not image-based.',
        });
      }

      // Run algorithmic ATS scoring
      const atsResult = calculateAtsScore(resumeText, jobDescription);

      // Run AI analysis (with fallback)
      let aiResult;
      try {
        aiResult = await analyzeWithAI(resumeText, jobDescription);
      } catch (err) {
        console.warn('AI analysis failed (using fallback):', err.message);
        aiResult = getFallbackAnalysis(
          atsResult.scoreBreakdown.keywordScore,
          atsResult.scoreBreakdown.sectionScore
        );
      }

      // Calculate hybrid final score
      const hasAI = aiResult.aiScore > 0;
      const hasJD = jobDescription.trim().length > 0;

      let finalScore;
      if (hasJD) {
        finalScore = hasAI
          ? Math.round(
              atsResult.scoreBreakdown.keywordScore * 0.45 +
                atsResult.scoreBreakdown.sectionScore * 0.25 +
                aiResult.aiScore * 0.3
            )
          : atsResult.atsScore;
      } else {
        // No JD: re-weight to ignore keywords (which are 0)
        // New weights: Sections 70%, AI 30%
        finalScore = hasAI
          ? Math.round(
              atsResult.scoreBreakdown.sectionScore * 0.7 +
                aiResult.aiScore * 0.3
            )
          : atsResult.scoreBreakdown.sectionScore;
      }


      // Optimize bullets (optional, best-effort)
      let optimizedBullets = [];
      try {
        const hasKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY || process.env.GROQ_API_KEY;
        if (hasKey) {
          optimizedBullets = await optimizeBullets(resumeText, jobDescription);
        }
      } catch (err) {

        console.warn('Bullet optimization failed:', err.message);
      }

      // Build document
      const analysisDoc = {
        resumeText: resumeText.substring(0, 10000), // limit stored text
        jobDescription: jobDescription.substring(0, 5000),
        fileName: req.file.originalname,
        atsScore: finalScore,
        scoreBreakdown: {
          keywordScore: atsResult.scoreBreakdown.keywordScore,
          sectionScore: atsResult.scoreBreakdown.sectionScore,
          aiScore: aiResult.aiScore || 0,
        },
        keywords: atsResult.keywords,
        sections: atsResult.sections,
        strengths: aiResult.strengths || [],
        weaknesses: aiResult.weaknesses || [],
        recommendations: aiResult.recommendations || [],
        skillGaps: atsResult.skillGaps,
        optimizedBullets,
        roadmap: aiResult.roadmap || { projects: [], certifications: [] },
        jobTitle: aiResult.jobTitle || '',
        industry: aiResult.industry || '',
        status: 'completed',
        user: req.user ? req.user.id : null,
      };


      // Save to MongoDB
      const saved = await Analysis.create(analysisDoc);

      res.status(201).json({
        success: true,
        data: saved,
      });
    } catch (err) {
      console.error('Analysis error:', err);
      res.status(500).json({ error: 'Analysis failed. Please try again.' });
    }
  },
];

/**
 * GET /api/analysis/history
 * Get analysis history (paginated)
 */
const getHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = req.user ? { user: req.user.id } : {};

    const [analyses, total] = await Promise.all([
      Analysis.find(filter, {

        resumeText: 0, // exclude large text fields from list
        jobDescription: 0,
      })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Analysis.countDocuments(),
    ]);

    res.json({
      success: true,
      data: analyses,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error('History error:', err);
    res.status(500).json({ error: 'Failed to fetch history.' });
  }
};

/**
 * GET /api/analysis/:id
 * Get single analysis
 */
const getAnalysis = async (req, res) => {
  try {
    const filter = req.user ? { _id: req.params.id, user: req.user.id } : { _id: req.params.id };
    const analysis = await Analysis.findOne(filter).lean();
    if (!analysis) {

      return res.status(404).json({ error: 'Analysis not found.' });
    }
    res.json({ success: true, data: analysis });
  } catch (err) {
    console.error('Get analysis error:', err);
    res.status(500).json({ error: 'Failed to fetch analysis.' });
  }
};

/**
 * DELETE /api/analysis/:id
 * Delete an analysis
 */
const deleteAnalysis = async (req, res) => {
  try {
    const filter = req.user ? { _id: req.params.id, user: req.user.id } : { _id: req.params.id };
    const deleted = await Analysis.findOneAndDelete(filter);
    if (!deleted) {

      return res.status(404).json({ error: 'Analysis not found.' });
    }
    res.json({ success: true, message: 'Analysis deleted.' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ error: 'Failed to delete analysis.' });
  }
};

module.exports = { analyzeResume, getHistory, getAnalysis, deleteAnalysis };
