const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const path = require('path');

/**
 * Extract text from uploaded file buffer
 * @param {Buffer} buffer - File buffer
 * @param {string} mimetype - File MIME type
 * @param {string} [originalName] - Original filename
 * @returns {Promise<string>} Extracted text
 */
async function extractText(buffer, mimetype, originalName = '') {
  const ext = path.extname(originalName).toLowerCase();

  // PDF extraction
  if (mimetype === 'application/pdf' || ext === '.pdf') {
    const data = await pdfParse(buffer, {
      max: 0, // extract all pages
    });
    return cleanText(data.text);
  }

  // DOCX extraction
  if (
    mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    ext === '.docx'
  ) {
    const result = await mammoth.extractRawText({ buffer });
    return cleanText(result.value);
  }

  // Plain text
  if (mimetype === 'text/plain' || ext === '.txt') {
    return cleanText(buffer.toString('utf-8'));
  }

  throw new Error(`Unsupported file type: ${mimetype || ext}. Please upload a PDF, DOCX, or TXT file.`);
}

/**
 * Clean extracted text
 */
function cleanText(text) {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\n{3,}/g, '\n\n') // collapse excessive newlines
    .replace(/[ \t]{2,}/g, ' ') // collapse spaces/tabs
    .trim();
}

module.exports = { extractText };
