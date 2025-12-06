// Configuración específica de Escaleras Ferre (como tu NOMBRE_NEGOCIO, etc.)
const ESCALERAS_CONFIG = {
  NOMBRE_EMPRESA: 'Escaleras Ferre',
  TIPO_NEGOCIO: 'Fabricación y venta de escaleras industriales',

  // Productos específicos (como tu PRODUCTOS array)
  PRODUCTOS: {
    'fibra_extension': 'Escaleras Fibra Extensión: 5-12m, 136kg, Tipo IA, aislamiento eléctrico',
    'fibra_tijera': 'Escaleras Fibra Tijera: 0.6-6m, 136kg/114kg, peldaños planos',
    'fibra_sencilla': 'Escaleras Fibra Sencillas: 1.5-6m, un cuerpo, peldaños tipo D',
    'fibra_caballete': 'Escaleras Fibra Caballete: 5-10 pasos, 136kg, trabajo en alturas',
    'aluminio_extension': 'Escaleras Aluminio Extensión: 5-12m, 136kg, livianas',
    'aluminio_tijera': 'Escaleras Aluminio Tijera: 0.6-6m, ultralivianas',
    'aluminio_sencilla': 'Escaleras Aluminio Sencillas: 1.5-6m, un cuerpo',
    'accesorios': 'Accesorios: estabilizadores, ruedas, bandejas, ganchos certificados'
  },

  // Servicios (como tu lista de servicios)
  SERVICIOS: [
    'Venta de escaleras certificadas ISO, ANSI, OSHA',
    'Alquiler con entrega: extensión, tijera, sencilla, plataforma',
    'Mantenimiento preventivo y correctivo especializado'
  ],

  // Contacto (como tu info de contacto)
  CONTACTO: {
    bogota: { telefono: '3008611868', tipo: 'Virtual', ciudad: 'Bogotá' },
    bucaramanga: { telefono: '3181027047', direccion: 'Cll 34 #11-27', tipo: 'Física', ciudad: 'Bucaramanga' }
  },

  CERTIFICACIONES: ['ISO 9001:2015', 'ANSI 14.5', 'EN131', 'OSHA']
};

// Respuestas rápidas específicas (como tu RESPUESTAS_RAPIDAS)
const RESPUESTAS_RAPIDAS = {
  // Saludos
  'hola': '¡Hola! Soy Diana de Escaleras Ferre 😊 ¿Qué tipo de escalera necesitas?',
  'buenos dias': '¡Buenos días! Te saluda Diana de Escaleras Ferre. ¿En qué puedo ayudarte?',
  'buenas tardes': '¡Buenas tardes! Soy Diana, ¿qué escalera estás buscando?',
  'buenas noches': '¡Buenas noches! Soy Diana de Escaleras Ferre. ¿En qué te puedo ayudar?',

  // Contacto básico
  'telefono': 'Nuestros números:\n📱 Bogotá: 3008611868 (virtual)\n📱 Bucaramanga: 3181027047 (Cll 34 #11-27)\n¿Con cuál prefieres hablar?',
  'direccion': 'Sede física: Bucaramanga, Cll 34 #11-27\nAtención virtual: Bogotá 3008611868\n¿Cuál te conviene más?',
  'ubicacion': 'Tenemos presencia en Bogotá (virtual) y Bucaramanga (física). ¿De qué ciudad me escribes?',
  'horario': 'Atendemos de lunes a viernes 8am-6pm, sábados 8am-1pm. ¿Qué necesitas?',

  // Servicios básicos
  'alquiler': 'Alquilamos escaleras extensión, tijera, sencilla y plataforma con entrega incluida. ¿Para qué proyecto las necesitas?',
  'mantenimiento': 'Ofrecemos mantenimiento preventivo y correctivo por técnicos certificados. ¿Qué escaleras necesitas revisar?',
  'venta': 'Vendemos escaleras en fibra de vidrio y aluminio con certificaciones internacionales. ¿Qué tipo te interesa?',

  // Precios generales
  'precio': 'Para cotización exacta necesito saber qué escalera buscas. ¿Te conecto con un asesor por WhatsApp? 😊',
  'cotizacion': 'Te puedo ayudar a elegir la escalera correcta y conectarte con asesor para precio. ¿Qué altura necesitas?',
  'cuanto cuesta': 'El precio depende del tipo y tamaño. ¿Buscas fibra o aluminio? ¿Qué altura necesitas?',

  // Agradecimientos
  'gracias': '¡Con gusto! Si necesitas algo más sobre nuestras escaleras, aquí estoy 😊',
  'muchas gracias': '¡De nada! Estoy aquí para ayudarte con escaleras. ¿Algo más?'
};

module.exports = { ESCALERAS_CONFIG, RESPUESTAS_RAPIDAS };
