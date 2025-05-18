// controllers/relatorioController.js
const Relatorio = require('../models/Relatorio');
const Case = require('../models/Case');

exports.createRelatorio = async (req, res) => {
  try {
    const { case: caseId, reportDate, title, description } = req.body;

    const foundCase = await Case.findById(caseId);
    if (!foundCase) {
      return res.status(404).json({ error: 'Caso não encontrado' });
    }

    // Verificar permissão para criar relatório:
    // só admin, perito dono do caso ou assistente vinculado ao caso
    const user = req.user;
    const podeCriar =
      user.role === 'admin' ||
      (user.role === 'perito' && foundCase.assignedUser.equals(user._id)) ||
      (user.role === 'assistente' && foundCase.assistentes.some(a => a.equals(user._id)));

    if (!podeCriar) {
      return res.status(403).json({ error: 'Acesso negado para criar relatório neste caso.' });
    }

    const relatorio = new Relatorio({
      case: caseId,
      user: foundCase.user, // manter o usuário do caso
      reportDate,
      title,
      description,
    });

    await relatorio.save();
    return res.status(201).json(relatorio);
  } catch (error) {
    console.error('Erro ao criar relatório:', error);
    return res.status(400).json({ error: error.message });
  }
};

exports.getAllRelatorios = async (req, res) => {
  try {
    const user = req.user;
    let relatorios;

    if (user.role === 'admin') {
      relatorios = await Relatorio.find().populate('case');
    } else if (user.role === 'perito') {
      // pegar relatórios dos casos do perito
      const casos = await Case.find({ assignedUser: user._id });
      const caseIds = casos.map(c => c._id);
      relatorios = await Relatorio.find({ case: { $in: caseIds } }).populate('case');
    } else if (user.role === 'assistente') {
      // relatórios dos casos onde assistente participa
      const casos = await Case.find({ assistentes: user._id });
      const caseIds = casos.map(c => c._id);
      relatorios = await Relatorio.find({ case: { $in: caseIds } }).populate('case');
    } else {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    res.status(200).json(relatorios);
  } catch (error) {
    console.error('Erro ao obter relatórios:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.getRelatorioById = async (req, res) => {
  try {
    const relatorio = await Relatorio.findById(req.params.id).populate('case');
    if (!relatorio) {
      return res.status(404).json({ error: 'Relatório não encontrado' });
    }

    const user = req.user;
    const foundCase = await Case.findById(relatorio.case._id);

    // Verifica permissão para visualizar
    const podeVer =
      user.role === 'admin' ||
      (user.role === 'perito' && foundCase.assignedUser.equals(user._id)) ||
      (user.role === 'assistente' && foundCase.assistentes.some(a => a.equals(user._id)));

    if (!podeVer) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    res.status(200).json(relatorio);
  } catch (error) {
    console.error('Erro ao buscar relatório:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.updateRelatorio = async (req, res) => {
  try {
    const relatorio = await Relatorio.findById(req.params.id);
    if (!relatorio) {
      return res.status(404).json({ error: 'Relatório não encontrado' });
    }

    const foundCase = await Case.findById(relatorio.case);

    const user = req.user;
    // Só admin e perito dono do caso podem atualizar
    const podeAtualizar =
      user.role === 'admin' ||
      (user.role === 'perito' && foundCase.assignedUser.equals(user._id));

    if (!podeAtualizar) {
      return res.status(403).json({ error: 'Acesso negado para atualizar este relatório.' });
    }

    Object.assign(relatorio, req.body);
    await relatorio.save();
    res.status(200).json(relatorio);
  } catch (error) {
    console.error('Erro ao atualizar relatório:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.deleteRelatorio = async (req, res) => {
  try {
    const relatorio = await Relatorio.findById(req.params.id);
    if (!relatorio) {
      return res.status(404).json({ error: 'Relatório não encontrado' });
    }

    const foundCase = await Case.findById(relatorio.case);

    const user = req.user;
    // Só admin e perito dono do caso podem deletar
    const podeDeletar =
      user.role === 'admin' ||
      (user.role === 'perito' && foundCase.assignedUser.equals(user._id));

    if (!podeDeletar) {
      return res.status(403).json({ error: 'Acesso negado para deletar este relatório.' });
    }

    await Relatorio.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Relatório deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar relatório:', error);
    res.status(400).json({ error: error.message });
  }
};
