const express = require('express');
const router = express.Router();
const laudoController = require('../controllers/laudoController');

// Rotas CRUD para Laudos
router.post('/', laudoController.createLaudo);
router.get('/', laudoController.getAllLaudos);
router.get('/:id', laudoController.getLaudoById);
router.put('/:id', laudoController.updateLaudo);
router.delete('/:id', laudoController.deleteLaudo);

module.exports = router;