require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const app = express();

const authRoutes = require('./routes/authRoutes');
const caseRoutes = require('./routes/caseRoutes');
const userRoutes = require('./routes/userRoutes');
const evidenceRoutes = require('./routes/evidenceRoutes');
const laudoRoutes = require('./routes/laudoRoutes');
const relatorioRoutes = require('./routes/relatorioRoutes');

// CORS para liberar acesso do frontend
app.use(cors({
  origin: 'https://dent-case.netlify.app/', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Conectar ao MongoDB
connectDB();

// Body Parser
app.use(express.json({ extended: false }));

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/users', userRoutes);
app.use('/api/evidences', evidenceRoutes);
app.use('/api/laudos', laudoRoutes);
app.use('/api/relatorios', relatorioRoutes);

// Rota inicial para teste
app.get('/', (req, res) => {
  res.send('API Laudos Periciais rodando 🚀');
});

// Porta
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
