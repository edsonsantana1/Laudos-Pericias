const mongoose = require('mongoose');
const CaseSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descricao: { type: String, required: true },
  status: { type: String, enum: ['em andamento', 'finalizado', 'arquivado'], default: 'em andamento' },
  dataAbertura: { type: Date, default: Date.now },
  dataFechamento: { type: Date },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});
module.exports = mongoose.model('Case', CaseSchema);