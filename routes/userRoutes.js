const express = require('express');
const router = express.Router();
const {
  createUser,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser
} = require('../controllers/userController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

// Listar todos os usuários (apenas admin)
router.get(
  '/',
  authMiddleware,
  roleMiddleware(['admin']),
  getAllUsers
);

// Obter um único usuário por ID
router.get(
  '/:id',
  authMiddleware,
  getUser
);

// Atualizar um usuário (admin ou o próprio usuário, se quiser customizar)
router.put(
  '/:id',
  authMiddleware,
  updateUser
);

// Deletar um usuário
router.delete(
  '/:id',
  authMiddleware,
  deleteUser
);

// Criar novo usuário (apenas admin)
router.post(
  '/',
  authMiddleware,
  roleMiddleware(['admin']),
  createUser
);

module.exports = router;
