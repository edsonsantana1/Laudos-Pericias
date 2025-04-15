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
    expertName,
    expertRegistration,
    expertContact,
    incidentDate,
    incidentLocation,
    incidentDescription,
    incidentWeapon,
  } = req.body;

  try {
    // Instancia um novo caso com os dados fornecidos
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
      expertName,
      expertRegistration,
      expertContact,
      incidentDate,
      incidentLocation,
      incidentDescription,
      incidentWeapon,
      user: req.user.id, // Vincula o caso ao ID do usuário autenticado
    });

    const savedCase = await newCase.save(); // Salva no banco de dados
    res.status(201).json(savedCase); // Retorna o caso criado
  } catch (err) {
    console.error('Erro ao criar caso:', err.message);
    res.status(500).json({ error: 'Erro no servidor' }); // Tratamento de erro
  }
};

// Função para listar todos os casos relacionados ao usuário
exports.getCases = async (req, res) => {
  try {
    const cases = await Case.find({ user: req.user.id }); // Filtra pelo usuário autenticado
    res.status(200).json(cases); // Retorna os casos encontrados
  } catch (err) {
    console.error('Erro ao obter casos:', err.message);
    res.status(500).json({ error: 'Erro no servidor' }); // Tratamento de erro
  }
};

// Função para atualizar um caso por ID
exports.updateCase = async (req, res) => {
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
    expertName,
    expertRegistration,
    expertContact,
    incidentDate,
    incidentLocation,
    incidentDescription,
    incidentWeapon,
  } = req.body;

  try {
    const foundCase = await Case.findById(req.params.id); // Busca o caso pelo ID
    if (!foundCase) {
      return res.status(404).json({ msg: 'Caso não encontrado' }); // Caso não exista
    }

    // Atualiza os campos fornecidos ou mantém os valores atuais
    foundCase.caseId = caseId || foundCase.caseId;
    foundCase.status = status || foundCase.status;
    foundCase.description = description || foundCase.description;
    foundCase.patientName = patientName || foundCase.patientName;
    foundCase.patientDOB = patientDOB || foundCase.patientDOB;
    foundCase.patientAge = patientAge || foundCase.patientAge;
    foundCase.patientGender = patientGender || foundCase.patientGender;
    foundCase.patientID = patientID || foundCase.patientID;
    foundCase.patientContact = patientContact || foundCase.patientContact;
    foundCase.expertName = expertName || foundCase.expertName;
    foundCase.expertRegistration = expertRegistration || foundCase.expertRegistration;
    foundCase.expertContact = expertContact || foundCase.expertContact;
    foundCase.incidentDate = incidentDate || foundCase.incidentDate;
    foundCase.incidentLocation = incidentLocation || foundCase.incidentLocation;
    foundCase.incidentDescription = incidentDescription || foundCase.incidentDescription;
    foundCase.incidentWeapon = incidentWeapon || foundCase.incidentWeapon;

    const updatedCase = await foundCase.save(); // Salva as alterações no banco de dados
    res.status(200).json(updatedCase); // Retorna o caso atualizado
  } catch (err) {
    console.error('Erro ao atualizar caso:', err.message);
    res.status(500).json({ error: 'Erro no servidor' }); // Tratamento de erro
  }
};

// Função para deletar um caso por ID
exports.deleteCase = async (req, res) => {
  try {
    const deletedCase = await Case.findByIdAndDelete(req.params.id); // Deleta pelo ID
    if (!deletedCase) {
      return res.status(404).json({ msg: 'Caso não encontrado' }); // Caso não exista
    }
    res.status(200).json({ msg: 'Caso removido com sucesso' }); // Confirmação de deleção
  } catch (err) {
    console.error('Erro ao deletar caso:', err.message);
    res.status(500).json({ error: 'Erro no servidor' }); // Tratamento de erro
  }
};