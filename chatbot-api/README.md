# 🤖 Escaleras Ferre Chatbot API

Backend híbrido inteligente para el chatbot de Escaleras Ferre, **inspirado en la arquitectura exitosa del bot de WhatsApp**.

## 🎯 Características Principales

- **Sistema Híbrido de 3 Niveles**: Respuestas rápidas → Fallback local → Groq IA
- **Detección de Intención**: Caliente/Tibio/Frío/Curioso (como bot WhatsApp)
- **Optimización de Tokens**: 70-80% de respuestas sin usar IA
- **Extracción de Información**: Proyecto, urgencia, altura, material, tipo
- **Tracking de Leads**: Conteo automático de leads calientes y tibios
- **Modelo Optimizado**: llama-3.3-70b-versatile (mismo que bot WhatsApp exitoso)
- **Estadísticas en Tiempo Real**: Eficiencia, conversión, uptime

## 📁 Estructura del Proyecto

```
chatbot-api/
├── app.js                # Servidor Express principal
├── chatbot-logic.js      # Lógica de detección e intención
├── escaleras-data.js     # Configuración del negocio y respuestas rápidas
├── package.json          # Dependencias
├── .env.example          # Ejemplo de variables de entorno
├── .gitignore           # Archivos a ignorar
├── Procfile             # Configuración Railway
└── README.md            # Este archivo
```

## 🏗️ Arquitectura Inspirada en Bot WhatsApp

### 1. Sistema de Detección de Intención

```javascript
// Caliente → Lead listo para contratar
'quiero contratar', 'estoy listo', 'necesito ya', 'cuando pueden venir'

// Tibio → Interesado en cotización
'me interesa', 'quiero cotización', 'cuánto cuesta', 'precio'

// Frío → Solo buscando información
'solo preguntando', 'información', 'qué ofrecen'

// Curioso → Explorando opciones
Cualquier otra consulta
```

### 2. Sistema de Respuestas de 3 Niveles

```
Mensaje del usuario
       ↓
1. ¿Tiene respuesta rápida? → SÍ → Respuesta local (0 tokens)
       ↓ NO
2. ¿Requiere IA? → NO → Fallback local (0 tokens)
       ↓ SÍ
3. Llamar a Groq IA → Respuesta inteligente (usa tokens)
```

### 3. Extracción de Información del Cliente

- **Proyecto**: Construcción, Mantenimiento, Industrial, Comercial, Residencial
- **Urgencia**: Alta, Media, Baja
- **Altura**: Detecta "X metros" en el mensaje
- **Material**: Fibra de vidrio o Aluminio
- **Tipo**: Extensión, Tijera, Sencilla, Caballete

## 🚀 Despliegue en Railway

### Paso 1: Crear Repositorio en GitHub

```bash
# Opción A: Crear repo separado (recomendado)
1. Ve a GitHub → New Repository
2. Nombre: escaleras-ferre-chatbot-api
3. Descripción: Backend del chatbot de Escaleras Ferre
4. Visibilidad: Private (por seguridad)
5. Crea el repositorio

# Opción B: Usar este directorio
# Los archivos ya están en /chatbot-api/ de este repo
```

### Paso 2: Obtener API Key de Groq

1. Ve a https://console.groq.com/keys
2. Inicia sesión o crea cuenta gratuita
3. Clic en "Create API Key"
4. Nombre: "Escaleras Ferre Chatbot"
5. **¡IMPORTANTE!** Copia la key inmediatamente (no se mostrará de nuevo)

### Paso 3: Desplegar en Railway

#### 3.1 Crear Cuenta y Proyecto

1. Ve a https://railway.app
2. Clic en "Start a New Project"
3. Conecta tu cuenta de GitHub
4. Selecciona "Deploy from GitHub repo"
5. Autoriza Railway para acceder a tus repositorios
6. Selecciona el repositorio `escaleras-ferre-chatbot-api`

#### 3.2 Configurar Variables de Entorno

1. En el dashboard del proyecto, ve a **"Variables"**
2. Agrega las siguientes variables:

```
GROQ_API_KEY=tu_api_key_de_groq_aqui
NODE_ENV=production
```

⚠️ **IMPORTANTE**: Railway asigna `PORT` automáticamente, NO lo agregues manualmente.

#### 3.3 Configurar Deployment

