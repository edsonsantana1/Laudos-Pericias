const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Função para gerar uma matrícula única
const gerarMatricula = () => {
  const prefixo = 'MAT';
  const data = new Date();
  const matricula = `${prefixo}${data.getFullYear()}${(data.getMonth() + 1).toString().padStart(2, '0')}${data.getDate().toString().padStart(2, '0')}${Math.floor(1000 + Math.random() * 9000)}`;
  return matricula;
};

// Cadastro de novo usuário
exports.register = async (req, res) => {
  const { nome, email, senha, role } = req.body;
  try {
    // Verifica se o usuário já existe
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'Usuário já existe' });
    }

    // Gera uma matrícula única
    const matricula = gerarMatricula();

    // Cria um novo usuário
    user = new User({ nome, email, senha, role, matricula });

    // Criptografa a senha
    const salt = await bcrypt.genSalt(10);
    user.senha = await bcrypt.hash(senha, salt);

    // Salva o usuário no banco de dados
    await user.save();

    // Cria o payload do token
    const payload = { user: { id: user.id, matricula: user.matricula } };

    // Gera o token JWT
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({
        token,
        user: {
          id: user.id,
          nome: user.nome,
          email: user.email,
          role: user.role,
          matricula: user.matricula,
        },
      });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

// Login de usuário
exports.login = async (req, res) => {
  const { matricula, senha } = req.body;
  try {
    // Verifica se a matrícula foi fornecida
    if (!matricula) {
      return res.status(400).json({ msg: 'Matrícula é obrigatória' });
    }

    // Encontra o usuário pela matrícula
    let user = await User.findOne({ matricula });
    if (!user) {
      return res.status(400).json({ msg: 'Matrícula inválida' });
    }

    // Compara a senha fornecida com a armazenada
    const isMatch = await bcrypt.compare(senha, user.senha);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Senha inválida' });
    }

    // Cria o payload do token
    const payload = { user: { id: user.id, matricula: user.matricula } };

    // Gera o token JWT
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({
        token,
        user: {
          id: user.id,
          nome: user.nome,
          email: user.email,
          role: user.role,
          matricula: user.matricula,
        },
      });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

// Obter um usuário por ID
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'Usuário não encontrado' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Erro no servidor');
  }
};

// Atualizar um usuário por ID
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) {
      return res.status(404).json({ msg: 'Usuário não encontrado' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Erro no servidor');
  }
};

// Deletar um usuário por ID
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'Usuário não encontrado' });
    }
    res.status(200).json({ msg: 'Usuário deletado com sucesso' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Erro no servidor');
  }
};