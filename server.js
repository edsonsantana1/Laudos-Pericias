require('dotenv').config();
const express = require('express');
const cors = require('cors'); // Importa o pacote cors
const connectDB = require('./config/db');
const app = express();
const authRoutes = require('./routes/authRoutes');
const caseRoutes = require('./routes/caseRoutes');
const userRoutes = require('./routes/userRoutes');
const evidenceRoutes = require('./routes/evidenceRoutes'); // Adiciona a importação das rotas de evidências
const laudoRoutes = require('./routes/laudoRoutes');
const relatorioRoutes = require('./routes/relatorioRoutes');

// Configuração do CORS para permitir acesso do frontend no Netlify
app.use(cors({
  origin: 'https://laudo-pericias.netlify.app/', // URL do seu frontend no Netlify
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

connectDB();
app.use(express.json({ extended: false }));

app.use('/api/auth', authRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/users', userRoutes);
app.use('/api/evidences', evidenceRoutes); // Adiciona a utilização das rotas de evidências
app.use('/api/laudos', laudoRoutes);
app.use('/api/relatorios', relatorioRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
