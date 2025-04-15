const Laudo = require('../models/Laudo');

// Função para criar um laudo
exports.createLaudo = async (req, res) => {
  try {
    const laudo = new Laudo(req.body);
    await laudo.save();
    res.status(201).json(laudo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Função para obter todos os laudos
exports.getAllLaudos = async (req, res) => {
  try {
    const laudos = await Laudo.find().populate('case');
    res.status(200).json(laudos);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Função para obter um laudo por ID
exports.getLaudoById = async (req, res) => {
  try {
    const laudo = await Laudo.findById(req.params.id).populate('case');
    if (!laudo) {
      return res.status(404).json({ error: 'Laudo não encontrado' });
    }
    res.status(200).json(laudo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Função para atualizar um laudo por ID
exports.updateLaudo = async (req, res) => {
  try {
    const laudo = await Laudo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!laudo) {
      return res.status(404).json({ error: 'Laudo não encontrado' });
    }
    res.status(200).json(laudo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Função para deletar um laudo por ID
exports.deleteLaudo = async (req, res) => {
  try {
    const laudo = await Laudo.findByIdAndDelete(req.params.id);
    if (!laudo) {
      return res.status(404).json({ error: 'Laudo não encontrado' });
    }
    res.status(200).json({ message: 'Laudo deletado com sucesso' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};