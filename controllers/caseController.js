// controllers/caseController.js
const Case = require('../models/Case');

// ...

// 1. GET /api/cases — todos podem listar TUDO
exports.getCases = async (req, res) => {
  try {
    // só verifica se está autenticado: admin, perito e assistente sempre entram
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

// 2. PUT /api/cases/:id — só admin ou perito dono podem editar
exports.updateCase = async (req, res) => {
  try {
    const foundCase = await Case.findById(req.params.id);
    if (!foundCase) {
      return res.status(404).json({ msg: 'Caso não encontrado' });
    }

    // somente admin OU perito que criou podem editar
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

// 3. DELETE continua só para admin
exports.deleteCase = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Acesso negado!' });
  }
  // resto do código de deleção...
};