1. Railway detecta automáticamente Node.js
2. El deploy inicia automáticamente
3. Espera a que termine (1-3 minutos)
4. Verifica en los logs que veas:

```
🚀 Escaleras Ferre Chatbot API iniciado
📡 Puerto: [número]
🤖 Sistema híbrido: Respuestas rápidas + Groq IA
```

#### 3.4 Obtener URL del API

1. Ve a **"Settings"** → **"Domains"**
2. Haz clic en **"Generate Domain"**
3. Copia la URL (ejemplo: `https://escaleras-ferre-chatbot-api-production.up.railway.app`)
4. Prueba abriendo la URL en tu navegador (deberías ver un JSON con el status)

### Paso 4: Actualizar Frontend (GitHub Pages)

Edita tu archivo `index.html` en el repositorio principal:

```javascript
// Buscar la sección del chatbot y actualizar:

const CHATBOT_API_URL = 'https://tu-proyecto.up.railway.app/chat';

async function enviarMensaje(mensaje) {
    try {
        const response = await fetch(CHATBOT_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: mensaje,
                history: historialConversacion // Array con mensajes previos
            })
        });

        const data = await response.json();

        // data.response = Respuesta del chatbot
        // data.source = 'local', 'ai', o 'emergency'
        // data.intencion = 'Caliente', 'Tibio', 'Frío', 'Curioso'
        // data.info_extraida = { proyecto, urgencia, altura, etc. }

        return data.response;
    } catch (error) {
        console.error('Error al contactar API:', error);
        return 'Disculpa, problema de conexión. Intenta de nuevo en un momento.';
    }
}
```

## 🧪 Pruebas Locales

```bash
# 1. Instalar dependencias
npm install

# 2. Crear archivo .env
cp .env.example .env

# 3. Editar .env y agregar tu GROQ_API_KEY
nano .env

# 4. Ejecutar servidor
npm start

# El servidor estará en http://localhost:3000
```

### Probar Endpoints

```bash
# Health check
curl http://localhost:3000/health

# Estadísticas
curl http://localhost:3000/stats

# Enviar mensaje
curl -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hola", "history": []}'

# Mensaje que requiere IA
curl -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Necesito una escalera de 8 metros para construcción", "history": []}'
```

## 📊 Endpoints Disponibles

### POST /chat
Endpoint principal del chatbot

**Request:**
```json
{
  "message": "Necesito una escalera de 8 metros",
  "history": [
    {"role": "user", "content": "Hola"},
    {"role": "assistant", "content": "¡Hola! Soy Diana..."}
  ]
}
```

**Response:**
```json
{
  "response": "Para 8 metros te recomiendo extensión en fibra EF 8,60...",
  "source": "ai",
  "intencion": "Tibio",
  "info_extraida": {
    "altura": "8 metros",
    "proyecto": "Construcción",
    "urgencia": "Media"
  },
  "timestamp": "2025-12-06T..."
}
```

### GET /
Información del API y estadísticas básicas

### GET /health
Health check para Railway (responde `{"status": "ok"}`)

### GET /stats
Estadísticas detalladas

**Response:**
```json
{
  "mensajes_totales": 245,
  "respuestas_ia": 58,
  "respuestas_locales": 187,
  "leads_detectados": 34,
  "leads_calientes": 12,
  "leads_tibios": 22,
  "uptime_segundos": 86400,
  "uptime_horas": "24.00",
  "eficiencia_tokens": "76% ahorro",
  "conversion_leads": "14%"
}
```

### POST /stats/reset
Resetear estadísticas (solo para desarrollo/testing)

## 🔧 Configuración CORS

El API acepta peticiones desde:

- `https://nicolas2456.github.io`
- `https://escaleras-ferre.github.io`
- `http://localhost:3000`
- `http://localhost:5500`
- `http://127.0.0.1:5500`

Para agregar más orígenes, edita `app.js`:

```javascript
app.use(cors({
  origin: [
    'https://tu-dominio.com',
    // ... más orígenes
  ]
}));
```

## 📈 Optimización de Tokens

### Estrategia de 3 Niveles

1. **Respuestas Rápidas** (0 tokens)
   - Saludos: "hola", "buenos días", etc.
   - Contacto: "teléfono", "dirección", "ubicación"
   - Servicios: "alquiler", "mantenimiento", "venta"
   - Precios: "precio", "cotización", "cuánto cuesta"

