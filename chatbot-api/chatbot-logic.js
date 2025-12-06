const { ESCALERAS_CONFIG, RESPUESTAS_RAPIDAS } = require('./escaleras-data');

class EscalerasChatbot {

  // Detectar intención (como tu detectarIntencion)
  detectarIntencion(mensaje, historial = []) {
    const lower = mensaje.toLowerCase();

    // Caliente (como tu array caliente)
    const caliente = [
      'quiero contratar', 'estoy listo', 'necesito ya', 'cuando pueden venir',
      'quiero comprar', 'me decidí', 'hagámoslo', 'acepto', 'cuándo empezamos',
      'quiero que vengan', 'contratar ahora', 'necesito urgente'
    ];
    if (caliente.some(palabra => lower.includes(palabra))) {
      return 'Caliente';
    }

    // Tibio (como tu array tibio)
    const tibio = [
      'me interesa', 'quiero cotización', 'necesito saber precio',
      'cuánto cuesta', 'precio', 'presupuesto', 'me gustaría',
      'cuanto sale', 'cuanto vale', 'cotización'
    ];
    if (tibio.some(palabra => lower.includes(palabra))) {
      return historial.length > 4 ? 'Tibio-Caliente' : 'Tibio';
    }

    // Frío (como tu array frio)
    const frio = [
      'solo preguntando', 'información', 'qué ofrecen',
      'quiero saber', 'cuéntame', 'dime sobre'
    ];
    if (frio.some(palabra => lower.includes(palabra))) {
      return 'Frío';
    }

    return 'Curioso';
  }

  // Respuesta rápida (como tu buscarRespuestaRapida pero mejorada)
  buscarRespuestaRapida(texto) {
    const lower = texto.toLowerCase().trim();

    // Normalizar texto (quitar acentos, como tu función)
    const normalizar = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[¿?¡!]/g, "");
    const textoNormal = normalizar(lower);

    // Buscar coincidencias exactas primero
    if (RESPUESTAS_RAPIDAS[textoNormal]) {
      return RESPUESTAS_RAPIDAS[textoNormal];
    }

    // Buscar coincidencias parciales
    for (const [clave, respuesta] of Object.entries(RESPUESTAS_RAPIDAS)) {
      const claveNormal = normalizar(clave);
      if (textoNormal.includes(claveNormal) || claveNormal.includes(textoNormal)) {
        return respuesta;
      }
    }

