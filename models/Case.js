const mongoose = require('mongoose');

const CaseSchema = new mongoose.Schema({
  caseId: { type: String, required: true, unique: true },
  status: {
    type: String,
    enum: ['em andamento', 'finalizado', 'arquivado'],
    default: 'em andamento'
  },
  description: { type: String, required: true },
  patientName: { type: String, required: true },
  patientDOB: { type: Date, required: true },
  patientAge: { type: Number, required: true },
  patientGender: {
    type: String,
    enum: ['masculino', 'feminino', 'outro'],
    required: true
  },
  patientID: { type: String, required: true },
  patientContact: { type: String },
  incidentDate: { type: Date, required: true },
  incidentLocation: { type: String, required: true },
  incidentDescription: { type: String, required: true },
  incidentWeapon: { type: String },

  assignedUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  assistentes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // array de usuários assistentes
  evidencias: [{ type: String }], // array de evidências, pode ajustar para um objeto mais complexo se quiser

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Case', CaseSchema);
