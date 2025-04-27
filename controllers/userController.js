const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Função para gerar uma matrícula única com base no contador sequencial
const gerarMatricula = async () => {
  const prefixo = 'MAT';
  const ano = new Date().getFullYear().toString().slice(-2);
  const totalUsuarios = await User.countDocuments();
  const numeroSequencial = (totalUsuarios + 1).toString().padStart(6, '0');
  return `${prefixo}${ano}${numeroSequencial}`;
};

// Cadastro de novo usuário (por admin)
exports.createUser = async (req, res) => {
  const { nome, email, senha, role } = req.body;
  try {
    if (await User.findOne({ email })) {
      return res.status(400).json({ msg: 'Usuário já existe' });
    }
    const matricula = await gerarMatricula();
    const user = new User({ nome, email, senha, role, matricula });
    const salt = await bcrypt.genSalt(10);
    user.senha = await bcrypt.hash(senha, salt);
    await user.save();
    res.status(201).json({ msg: 'Usuário criado com sucesso', user: { id: user.id, nome: user.nome, email: user.email, role: user.role, matricula } });
  } catch (err) {
    console.error('Erro no createUser:', err);
    res.status(500).json({ msg: 'Erro no servidor' });
  }
};

// Listar todos os usuários (admin)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-senha -refreshToken'); // não expor senha nem refreshToken
    res.status(200).json(users);
  } catch (err) {
    console.error('Erro no getAllUsers:', err);
    res.status(500).json({ msg: 'Erro no servidor' });
  }
};

// Obter um usuário por ID
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-senha -refreshToken');
    if (!user) {
      return res.status(404).json({ msg: 'Usuário não encontrado' });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error('Erro no getUser:', err);
    res.status(500).json({ msg: 'Erro no servidor' });
  }
};

// Atualizar um usuário por ID
exports.updateUser = async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).select('-senha -refreshToken');
    if (!updated) {
      return res.status(404).json({ msg: 'Usuário não encontrado' });
    }
    res.status(200).json(updated);
  } catch (err) {
    console.error('Erro no updateUser:', err);
    res.status(500).json({ msg: 'Erro no servidor' });
  }
};

// Deletar um usuário por ID
exports.deleteUser = async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ msg: 'Usuário não encontrado' });
    }
    res.status(200).json({ msg: 'Usuário deletado com sucesso' });
  } catch (err) {
    console.error('Erro no deleteUser:', err);
    res.status(500).json({ msg: 'Erro no servidor' });
  }
};
