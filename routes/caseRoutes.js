// routes/caseRoutes.js
const express = require('express');
const router = express.Router();
const {
  createCase,
  getCases,
  getCaseById,
  updateCase,
  deleteCase
} = require('../controllers/caseController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

// Criar (admin/perito)
router.post('/', authMiddleware, roleMiddleware(['admin','perito']), createCase);

// Listar todos (admin, perito, assistente)
router.get('/', authMiddleware, getCases);

// Visualizar 1 (qualquer autenticado)
router.get('/:id', authMiddleware, getCaseById);

// Atualizar (admin OU perito dono)
router.put('/:id', authMiddleware, roleMiddleware(['admin','perito']), updateCase);

// Deletar (somente admin)
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), deleteCase);

module.exports = router;
