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

// Listar todos os casos — admin, perito, assistente
exports.getCases = async (req, res) => {
  try {
    if (!['admin', 'perito', 'assistente'].includes(req.user.role)) {
      return res.status(403).json({ msg: 'Acesso negado!' });
    }

    let casos;

    // Se for assistente, mostrar só casos vinculados a ele
    if (req.user.role === 'assistente') {
      casos = await Case.find({ assistentes: req.user._id }).populate('assignedUser').populate('assistentes');
    } else if (req.user.role === 'perito') {
      // perito vê todos, mas só pode editar os próprios (controle na edição)
      casos = await Case.find().populate('assignedUser').populate('assistentes');
    } else {
      // admin vê todos
      casos = await Case.find().populate('assignedUser').populate('assistentes');
    }

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

    // Verifica permissão para visualizar:
    if (req.user.role === 'assistente' && !caso.assistentes.some(a => a._id.equals(req.user._id))) {
      return res.status(403).json({ msg: 'Acesso negado!' });
    }
    // perito e admin veem todos

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
