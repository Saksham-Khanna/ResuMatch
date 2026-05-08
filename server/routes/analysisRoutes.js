const express = require('express');
const router = express.Router();
const {
  analyzeResume,
  getHistory,
  getAnalysis,
  deleteAnalysis,
} = require('../controllers/analysisController');

const { protect, optionalAuth } = require('../middleware/authMiddleware');
const rateLimit = require('express-rate-limit');

const analysisLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP or user to 3 requests per `window`
  keyGenerator: (req) => {
    return req.user ? req.user.id : req.ip;
  },
  skip: (req) => {
    return req.user && req.user.isPro;
  },
  message: { error: 'Free tier is limited to 3 analyses per hour. Upgrade to Pro for unlimited analyses.' }
});

// POST /api/analysis/analyze
router.post('/analyze', optionalAuth, analysisLimiter, analyzeResume);

// GET /api/analysis/history
router.get('/history', protect, getHistory);

// GET /api/analysis/:id
router.get('/:id', optionalAuth, getAnalysis);

// DELETE /api/analysis/:id
router.delete('/:id', protect, deleteAnalysis);

module.exports = router;
