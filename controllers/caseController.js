// controllers/caseController.js
const Case = require('../models/Case');

// Criar caso — apenas admin e perito
exports.createCase = async (req, res) => {
  try {
    if (!['admin', 'perito'].includes(req.user.role)) {
      return res.status(403).json({ msg: 'Acesso negado!' });
    }
    const novoCaso = new Case({
      ...req.body,
      assignedUser: req.user._id // perito que cria
    });
    const saved = await novoCaso.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('Erro ao criar caso:', err);
    res.status(500).json({ error: 'Erro no servidor' });
  }
};

// Listar todos os casos — admin, perito, assistente (todos veem tudo)
exports.getCases = async (req, res) => {
  try {
    if (!['admin', 'perito', 'assistente'].includes(req.user.role)) {
      return res.status(403).json({ msg: 'Acesso negado!' });
    }

    const casos = await Case.find().populate('assignedUser').populate('assistentes');

    if (!casos.length) {
      return res.status(404).json({ msg: 'Nenhum caso encontrado.' });
    }
    return res.status(200).json(casos);
  } catch (err) {
    console.error('Erro ao obter casos:', err);
    return res.status(500).json({ error: 'Erro no servidor' });
  }
};

// Visualizar caso por ID — qualquer autenticado que tenha acesso
exports.getCaseById = async (req, res) => {
  try {
    const caso = await Case.findById(req.params.id).populate('assignedUser').populate('assistentes');
    if (!caso) {
      return res.status(404).json({ msg: 'Caso não encontrado' });
    }

    // Assistente pode visualizar todos sem restrição
    // Se quiser controle mais rígido, pode verificar vinculo

    return res.status(200).json(caso);
  } catch (err) {
    console.error('Erro ao buscar caso:', err);
    return res.status(500).json({ error: 'Erro no servidor' });
  }
};

// Atualizar caso — só admin ou perito dono
exports.updateCase = async (req, res) => {
  try {
    const foundCase = await Case.findById(req.params.id);
    if (!foundCase) {
      return res.status(404).json({ msg: 'Caso não encontrado' });
    }

    if (
      req.user.role !== 'admin' &&
      !(req.user.role === 'perito' && foundCase.assignedUser.equals(req.user._id))
    ) {
      return res.status(403).json({ msg: 'Acesso negado!' });
    }

    Object.assign(foundCase, req.body);
    const updated = await foundCase.save();
    return res.status(200).json(updated);
  } catch (err) {
    console.error('Erro ao atualizar caso:', err);
    return res.status(500).json({ error: 'Erro no servidor' });
  }
};

// Deletar caso — apenas admin
exports.deleteCase = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Acesso negado!' });
    }

    const deleted = await Case.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ msg: 'Caso não encontrado' });
    }

    return res.status(200).json({ msg: 'Caso deletado com sucesso' });
  } catch (err) {
    console.error('Erro ao deletar caso:', err);
    return res.status(500).json({ error: 'Erro no servidor' });
  }
};

// Adicionar evidência — admin, perito e assistente (assistente só se vinculado ao caso)
exports.addEvidence = async (req, res) => {
  try {
    const caso = await Case.findById(req.params.id);
    if (!caso) {
      return res.status(404).json({ msg: 'Caso não encontrado' });
    }

    // Se for assistente, só pode adicionar se for assistente do caso
    if (
      req.user.role === 'assistente' &&
      !caso.assistentes.some(id => id.equals(req.user._id))
    ) {
      return res.status(403).json({ msg: 'Acesso negado! Você não pertence a este caso.' });
    }

    caso.evidencias = caso.evidencias || [];
    caso.evidencias.push(req.body.evidencia); // supondo que venha no corpo

    await caso.save();

    return res.status(200).json({ msg: 'Evidência adicionada com sucesso.' });
  } catch (err) {
    console.error('Erro ao adicionar evidência:', err);
    return res.status(500).json({ error: 'Erro no servidor' });
  }
};
