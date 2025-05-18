const express = require('express');
const router = express.Router();
const evidenceController = require('../controllers/evidenceController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

// Criar uma nova evidência — permitido para perito e assistente
router.post('/', authMiddleware, roleMiddleware(['perito', 'assistente']), evidenceController.createEvidence);

// Obter todas as evidências — permitido para todos autenticados
router.get('/', authMiddleware, evidenceController.getAllEvidence);

// Obter evidência por ID — permitido para todos autenticados
router.get('/:id', authMiddleware, evidenceController.getEvidenceById);

// Atualizar evidência — permitido somente para admin e perito
router.put('/:id', authMiddleware, roleMiddleware(['admin', 'perito']), evidenceController.updateEvidence);

// Deletar evidência — permitido somente para admin e perito
router.delete('/:id', authMiddleware, roleMiddleware(['admin', 'perito']), evidenceController.deleteEvidence);

module.exports = router;
