// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  // 1) Pega o header "Authorization"
  const header = req.header('Authorization');
  if (!header) {
    return res.status(401).json({ msg: 'Sem token, autorização negada' });
  }

  // 2) Espera o formato "Bearer <token>"
  const parts = header.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ msg: 'Formato de token inválido' });
  }
  const token = parts[1];

  try {
    // 3) Decodifica e atribui req.user
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;

    console.log('Decoded user:', req.user); // Log para depuração

    // 4) Confirma que o usuário existe
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'Usuário não encontrado' });
    }

    // 5) Anexa o role para controle de acesso
    req.user.role = user.role;

    console.log('User with role:', req.user); // Log para depuração

    next();
  } catch (err) {
    console.error('Erro na verificação do token:', err.message);
    return res.status(401).json({ msg: 'Token inválido ou expirado' });
  }
};

const roleMiddleware = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ msg: 'Acesso negado' });
  }
  next();
};

module.exports = { authMiddleware, roleMiddleware };
