const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true },
  role: { type: String, enum: ['admin', 'perito', 'assistente'], default: 'assistente' },
  matricula: { type: String, required: true, unique: true }, // Matrícula única
});

module.exports = mongoose.model('User', UserSchema);
