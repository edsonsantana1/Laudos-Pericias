const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Registro de usuário
exports.register = async (req, res) => {
  const { nome, email, senha, role } = req.body;
  try {
    if (await User.findOne({ email })) {
      return res.status(400).json({ msg: 'Usuário já existe' });
    }

    // Gera matrícula simples
    const matricula = `MAT${Date.now()}`;

    const user = new User({ nome, email, senha, role, matricula });
    const salt = await bcrypt.genSalt(10);
    user.senha = await bcrypt.hash(senha, salt);
    await user.save();

    // Gera tokens
    const accessToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    user.refreshToken = refreshToken;
    await user.save();

    res.status(201).json({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        nome: user.nome,
        role: user.role,
        email: user.email,
        matricula: user.matricula,
      },
    });
  } catch (err) {
    console.error('Erro no register:', err);
    res.status(500).send('Erro no servidor');
  }
};

// Login de usuário
exports.login = async (req, res) => {
  const { matricula, senha } = req.body;
  try {
    const user = await User.findOne({ matricula });
    if (!user) {
      return res.status(401).json({ msg: 'Credenciais inválidas' });
    }
    if (!(await bcrypt.compare(senha, user.senha))) {
      return res.status(401).json({ msg: 'Credenciais inválidas' });
    }

    // Invalida e gera novo refresh token
    if (user.refreshToken) {
      user.refreshToken = null;
    }

    const accessToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    user.refreshToken = refreshToken;
    await user.save();

    res.status(200).json({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        nome: user.nome,
        role: user.role,
        email: user.email,
        matricula: user.matricula,
      },
    });
  } catch (err) {
    console.error('Erro no login:', err);
    res.status(500).send('Erro no servidor');
  }
};