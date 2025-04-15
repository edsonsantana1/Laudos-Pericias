const mongoose = require('mongoose');

const RelatorioSchema = new mongoose.Schema({
  case: { type: mongoose.Schema.Types.ObjectId, ref: 'Case', required: true }, // Referência ao caso
  reportDate: { type: Date, required: true }, // Data do relatório
  summary: { type: String, required: true }, // Resumo do caso
  actionsTaken: { type: String, required: true }, // Ações realizadas
  recommendations: { type: String, required: true }, // Recomendações futuras
});

module.exports = mongoose.model('Relatorio', RelatorioSchema);