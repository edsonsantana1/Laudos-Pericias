const Case = require('../models/Case');

// 1. Criar caso — apenas admin e perito
exports.createCase = async (req, res) => {
  try {
    const novoCaso = new Case({
      ...req.body,
      assignedUser: req.user.id // o perito criador
    });
    const saved = await novoCaso.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('Erro ao criar caso:', err);
    res.status(500).json({ error: 'Erro no servidor' });
  }
};

// 2. Listar todos os casos — admin, perito, assistente
exports.getCases = async (req, res) => {
  try {
    if (!['admin','perito','assistente'].includes(req.user.role)) {
      return res.status(403).json({ msg: 'Acesso negado!' });
    }
    const cases = await Case.find().populate('assignedUser');
    if (!cases.length) {
      return res.status(404).json({ msg: 'Nenhum caso encontrado.' });
    }
    return res.status(200).json(cases);
  } catch (err) {
    console.error('Erro ao obter casos:', err);
    return res.status(500).json({ error: 'Erro no servidor' });
  }
};

// 3. Visualizar caso por ID — qualquer autenticado
exports.getCaseById = async (req, res) => {
  try {
    const caso = await Case.findById(req.params.id).populate('assignedUser');
    if (!caso) {
      return res.status(404).json({ msg: 'Caso não encontrado' });
    }
    return res.status(200).json(caso);
  } catch (err) {
    console.error('Erro ao buscar caso:', err);
    return res.status(500).json({ error: 'Erro no servidor' });
  }
};

// 4. Atualizar caso — só admin ou perito dono
exports.updateCase = async (req, res) => {
  try {
    const foundCase = await Case.findById(req.params.id);
    if (!foundCase) {
      return res.status(404).json({ msg: 'Caso não encontrado' });
    }

    if (
      req.user.role !== 'admin' &&
      !(req.user.role === 'perito' && foundCase.assignedUser.equals(req.user.id))
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

// 5. Deletar caso — apenas admin
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