2. **Fallback Local** (0 tokens)
   - Mensajes muy cortos sin keywords
   - Mensajes que no requieren IA

3. **Groq IA** (usa tokens)
   - Consultas específicas de productos
   - Comparaciones entre escaleras
   - Recomendaciones personalizadas
   - Consultas complejas

### Eficiencia Típica

- **70-80%** de mensajes respondidos localmente
- **20-30%** de mensajes requieren IA
- **Ahorro estimado**: 70-80% en costos de tokens

## 🛡️ Manejo de Errores

### Sistema de Fallback

Si Groq falla, el sistema responde automáticamente:

```
"Disculpa, problema técnico temporal. Para atención directa:
📱 Bogotá: 3008611868
📱 Bucaramanga: 3181027047 😊"
```

### Logs en Railway

Railway muestra logs en tiempo real:
- ⚡ Respuesta rápida
- 🤖 Usando Groq IA
- ✅ Respuesta generada
- ❌ Errores

## 📝 Notas Importantes

### Seguridad

- ✅ NUNCA subir la API key a GitHub
- ✅ Usar variables de entorno en Railway
- ✅ Repositorio privado recomendado
- ✅ CORS configurado para dominios específicos

### Rate Limits de Groq

- Plan gratuito: Límites según uso
- Monitorear estadísticas para evitar excesos
- Sistema híbrido minimiza llamadas a IA

### Railway

- **Auto-redeploy**: Cada push a main redespliega automáticamente
- **Sleeping**: Plan gratuito puede dormir el servicio (despertar ~30s)
- **Logs**: Disponibles en tiempo real en el dashboard
- **Environment**: Cambios en variables requieren redeploy manual

## 🔄 Actualización del API

```bash
# 1. Hacer cambios en el código
# 2. Commitear y pushear
git add .
git commit -m "feat: Mejora en detección de intención"
git push origin main

# 3. Railway redespliega automáticamente
# 4. Verificar logs en Railway dashboard
```

## 📊 Monitoreo y Métricas

### Estadísticas Clave a Monitorear

1. **Eficiencia de tokens**: Debe estar >70%
2. **Tasa de conversión a leads**: Depende del tráfico
3. **Uptime**: Debe estar >99%
4. **Errores**: Debe ser <1%

### Acceder a Estadísticas

```bash
# En navegador
https://tu-api.railway.app/stats

# O con curl
curl https://tu-api.railway.app/stats
```

## 🆘 Troubleshooting

### Problema: API no responde

1. Verificar que Railway muestra "Active"
2. Revisar logs en Railway dashboard
3. Verificar variable `GROQ_API_KEY` configurada
4. Probar endpoint `/health`

### Problema: Errores de CORS

1. Verificar que tu dominio está en la lista de orígenes
2. Revisar que usas HTTPS (no HTTP) en producción
3. Verificar headers en la petición fetch

### Problema: Respuestas muy lentas

1. Verificar plan de Railway (free puede ser lento)
2. Monitorear eficiencia de tokens (más IA = más lento)
3. Considerar cachear respuestas frecuentes

### Problema: API key inválida

1. Verificar que copiaste la key completa
2. Generar nueva key en console.groq.com
3. Actualizar variable en Railway
4. Redeploy manual si no actualiza

## 📞 Soporte

- **Groq API**: https://console.groq.com/docs
- **Railway**: https://docs.railway.app
- **GitHub Issues**: Crear issue en el repositorio

## 🎉 Características Inspiradas en Bot WhatsApp

✅ Sistema de detección de intención (Caliente/Tibio/Frío)
✅ Respuestas rápidas para ahorrar tokens
✅ Extracción automática de información del cliente
✅ Tracking de leads y conversión
✅ Modelo llama-3.3-70b-versatile
✅ Temperatura 0.7 para respuestas naturales
✅ Max tokens 200 para respuestas concisas
✅ Contexto limitado (últimos 4 mensajes)
✅ Estadísticas de eficiencia en tiempo real

---

**Versión**: 1.0.0
**Arquitectura**: Inspirado en bot WhatsApp exitoso
**Modelo IA**: llama-3.3-70b-versatile
**Última actualización**: Diciembre 2025
