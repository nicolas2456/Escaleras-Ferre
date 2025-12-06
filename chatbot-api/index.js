const express = require('express');
const cors = require('cors');
const Groq = require('groq-sdk');
const EscalerasChatbot = require('./chatbot-logic');

const app = express();
const PORT = process.env.PORT || 3000;

// Inicializar Groq y Chatbot
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const chatbot = new EscalerasChatbot();

// Middleware
app.use(cors({
  origin: [
    'https://nicolas2456.github.io',
    'https://escaleras-ferre.github.io',
    'http://localhost:3000',
    'http://127.0.0.1:5500', // Para desarrollo local
    '*' // Permitir todos (cambiar en producción)
  ],
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true
}));
app.use(express.json({ limit: '1mb' }));

// Estadísticas de uso
let stats = {
  ai_calls: 0,
  local_responses: 0,
  total_messages: 0,
  errors: 0
};

// Ruta de salud
app.get('/', (req, res) => {
  res.json({
    status: '✅ Escaleras Ferre Chatbot API funcionando',
    version: '1.0.0',
    stats: stats,
    timestamp: new Date().toISOString()
  });
});

// Ruta de health check (para Railway)
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Ruta principal del chat
app.post('/chat', async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        error: 'Mensaje requerido',
        response: '¿Podrías escribir tu pregunta de nuevo? 😊'
      });
    }

    if (message.length > 500) {
      return res.status(400).json({
        error: 'Mensaje muy largo',
        response: 'Por favor escribe un mensaje más corto. ¿Qué necesitas saber sobre escaleras?'
      });
    }

    stats.total_messages++;

    console.log(`📨 [${new Date().toISOString()}] Mensaje: "${message.substring(0, 50)}${message.length > 50 ? '...' : ''}"`);

    // 1. Intentar respuesta local primero (ahorro de tokens)
    const localResponse = chatbot.getLocalResponse(message);
    if (localResponse) {
      stats.local_responses++;
      console.log('⚡ Respuesta local usada');
      return res.json({
        response: localResponse,
        source: 'local',
        timestamp: new Date().toISOString()
      });
    }

    // 2. Verificar si debe usar IA
    if (!chatbot.shouldUseAI(message)) {
      stats.local_responses++;
      console.log('⚡ Fallback local usado');
      const fallback = 'Te puedo ayudar con información sobre escaleras de fibra de vidrio o aluminio. ¿Qué tipo necesitas o para qué trabajo? 😊';
      return res.json({
        response: fallback,
        source: 'local_fallback',
        timestamp: new Date().toISOString()
      });
    }

    // 3. Verificar API key
    if (!process.env.GROQ_API_KEY) {
      console.error('❌ GROQ_API_KEY no configurada');
      stats.errors++;
      return res.json({
        response: 'Disculpa, hay un problema de configuración. Para atención inmediata contacta:\n📱 Bogotá: 3008611868\n📱 Bucaramanga: 3181027047',
        source: 'error_no_api_key',
        timestamp: new Date().toISOString()
      });
    }

    // 4. Llamar a Groq IA (solo para consultas complejas)
    stats.ai_calls++;
    console.log('🤖 Usando Groq IA...');

    const completion = await groq.chat.completions.create({
      model: 'mixtral-8x7b-32768', // Mejor modelo para español
      messages: [
        {
          role: 'system',
          content: chatbot.getSystemPrompt()
        },
        ...history.slice(-4), // Últimos 4 intercambios
        { role: 'user', content: message }
      ],
      max_tokens: 250,
      temperature: 0.8,
      top_p: 0.9
    });

    const aiResponse = completion.choices[0]?.message?.content;

    if (!aiResponse) {
      throw new Error('Respuesta vacía de Groq');
    }

    console.log('✅ Respuesta IA generada');

    res.json({
      response: aiResponse.trim(),
      source: 'ai',
      model: 'mixtral-8x7b-32768',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error en /chat:', error.message);
    stats.errors++;

    // Respuesta de emergencia
    const emergencyResponse = 'Disculpa, tuve un problema técnico. Para atención inmediata contacta:\n\n📱 Bogotá: 3008611868 (Virtual)\n📱 Bucaramanga: 3181027047 (Cll 34 #11-27)\n\n¿Con cuál te conecto? 😊';

    res.json({
      response: emergencyResponse,
      source: 'emergency',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Ruta de estadísticas
app.get('/stats', (req, res) => {
  const efficiency = stats.total_messages > 0 ?
    Math.round((stats.local_responses / stats.total_messages) * 100) : 0;

  const errorRate = stats.total_messages > 0 ?
    Math.round((stats.errors / stats.total_messages) * 100) : 0;

  res.json({
    ...stats,
    efficiency_percent: efficiency,
    error_rate_percent: errorRate,
    message: `${efficiency}% de respuestas sin usar IA (ahorro de tokens)`,
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Ruta de reset stats (opcional, para desarrollo)
app.post('/stats/reset', (req, res) => {
  stats = { ai_calls: 0, local_responses: 0, total_messages: 0, errors: 0 };
  res.json({ message: 'Estadísticas reseteadas', stats });
});

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    availableRoutes: ['GET /', 'POST /chat', 'GET /stats', 'GET /health']
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log('═══════════════════════════════════════════════');
  console.log('🚀 Escaleras Ferre Chatbot API');
  console.log('═══════════════════════════════════════════════');
  console.log(`📡 Puerto: ${PORT}`);
  console.log(`🤖 Sistema: Híbrido (Local + Groq IA)`);
  console.log(`💡 Optimización: Ahorro de tokens automático`);
  console.log(`🔑 API Key: ${process.env.GROQ_API_KEY ? '✅ Configurada' : '❌ NO configurada'}`);
  console.log('═══════════════════════════════════════════════');
});
