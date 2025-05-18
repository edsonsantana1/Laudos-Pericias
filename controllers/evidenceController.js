const Evidence = require('../models/Evidence');
const Case = require('../models/Case');

// Criar nova evidência
exports.createEvidence = async (req, res) => {
  try {
    const user = req.user;
    const { case: caseId } = req.body;

    // Verifica se o caso existe
    const caso = await Case.findById(caseId);
    if (!caso) return res.status(404).json({ error: 'Caso não encontrado' });

    // Se for assistente, precisa estar vinculado ao caso
    if (user.role === 'assistente') {
      const pertence = caso.assistentes.some(id => id.toString() === user._id.toString());
      if (!pertence) {
        return res.status(403).json({ error: 'Você não pode adicionar evidência a este caso.' });
      }
    }

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
      return res.status(404).json({ error: 'Evidência não encontrada' });
    }
    res.status(200).json(evidence);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Atualizar evidência por ID — somente admin ou perito
exports.updateEvidence = async (req, res) => {
  try {
    const user = req.user;
    if (user.role !== 'admin' && user.role !== 'perito') {
      return res.status(403).json({ error: 'Você não tem permissão para atualizar evidências.' });
    }

    const evidence = await Evidence.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!evidence) {
      return res.status(404).json({ error: 'Evidência não encontrada' });
    }
    res.status(200).json(evidence);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Deletar evidência por ID — somente admin ou perito
exports.deleteEvidence = async (req, res) => {
  try {
    const user = req.user;
    if (user.role !== 'admin' && user.role !== 'perito') {
      return res.status(403).json({ error: 'Você não tem permissão para deletar evidências.' });
    }

    const evidence = await Evidence.findByIdAndDelete(req.params.id);
    if (!evidence) {
      return res.status(404).json({ error: 'Evidência não encontrada' });
    }
    res.status(200).json({ message: 'Evidência deletada com sucesso' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
