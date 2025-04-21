const mongoose = require('mongoose');

const EvidenceSchema = new mongoose.Schema({
  case: { type: mongoose.Schema.Types.ObjectId, ref: 'Case', required: true }, // Referência ao caso
  imageUrl: { type: String }, // URL da imagem
  videoUrl: { type: String }, // URL do vídeo
  documentUrl: { type: String }, // URL do documento
  latitude: { type: Number, required: true }, // Latitude da localização
  longitude: { type: Number, required: true }, // Longitude da localização
  description: { type: String, required: true }, // Descrição da evidência
  collectionDate: { type: Date, required: true }, // Data da coleta
  collectionTime: { type: String, required: true }, // Hora da coleta
  attachment: { type: String }, // Adição de anexo
});

module.exports = mongoose.model('Evidence', EvidenceSchema);