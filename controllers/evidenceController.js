// controllers/evidenceController.js
const Evidence = require('../models/Evidence');
const Case = require('../models/Case');

exports.createEvidence = async (req, res) => {
  try {
    const user = req.user;
    const { case: caseId } = req.body;

    // Verifica se o caso existe
    const caso = await Case.findById(caseId);
    if (!caso) return res.status(404).json({ error: 'Caso não encontrado' });

    // Se for assistente, deve estar vinculado ao caso para adicionar evidência
    if (user.role === 'assistente') {
      const pertence = caso.assistentes.some(id => id.equals(user._id));
      if (!pertence) {
        return res.status(403).json({ error: 'Você não pode adicionar evidência a este caso.' });
      }
    }

    // Perito e admin podem adicionar normalmente
    const evidence = new Evidence(req.body);
    await evidence.save();
    res.status(201).json(evidence);
  } catch (error) {
    console.error('Erro ao criar evidência:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.getAllEvidence = async (req, res) => {
  try {
    // Admin vê tudo
    // Perito e assistente só vêem evidências dos casos a que têm acesso

    let evidences;

    if (req.user.role === 'admin') {
      evidences = await Evidence.find().populate('case');
    } else if (req.user.role === 'perito') {
      // perito vê evidências dos casos que ele criou (assignedUser)
      const casosDoPerito = await Case.find({ assignedUser: req.user._id });
      const caseIds = casosDoPerito.map(c => c._id);
      evidences = await Evidence.find({ case: { $in: caseIds } }).populate('case');
    } else if (req.user.role === 'assistente') {
      // assistente vê evidências dos casos que participa
      const casosDoAssistente = await Case.find({ assistentes: req.user._id });
      const caseIds = casosDoAssistente.map(c => c._id);
      evidences = await Evidence.find({ case: { $in: caseIds } }).populate('case');
    } else {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    res.status(200).json(evidences);
  } catch (error) {
    console.error('Erro ao obter evidências:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.getEvidenceById = async (req, res) => {
  try {
    const evidence = await Evidence.findById(req.params.id).populate('case');
    if (!evidence) {
      return res.status(404).json({ error: 'Evidência não encontrada' });
    }

    // Verifica permissão de acesso à evidência
    const caso = await Case.findById(evidence.case);
    if (!caso) return res.status(404).json({ error: 'Caso da evidência não encontrado' });

    if (req.user.role === 'assistente' && !caso.assistentes.some(id => id.equals(req.user._id))) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    if (req.user.role === 'perito' && !caso.assignedUser.equals(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    res.status(200).json(evidence);
  } catch (error) {
    console.error('Erro ao buscar evidência:', error);
    res.status(400).json({ error: error.message });
  }
};

// Atualizar evidência — só admin ou perito
exports.updateEvidence = async (req, res) => {
  try {
    const user = req.user;
    if (user.role !== 'admin' && user.role !== 'perito') {
      return res.status(403).json({ error: 'Você não tem permissão para atualizar evidências.' });
    }

    const evidence = await Evidence.findById(req.params.id);
    if (!evidence) return res.status(404).json({ error: 'Evidência não encontrada' });

    // Opcional: confirmar se o perito é dono do caso da evidência (segurança extra)
    if (user.role === 'perito') {
      const caso = await Case.findById(evidence.case);
      if (!caso.assignedUser.equals(user._id)) {
        return res.status(403).json({ error: 'Você não pode atualizar evidência de caso que não é seu.' });
      }
    }

    Object.assign(evidence, req.body);
    await evidence.save();
    res.status(200).json(evidence);
  } catch (error) {
    console.error('Erro ao atualizar evidência:', error);
    res.status(400).json({ error: error.message });
  }
};

// Deletar evidência — só admin ou perito
exports.deleteEvidence = async (req, res) => {
  try {
    const user = req.user;
    if (user.role !== 'admin' && user.role !== 'perito') {
      return res.status(403).json({ error: 'Você não tem permissão para deletar evidências.' });
    }

    const evidence = await Evidence.findById(req.params.id);
    if (!evidence) return res.status(404).json({ error: 'Evidência não encontrada' });

    if (user.role === 'perito') {
      const caso = await Case.findById(evidence.case);
      if (!caso.assignedUser.equals(user._id)) {
        return res.status(403).json({ error: 'Você não pode deletar evidência de caso que não é seu.' });
      }
    }

    await Evidence.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Evidência deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar evidência:', error);
    res.status(400).json({ error: error.message });
  }
};
