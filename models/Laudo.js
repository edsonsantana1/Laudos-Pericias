const mongoose = require('mongoose');

const LaudoSchema = new mongoose.Schema({
  case: { type: mongoose.Schema.Types.ObjectId, ref: 'Case', required: true }, // Referência ao caso
  reportDate: { type: Date, required: true }, // Data do laudo
  expertName: { type: String, required: true }, // Nome do perito responsável
  findings: { type: String, required: true }, // Constatações
  conclusions: { type: String, required: true }, // Conclusões
});

module.exports = mongoose.model('Laudo', LaudoSchema);