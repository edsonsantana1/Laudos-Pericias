const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Registro de usuário
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
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
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
    let user = await User.findOne({ matricula });
    if (!user) {
      return res.status(400).json({ msg: 'Credenciais inválidas' });
    }
    const isMatch = await bcrypt.compare(senha, user.senha);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Credenciais inválidas' });
    }

    // Gere o Access Token
    const accessToken = jwt.sign(
      { user: { id: user.id, role: user.role } },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // Expira em 1 hora
    );

    // Gere o Refresh Token
    const refreshToken = jwt.sign(
      { user: { id: user.id } },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' } // Expira em 7 dias
    );

    // Salve o Refresh Token no banco de dados
    user.refreshToken = refreshToken;
    await user.save();

    res.status(200).json({ accessToken, refreshToken });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

// Endpoint de Refresh Token
exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ msg: 'Refresh Token não fornecido' });
  }

  try {
    // Verifique o Refresh Token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Encontre o usuário no banco de dados
    const user = await User.findById(decoded.user.id);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ msg: 'Refresh Token inválido' });
    }

    // Gere um novo Access Token
    const accessToken = jwt.sign(
      { user: { id: user.id, role: user.role } },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // Expira em 1 hora
    );

    res.status(200).json({ accessToken });
  } catch (err) {
    console.error(err.message);
    res.status(403).json({ msg: 'Refresh Token expirado ou inválido' });
  }
};