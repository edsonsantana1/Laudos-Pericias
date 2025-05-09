const Evidence = require('../models/Evidence');

// Criar nova evidência
exports.createEvidence = async (req, res) => {
  try {
    const evidence = new Evidence(req.body);
    await evidence.save();
    res.status(201).json(evidence);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obter todas as evidências
exports.getAllEvidence = async (req, res) => {
  try {
    const evidences = await Evidence.find().populate('case');
    res.status(200).json(evidences);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obter evidência por ID
exports.getEvidenceById = async (req, res) => {
  try {
    const evidence = await Evidence.findById(req.params.id).populate('case');
    if (!evidence) {
      return res.status(404).json({ error: 'Evidence not found' });
    }
    res.status(200).json(evidence);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Atualizar evidência por ID
exports.updateEvidence = async (req, res) => {
  try {
    const evidence = await Evidence.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!evidence) {
      return res.status(404).json({ error: 'Evidence not found' });
    }
    res.status(200).json(evidence);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Deletar evidência por ID
exports.deleteEvidence = async (req, res) => {
  try {
    const evidence = await Evidence.findByIdAndDelete(req.params.id);
    if (!evidence) {
      return res.status(404).json({ error: 'Evidence not found' });
    }
    res.status(200).json({ message: 'Evidence deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
