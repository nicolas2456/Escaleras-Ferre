require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Groq = require('groq-sdk');
const EscalerasChatbot = require('./chatbot-logic');

const app = express();
const PORT = process.env.PORT || 3000;

// Inicializar Groq y Chatbot (como tu configuración)
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const chatbot = new EscalerasChatbot();

// Estadísticas (como tu sistema de tracking)
let estadisticas = {
  mensajes_totales: 0,
  respuestas_ia: 0,
  respuestas_locales: 0,
  leads_detectados: 0,
  leads_calientes: 0,
  leads_tibios: 0,
  inicio: new Date()
};

// Middleware
app.use(cors({
  origin: [
    'https://nicolas2456.github.io',
    'https://escaleras-ferre.github.io',
    'http://localhost:3000',
    'http://localhost:5500',
    'http://127.0.0.1:5500'
  ],
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json({ limit: '1mb' }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Ruta de salud (como tu sistema de status)
app.get('/', (req, res) => {
  const uptime = Math.floor((Date.now() - estadisticas.inicio) / 1000);
  const eficiencia = estadisticas.mensajes_totales > 0 ?
    Math.round((estadisticas.respuestas_locales / estadisticas.mensajes_totales) * 100) : 0;

  res.json({
    status: '✅ Escaleras Ferre Chatbot API funcionando',
    version: '1.0.0',
    uptime_segundos: uptime,
    arquitectura: 'Inspirado en bot WhatsApp exitoso',
    estadisticas: {
      ...estadisticas,
      eficiencia_local: `${eficiencia}% respuestas sin IA`
    }
  });
});

// Health check para Railway
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Ruta principal del chat (como tu flow principal)
app.post('/chat', async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        error: 'Mensaje requerido',
        response: '¿Podrías escribir tu pregunta de nuevo? 😊'
      });
    }

    estadisticas.mensajes_totales++;

    // 1. Intentar respuesta rápida primero (como tu sistema)
    const respuestaRapida = chatbot.buscarRespuestaRapida(message);
    if (respuestaRapida) {
      estadisticas.respuestas_locales++;
      console.log('⚡ Respuesta rápida:', message.substring(0, 30));

      const intencion = chatbot.detectarIntencion(message, history);

      return res.json({
        response: respuestaRapida,
        source: 'local',
        intencion: intencion,
        timestamp: new Date().toISOString()
      });
    }

    // 2. Verificar si debe usar IA (como tu lógica)
    if (!chatbot.debeUsarIA(message)) {
      estadisticas.respuestas_locales++;
      const fallback = 'Te puedo ayudar con escaleras industriales. ¿Buscas fibra de vidrio o aluminio? 😊';

      return res.json({
        response: fallback,
        source: 'local_fallback',
        intencion: 'Curioso',
        timestamp: new Date().toISOString()
      });
    }

    // 3. Usar Groq IA (como tu hablarConChatGPT)
    estadisticas.respuestas_ia++;
    console.log('🤖 Usando Groq IA:', message.substring(0, 50));

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile', // Mismo modelo que tu bot exitoso
      messages: [
        {
          role: 'system',
          content: chatbot.generarPromptSistema()
        },
        ...history.slice(-4), // Últimos 4 mensajes para contexto
        { role: 'user', content: message }
      ],
      max_tokens: 200, // Respuestas concisas como tu bot
      temperature: 0.7 // Misma temperatura
    });

    const respuestaIA = completion.choices[0]?.message?.content;

    if (!respuestaIA) {
      throw new Error('Respuesta vacía de Groq');
    }

    // Detectar intención (como tu sistema)
    const intencion = chatbot.detectarIntencion(message, history);
    const infoExtraida = chatbot.extraerInformacion(message);

    // Tracking de leads
    if (intencion === 'Caliente') {
      estadisticas.leads_calientes++;
      estadisticas.leads_detectados++;
    } else if (intencion === 'Tibio' || intencion === 'Tibio-Caliente') {
      estadisticas.leads_tibios++;
      estadisticas.leads_detectados++;
    }

    console.log(`✅ Respuesta IA generada (${intencion})`);

    // Si es lead caliente o tibio-caliente, agregar mensaje de WhatsApp
    let respuestaFinal = respuestaIA;
    if (intencion === 'Caliente' || intencion === 'Tibio-Caliente') {
      const mensajeWhatsApp = chatbot.generarMensajeWhatsApp(intencion, infoExtraida);
      if (mensajeWhatsApp) {
        respuestaFinal += '\n\n' + mensajeWhatsApp;
      }
    }

    res.json({
      response: respuestaFinal,
      source: 'ai',
      intencion: intencion,
      info_extraida: infoExtraida,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error en /chat:', error.message);

    // Respuesta de emergencia (como tu sistema de fallback)
    const emergencia = 'Disculpa, problema técnico temporal. Para atención directa:\n📱 Bogotá: 3008611868\n📱 Bucaramanga: 3181027047 😊';

    res.json({
      response: emergencia,
      source: 'emergency',
      error: 'Error temporal del servidor',
      timestamp: new Date().toISOString()
    });
  }
});

// Ruta de estadísticas (como tu sistema de tracking)
app.get('/stats', (req, res) => {
  const uptime = Math.floor((Date.now() - estadisticas.inicio) / 1000);
  const eficiencia = estadisticas.mensajes_totales > 0 ?
    Math.round((estadisticas.respuestas_locales / estadisticas.mensajes_totales) * 100) : 0;

  res.json({
    ...estadisticas,
    uptime_segundos: uptime,
    uptime_horas: (uptime / 3600).toFixed(2),
    eficiencia_tokens: `${eficiencia}% ahorro`,
    conversion_leads: estadisticas.mensajes_totales > 0 ?
      `${Math.round((estadisticas.leads_detectados / estadisticas.mensajes_totales) * 100)}%` : '0%',
    mensaje: `Sistema funcionando ${uptime}s. ${eficiencia}% respuestas locales. ${estadisticas.leads_detectados} leads detectados.`
  });
});

// Reset estadísticas (solo para desarrollo/testing)
app.post('/stats/reset', (req, res) => {
  estadisticas = {
    mensajes_totales: 0,
    respuestas_ia: 0,
    respuestas_locales: 0,
    leads_detectados: 0,
    leads_calientes: 0,
    leads_tibios: 0,
    inicio: new Date()
  };
  res.json({ mensaje: 'Estadísticas reseteadas', estadisticas });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error global:', err);
  res.status(500).json({
    error: 'Error interno del servidor',
    response: 'Disculpa, problema técnico. Contacta: Bogotá 3008611868 o Bucaramanga 3181027047'
  });
});

// Iniciar servidor (como tu main())
app.listen(PORT, () => {
  console.log('='.repeat(60));
  console.log('🚀 Escaleras Ferre Chatbot API iniciado');
  console.log('='.repeat(60));
  console.log(`📡 Puerto: ${PORT}`);
  console.log(`🌐 Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log('🤖 Sistema híbrido: Respuestas rápidas + Groq IA');
  console.log('💡 Optimizado para eficiencia de tokens');
  console.log('⚡ Inspirado en bot WhatsApp exitoso');
  console.log('📊 Modelo: llama-3.3-70b-versatile');
  console.log('='.repeat(60));
});

// Manejo de señales para cierre graceful
process.on('SIGTERM', () => {
  console.log('SIGTERM recibido. Cerrando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT recibido. Cerrando servidor...');
  process.exit(0);
});
