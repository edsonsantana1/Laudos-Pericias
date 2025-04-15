const mongoose = require('mongoose');

const CaseSchema = new mongoose.Schema({
  caseId: { type: String, required: true, unique: true }, // ID único do Caso
  status: { type: String, enum: ['em andamento', 'finalizado', 'arquivado'], default: 'em andamento' }, // Status
  description: { type: String, required: true }, // Descrição do Caso
  patientName: { type: String, required: true }, // Nome do Paciente
  patientDOB: { type: Date, required: true }, // Data de Nascimento do Paciente
  patientAge: { type: Number, required: true }, // Idade do Paciente
  patientGender: { type: String, enum: ['masculino', 'feminino', 'outro'], required: true }, // Gênero
  patientID: { type: String, required: true }, // Documento de Identidade do Paciente
  patientContact: { type: String }, // Contato do Paciente
  expertName: { type: String, required: true }, // Nome do Perito
  expertRegistration: { type: String, required: true }, // Registro Profissional do Perito
  expertContact: { type: String }, // Contato do Perito
  incidentDate: { type: Date, required: true }, // Data do Incidente
  incidentLocation: { type: String, required: true }, // Local do Incidente
  incidentDescription: { type: String, required: true }, // Descrição do Incidente
  incidentWeapon: { type: String }, // Instrumento/Arma do Incidente (opcional)
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Referência ao Usuário
  createdAt: { type: Date, default: Date.now } // Data e Hora de Criação
});

module.exports = mongoose.model('Case', CaseSchema);