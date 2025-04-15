const Relatorio = require('../models/Relatorio');

// Função para criar um relatório
exports.createRelatorio = async (req, res) => {
  try {
    const relatorio = new Relatorio(req.body);
    await relatorio.save();
    res.status(201).json(relatorio);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Função para obter todos os relatórios
exports.getAllRelatorios = async (req, res) => {
  try {
    const relatorios = await Relatorio.find().populate('case');
    res.status(200).json(relatorios);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Função para obter um relatório por ID
exports.getRelatorioById = async (req, res) => {
  try {
    const relatorio = await Relatorio.findById(req.params.id).populate('case');
    if (!relatorio) {
      return res.status(404).json({ error: 'Relatório não encontrado' });
    }
    res.status(200).json(relatorio);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Função para atualizar um relatório por ID
exports.updateRelatorio = async (req, res) => {
  try {
    const relatorio = await Relatorio.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!relatorio) {
      return res.status(404).json({ error: 'Relatório não encontrado' });
    }
    res.status(200).json(relatorio);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Função para deletar um relatório por ID
exports.deleteRelatorio = async (req, res) => {
  try {
    const relatorio = await Relatorio.findByIdAndDelete(req.params.id);
    if (!relatorio) {
      return res.status(404).json({ error: 'Relatório não encontrado' });
    }
    res.status(200).json({ message: 'Relatório deletado com sucesso' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};