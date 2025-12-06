// Base de conocimientos completa de Escaleras Ferre
const ESCALERAS_CATALOG = {
  products: {
    // Fibra de Vidrio
    fibraExtension: {
      name: "Escaleras Fibra - Extensión",
      sizes: "5m a 12m (16-40 pasos)",
      capacity: "136kg - Tipo IA Industrial",
      features: "Aislamiento eléctrico, peldaños tipo D, resistente UV",
      refs: "EF 5,00 hasta EF 12,0"
    },
    fibraTijera: {
      name: "Escaleras Fibra - Tijera",
      sizes: "0.6m a 6m (2-20 pasos)",
      capacity: "136kg Industrial / 114kg Comercial",
      features: "Peldaños planos, uso eléctrico, estables",
      refs: "TF/TFL 0,60 hasta 6,00"
    },
    fibraSencilla: {
      name: "Escaleras Fibra - Sencillas",
      sizes: "1.5m a 6m (5-20 pasos)",
      capacity: "136kg Industrial / 114kg Comercial",
      features: "Un solo cuerpo, peldaños tipo D",
      refs: "SF/SFL 1,50 hasta 6,00"
    },
    fibraCaballete: {
      name: "Escaleras Fibra - Caballete",
      sizes: "5m a 10m (16-32 pasos)",
      capacity: "136kg - Tipo IA Industrial",
      features: "Doble acceso, peldaños tipo D, trabajo a dos manos",
      refs: "EFC 5,00 hasta EFC 10,0"
    },

    // Aluminio
    aluminioExtension: {
      name: "Escaleras Aluminio - Extensión",
      sizes: "5m a 12m (16-40 pasos)",
      capacity: "136kg - Tipo IA Industrial",
      features: "Livianas, resistente corrosión, peldaños tipo D",
      refs: "EA 5,00 hasta EA 12,0"
    },
    aluminioTijera: {
      name: "Escaleras Aluminio - Tijera",
      sizes: "0.6m a 6m (2-20 pasos)",
      capacity: "136kg Industrial / 102kg Comercial",
      features: "Ultralivianas, peldaños planos",
      refs: "TA/TAL 0,60 hasta 6,00"
    },
    aluminioSencilla: {
      name: "Escaleras Aluminio - Sencillas",
      sizes: "1.5m a 6m (5-20 pasos)",
      capacity: "136kg - Tipo IA Industrial",
      features: "Un solo cuerpo, ultraliviana, peldaños tipo D",
      refs: "SA 1,50 hasta SA 6,00"
    },

    // Accesorios
    accesorios: {
      name: "Accesorios para Escaleras",
      items: "Binchas, ganchos bomberos, zapatas niveladoras, plataformas aluminio, ruedas",
      compatibility: "Universal para todas las escaleras",
      features: "Mejoran seguridad y funcionalidad"
    }
  },

  services: {
    sales: "Venta de escaleras certificadas ISO 9001, ANSI 14.5, EN131, OSHA",
    rental: "Alquiler con entrega: extensión, tijera, sencilla, tijera plataforma",
    maintenance: "Mantenimiento preventivo y correctivo especializado con técnicos certificados"
  },

  contact: {
    bogota: {
      phone: "3008611868",
      type: "Virtual",
      area: "Bogotá y alrededores"
    },
    bucaramanga: {
      phone: "3181027047",
      address: "Cll 34 #11-27",
      type: "Física",
      area: "Bucaramanga y Santander"
    }
  },

  certifications: [
    "ISO 9001:2015 - Gestión de calidad",
    "ANSI 14.5 - Estándares americanos",
    "EN131 - Normas europeas de seguridad",
    "OSHA - Regulaciones de seguridad ocupacional"
  ]
};

module.exports = ESCALERAS_CATALOG;
