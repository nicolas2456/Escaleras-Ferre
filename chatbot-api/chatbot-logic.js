const CATALOG = require('./escaleras-catalog');

class EscalerasChatbot {

  // Detectar si debe usar IA o respuesta local
  shouldUseAI(message) {
    const text = message.toLowerCase().trim();

    // NO usar IA para saludos básicos (ahorro de tokens)
    const basicGreetings = ['hola', 'hi', 'hey', 'buenos dias', 'buenas tardes', 'buenas noches'];
    if (basicGreetings.includes(text)) {
      return false;
    }

    // NO usar IA para preguntas básicas de contacto
    const basicContact = ['telefono', 'direccion', 'ubicacion', 'donde estan', 'contacto'];
    if (basicContact.some(word => text.includes(word)) && text.split(' ').length <= 3) {
      return false;
    }

    // NO usar IA para preguntas simples de precio sin contexto
    if ((text === 'precios' || text === 'precio' || text === 'cuanto cuesta') && text.split(' ').length <= 2) {
      return false;
    }

    // SÍ usar IA para consultas específicas de productos
    const productQueries = [
      'escalera', 'metros', 'altura', 'fibra', 'aluminio', 'extension', 'tijera', 'sencilla', 'caballete',
      'necesito', 'busco', 'recomiendan', 'diferencia', 'mejor', 'cual', 'capacidad', 'peso',
      'alquiler', 'alquilar', 'rentar', 'mantenimiento', 'servicio', 'certificacion', 'normas',
      'trabajo electrico', 'industrial', 'comercial', 'tipo', 'modelo'
    ];

    return productQueries.some(keyword => text.includes(keyword));
  }

  // Respuestas rápidas locales (sin usar tokens)
  getLocalResponse(message) {
    const text = message.toLowerCase().trim();

    // Saludos básicos
    if (text === 'hola' || text === 'hi' || text === 'hey') {
      return '¡Hola! Soy Diana de Escaleras Ferre 😊 ¿Qué tipo de escalera necesitas hoy?';
    }

    if (text === 'buenos dias') {
      return '¡Buenos días! Soy Diana de Escaleras Ferre. ¿En qué puedo ayudarte con escaleras?';
    }

    if (text === 'buenas tardes' || text === 'buenas noches' || text === 'buenas') {
      return '¡Buenas! Soy Diana de Escaleras Ferre. ¿Qué escalera estás buscando?';
    }

    // Contacto básico
    if (text.includes('telefono') || (text.includes('contacto') && text.split(' ').length <= 2)) {
      return `Nuestros números de contacto son:\n\n📱 Bogotá (Virtual): ${CATALOG.contact.bogota.phone}\n📱 Bucaramanga (Física): ${CATALOG.contact.bucaramanga.phone}\n\n¿Con cuál sede te gustaría hablar?`;
    }

    if (text.includes('direccion') || text.includes('ubicacion')) {
      return `Tenemos:\n\n📍 Sede física en Bucaramanga: ${CATALOG.contact.bucaramanga.address}\n📱 Atención virtual en Bogotá: ${CATALOG.contact.bogota.phone}\n\n¿Cuál te queda más cerca?`;
    }

    // Precios sin contexto
    if (text === 'precios' || text === 'precio' || text === 'cuanto cuesta') {
      return 'Para cotizaciones específicas necesito saber qué tipo de escalera buscas (fibra o aluminio, extensión/tijera/sencilla, altura). ¿Qué necesitas exactamente? O te puedo conectar directo con WhatsApp. 😊';
    }

    // Horarios
    if (text.includes('horario') || text.includes('hora')) {
      return 'Para conocer horarios de atención, te recomiendo contactar directo:\n\n📱 Bogotá: 3008611868\n📱 Bucaramanga: 3181027047\n\n¿Con cuál te conecto?';
    }

    return null; // Usar IA
  }

  // Prompt optimizado para Escaleras Ferre
  getSystemPrompt() {
    return `Eres Diana, asistente especializada de Escaleras Ferre Colombia.

PRODUCTOS PRINCIPALES:
${Object.entries(CATALOG.products).map(([key, product]) =>
  `• ${product.name}: ${product.sizes}, ${product.capacity}\n  ${product.features}`
).join('\n')}

SERVICIOS:
- ${CATALOG.services.sales}
- ${CATALOG.services.rental}
- ${CATALOG.services.maintenance}

CONTACTO:
- Bogotá: ${CATALOG.contact.bogota.phone} (${CATALOG.contact.bogota.type}) - ${CATALOG.contact.bogota.area}
- Bucaramanga: ${CATALOG.contact.bucaramanga.phone} (${CATALOG.contact.bucaramanga.address}) - ${CATALOG.contact.bucaramanga.area}

CERTIFICACIONES:
${CATALOG.certifications.join('\n')}

PERSONALIDAD:
- Experta en escaleras industriales con conversación natural colombiana
- Respuestas concretas máximo 3-4 frases
- Ayuda a elegir según: altura necesaria, tipo de uso, capacidad requerida
- Deriva a WhatsApp para cotizaciones específicas de precio
- Menciona certificaciones cuando sea relevante para seguridad

REGLAS IMPORTANTES:
❌ NUNCA dar precios exactos en pesos
❌ NUNCA prometer disponibilidad específica
❌ NO usar lenguaje robótico

✅ SIEMPRE derivar cotizaciones de precio a WhatsApp
✅ Recomendar producto específico según necesidad del cliente
✅ Preguntar detalles si no está claro qué necesita
✅ Ser cálida pero profesional

EJEMPLOS:
Usuario: "Necesito una escalera de 8 metros para trabajo eléctrico"
Tú: "Para 8 metros en trabajo eléctrico te recomiendo la extensión EF 8,60 en fibra de vidrio (28 pasos, 136kg de capacidad). La fibra es perfecta porque no conduce electricidad. ¿Te conecto con un asesor para cotización?"

Usuario: "¿Cuál es mejor, fibra o aluminio?"
Tú: "Depende del uso: Fibra de vidrio es mejor para trabajo eléctrico (aislamiento total) y aluminio es más liviana para uso general. ¿Para qué tipo de trabajo la necesitas?"

Usuario: "Busco alquilar una escalera"
Tú: "¡Perfecto! Tenemos alquiler con entrega incluida. ¿Qué altura necesitas y para qué tipo de proyecto? Así te recomiendo la mejor opción. 😊"`;
  }
}

module.exports = EscalerasChatbot;
