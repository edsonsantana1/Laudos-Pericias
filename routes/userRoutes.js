const express = require('express');
const router = express.Router();
const { getUser, updateUser, deleteUser, register } = require('../controllers/userController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

// Rota para obter um usuário por ID
router.get('/:id', authMiddleware, getUser);

// Rota para atualizar um usuário por ID
router.put('/:id', authMiddleware, updateUser);

// Rota para deletar um usuário por ID
router.delete('/:id', authMiddleware, deleteUser);

// Rota para cadastrar um novo usuário (acesso restrito a 'admin')
router.post('/register', authMiddleware, roleMiddleware(['admin']), register);

// Exporta o roteador
module.exports = router;