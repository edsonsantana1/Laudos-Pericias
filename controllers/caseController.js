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
      incidentDate,
      incidentLocation,
      incidentDescription,
      incidentWeapon,
      assignedUser: req.user.id, // Vincula o caso ao usuário autenticado
    });

    const savedCase = await newCase.save(); // Salva no banco de dados
    res.status(201).json(savedCase); // Retorna o caso criado
  } catch (err) {
    console.error('Erro ao criar caso:', err.message);
    res.status(500).json({ error: 'Erro no servidor' });
  }
};

// Função para listar casos de acordo com a role
exports.getCases = async (req, res) => {
  try {
    let cases;

    console.log("Usuário acessando casos:", req.user.role, "ID:", req.user.id);

    // Admin vê todos os casos
    if (req.user.role === 'admin') {
      cases = await Case.find(); // Retorna todos os casos corretamente
    } 
    // Perito e Assistente veem apenas casos atribuídos a eles
    else if (req.user.role === 'perito' || req.user.role === 'assistente') {
      cases = await Case.find({ assignedUser: req.user.id });
    } 
    // Usuário sem permissão
    else {
      return res.status(403).json({ msg: "Acesso negado!" });
    }

    if (!cases || cases.length === 0) {
      return res.status(404).json({ msg: "Nenhum caso encontrado." });
    }

    res.status(200).json(cases); // Retorna os casos encontrados
  } catch (err) {
    console.error('Erro ao obter casos:', err.message);
    res.status(500).json({ error: 'Erro no servidor' });
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
    incidentDate,
    incidentLocation,
    incidentDescription,
    incidentWeapon,
  } = req.body;

  try {
    const foundCase = await Case.findById(req.params.id);
    if (!foundCase) {
      return res.status(404).json({ msg: 'Caso não encontrado' });
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
    foundCase.incidentDate = incidentDate || foundCase.incidentDate;
    foundCase.incidentLocation = incidentLocation || foundCase.incidentLocation;
    foundCase.incidentDescription = incidentDescription || foundCase.incidentDescription;
    foundCase.incidentWeapon = incidentWeapon || foundCase.incidentWeapon;

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