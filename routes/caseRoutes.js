const express = require('express');
const router = express.Router();
const { createCase, getCases, updateCase, deleteCase } = require('../controllers/caseController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, createCase);
router.get('/', authMiddleware, getCases);
router.put('/:id', authMiddleware, updateCase);
router.delete('/:id', authMiddleware, deleteCase);

module.exports = router;