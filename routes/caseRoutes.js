const express = require('express');
const router = express.Router();
const { createCase, getCases, updateCase, deleteCase } = require('../controllers/caseController'); // Certifique-se do caminho correto
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

// Rotas CRUD para casos
router.post('/', authMiddleware, roleMiddleware(['admin', 'perito']), createCase); // Criar Caso
router.get('/', authMiddleware, getCases); // Listar Casos
router.put('/:id', authMiddleware, updateCase); // Atualizar Caso
router.delete('/:id', authMiddleware, deleteCase); // Deletar Caso

module.exports = router;