    return null;
  }

  // Decidir si usar IA (como tu lógica de shouldUseAI pero específica)
  debeUsarIA(mensaje) {
    const texto = mensaje.toLowerCase().trim();

    // NO usar IA para respuestas rápidas disponibles
    if (this.buscarRespuestaRapida(texto)) {
      return false;
    }

    // SÍ usar IA para consultas específicas de escaleras
    const keywordsEscaleras = [
      'escalera', 'metros', 'altura', 'fibra', 'aluminio', 'extension', 'tijera', 'sencilla',
      'capacidad', 'peso', 'industrial', 'comercial', 'certificacion', 'normas',
      'diferencia entre', 'cual es mejor', 'me recomiendas', 'necesito para',
      'trabajo', 'construccion', 'mantenimiento', 'alquiler', 'comprar', 'venta',
      'caballete', 'peldaños', 'pasos', 'seguridad', 'resistente'
    ];

    return keywordsEscaleras.some(keyword => texto.includes(keyword));
  }

  // Prompt específico (como tu PROMPT_SISTEMA pero para Escaleras Ferre)
  generarPromptSistema() {
    return `Eres Diana, asistente virtual especializada de ${ESCALERAS_CONFIG.NOMBRE_EMPRESA}.

INFORMACIÓN DE LA EMPRESA:
- Empresa: ${ESCALERAS_CONFIG.NOMBRE_EMPRESA}
- Negocio: ${ESCALERAS_CONFIG.TIPO_NEGOCIO}

PRODUCTOS PRINCIPALES:
${Object.entries(ESCALERAS_CONFIG.PRODUCTOS).map(([key, desc]) => `• ${desc}`).join('\n')}

SERVICIOS:
${ESCALERAS_CONFIG.SERVICIOS.map(s => `• ${s}`).join('\n')}

CONTACTO:
- Bogotá: ${ESCALERAS_CONFIG.CONTACTO.bogota.telefono} (${ESCALERAS_CONFIG.CONTACTO.bogota.tipo})
- Bucaramanga: ${ESCALERAS_CONFIG.CONTACTO.bucaramanga.telefono} (${ESCALERAS_CONFIG.CONTACTO.bucaramanga.direccion})

CERTIFICACIONES: ${ESCALERAS_CONFIG.CERTIFICACIONES.join(', ')}

TU PERSONALIDAD:
- Experta en escaleras pero trato humano y amigable
- Respuestas concisas (máximo 3 frases)
- Ayuda a elegir según altura, capacidad y uso
- Deriva a WhatsApp para cotizaciones específicas
- Menciona certificaciones cuando sea relevante para seguridad

IMPORTANTE:
- NUNCA dar precios exactos
- SIEMPRE derivar cotizaciones a WhatsApp
- Recomendar producto según necesidad específica
- Ser profesional pero cercana
- Responde en español colombiano natural`;
  }

  // Extraer información del cliente (como tu actualizarInfoLead)
  extraerInformacion(mensaje) {
    const lower = mensaje.toLowerCase();
    const info = {};

    // Detectar tipo de proyecto
    if (lower.includes('construccion') || lower.includes('obra')) info.proyecto = 'Construcción';
    else if (lower.includes('mantenimiento') || lower.includes('reparacion')) info.proyecto = 'Mantenimiento';
    else if (lower.includes('industrial') || lower.includes('fabrica')) info.proyecto = 'Industrial';
    else if (lower.includes('comercial') || lower.includes('oficina')) info.proyecto = 'Comercial';
    else if (lower.includes('casa') || lower.includes('hogar')) info.proyecto = 'Residencial';

    // Detectar urgencia
    if (lower.includes('urgente') || lower.includes('ya') || lower.includes('rapido')) info.urgencia = 'Alta';
    else if (lower.includes('pronto') || lower.includes('semana')) info.urgencia = 'Media';
    else if (lower.includes('futuro') || lower.includes('mes')) info.urgencia = 'Baja';

    // Detectar altura mencionada
    const alturas = mensaje.match(/(\d+)\s?(metro|m\b|mt)/gi);
    if (alturas) info.altura = alturas[0];

    // Detectar material preferido
    if (lower.includes('fibra')) info.material = 'Fibra de vidrio';
    else if (lower.includes('aluminio')) info.material = 'Aluminio';

    // Detectar tipo de escalera
    if (lower.includes('extension')) info.tipo = 'Extensión';
    else if (lower.includes('tijera')) info.tipo = 'Tijera';
    else if (lower.includes('sencilla')) info.tipo = 'Sencilla';
    else if (lower.includes('caballete')) info.tipo = 'Caballete';

    return info;
  }

  // Generar mensaje de WhatsApp directo (como tu sistema de derivación)
  generarMensajeWhatsApp(intencion, info) {
    const { bogota, bucaramanga } = ESCALERAS_CONFIG.CONTACTO;

    let mensaje = '';

    if (intencion === 'Caliente') {
      mensaje = `¡Perfecto! Te conecto con un asesor especializado:\n\n`;
      mensaje += `📱 Bogotá: wa.me/57${bogota.telefono}\n`;
      mensaje += `📱 Bucaramanga: wa.me/57${bucaramanga.telefono}\n\n`;
      mensaje += `¿Con cuál ciudad prefieres hablar?`;
    } else if (intencion === 'Tibio' || intencion === 'Tibio-Caliente') {
      mensaje = `Para darte un precio exacto necesito conectarte con un asesor:\n\n`;
      mensaje += `📱 Bogotá: wa.me/57${bogota.telefono}\n`;
      mensaje += `📱 Bucaramanga: wa.me/57${bucaramanga.telefono}\n\n`;
      mensaje += `Te ayudarán con la cotización personalizada 😊`;
    }

    return mensaje;
  }
}

module.exports = EscalerasChatbot;
