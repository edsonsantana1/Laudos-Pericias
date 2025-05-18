const Case = require('../models/Case');

// Função para criar um caso
exports.createCase = async (req, res) => {
  const {
    caseId,
    status,
    description,
    patientName,
    patientDOB,
    patientAge,
    patientGender,
    patientID,
    patientContact,
    incidentDate,
    incidentLocation,
    incidentDescription,
    incidentWeapon,
  } = req.body;

  try {
    const newCase = new Case({
      caseId,
      status,
      description,
      patientName,
      patientDOB,
      patientAge,
      patientGender,
      patientID,
      patientContact,
      incidentDate,
      incidentLocation,
      incidentDescription,
      incidentWeapon,
      assignedUser: req.user.id, // ou “user: req.user.id” se preferir alinhar com o schema
    });

    const savedCase = await newCase.save();
    res.status(201).json(savedCase);
  } catch (err) {
    console.error('Erro ao criar caso:', err.message);
    res.status(500).json({ error: 'Erro no servidor' });
  }
};

// Função para listar casos de acordo com a role
exports.getCases = async (req, res) => {
  try {
    let cases;
    if (req.user.role === 'admin') {
      cases = await Case.find().populate('assignedUser'); 
    } else if (['perito','assistente'].includes(req.user.role)) {
      cases = await Case.find({ assignedUser: req.user.id }).populate('assignedUser');
    } else {
      return res.status(403).json({ msg: "Acesso negado!" });
    }

    if (!cases || cases.length === 0) {
      return res.status(404).json({ msg: "Nenhum caso encontrado." });
    }

    res.status(200).json(cases);
  } catch (err) {
    console.error('Erro ao obter casos:', err.message);
    res.status(500).json({ error: 'Erro no servidor' });
  }
};

// **Nova função**: buscar um caso por ID
exports.getCaseById = async (req, res) => {
  try {
    const found = await Case.findById(req.params.id).populate('assignedUser');
    if (!found) return res.status(404).json({ msg: 'Caso não encontrado' });
    res.status(200).json(found);
  } catch (err) {
    console.error('Erro ao buscar caso:', err.message);
    res.status(500).json({ error: 'Erro no servidor' });
  }
};

// Função para atualizar um caso por ID
exports.updateCase = async (req, res) => {
  const updates = req.body;
  try {
    const foundCase = await Case.findById(req.params.id);
    if (!foundCase) {
      return res.status(404).json({ msg: 'Caso não encontrado' });
    }
    Object.assign(foundCase, updates);
    const updatedCase = await foundCase.save();
    res.status(200).json(updatedCase);
  } catch (err) {
    console.error('Erro ao atualizar caso:', err.message);
    res.status(500).json({ error: 'Erro no servidor' });
  }
};

// Função para deletar um caso por ID
exports.deleteCase = async (req, res) => {
  try {
    const deletedCase = await Case.findByIdAndDelete(req.params.id);
    if (!deletedCase) {
      return res.status(404).json({ msg: 'Caso não encontrado' });
    }
    res.status(200).json({ msg: 'Caso removido com sucesso' });
  } catch (err) {
    console.error('Erro ao deletar caso:', err.message);
    res.status(500).json({ error: 'Erro no servidor' });
  }
};
