const mongoose = require('mongoose');

const EvidenceSchema = new mongoose.Schema({
  case: { type: mongoose.Schema.Types.ObjectId, ref: 'Case' },
  imageUrl: { type: String, required: true },
  description: { type: String },
});

module.exports = mongoose.model('Evidence', EvidenceSchema);