const Case = require('../models/Case');

exports.createCase = async (req, res) => {
  const { titulo, descricao, status } = req.body;
  try {
    const newCase = new Case({ titulo, descricao, status, user: req.user.id });
    const savedCase = await newCase.save();
    res.json(savedCase);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

exports.getCases = async (req, res) => {
  try {
    const cases = await Case.find({ user: req.user.id });
    res.json(cases);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

exports.updateCase = async (req, res) => {
  const { titulo, descricao, status } = req.body;
  try {
    let foundCase = await Case.findById(req.params.id);
    if (!foundCase) {
      return res.status(404).json({ msg: 'Caso não encontrado' });
    }
    foundCase.titulo = titulo || foundCase.titulo;
    foundCase.descricao = descricao || foundCase.descricao;
    foundCase.status = status || foundCase.status;
    const updatedCase = await foundCase.save();
    res.json(updatedCase);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

exports.deleteCase = async (req, res) => {
  try {
    let foundCase = await Case.findById(req.params.id);
    if (!foundCase) {
      return res.status(404).json({ msg: 'Caso não encontrado' });
    }
    await foundCase.remove();
    res.json({ msg: 'Caso removido' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};
