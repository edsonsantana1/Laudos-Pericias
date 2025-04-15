const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({ msg: 'Sem token, autorização negada' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'Usuário não encontrado' });
    }

    req.user.role = user.role; // Adiciona o papel do usuário ao objeto req.user

    next();
  } catch (err) {
    console.error('Erro na verificação do token:', err.message);
    res.status(500).send('Erro no servidor');
  }
};

const roleMiddleware = (roles) => (req, res, next) => {
  if (roles.includes(req.user.role)) {
    next();
  } else {
    return res.status(403).json({ msg: 'Acesso negado' });
  }
};

module.exports = { authMiddleware, roleMiddleware };
