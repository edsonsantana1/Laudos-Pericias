// authController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { nome, email, senha, role } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'Usuário já existe' });
    }
    const matricula = `MAT${Date.now()}`; // Gerar matrícula única
    user = new User({ nome, email, senha, role, matricula });
    const salt = await bcrypt.genSalt(10);
    user.senha = await bcrypt.hash(senha, salt);
    await user.save();
    const payload = { user: { id: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 360000 }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

exports.login = async (req, res) => {
  const { matricula, senha } = req.body; // Alterar para usar matrícula
  try {
    let user = await User.findOne({ matricula });
    if (!user) {
      return res.status(400).json({ msg: 'Credenciais inválidas' });
    }
    const isMatch = await bcrypt.compare(senha, user.senha);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Credenciais inválidas' });
    }
    const payload = { user: { id: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 360000 }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};
