# 🤖 Escaleras Ferre Chatbot API

Backend híbrido inteligente para el chatbot de Escaleras Ferre que optimiza el uso de tokens usando Groq AI solo cuando es necesario.

## 🎯 Características

- **Sistema Híbrido**: Respuestas locales para consultas básicas + Groq IA para consultas complejas
- **Optimización de Tokens**: Ahorro automático usando respuestas locales primero
- **Modelo Optimizado**: Mixtral-8x7b-32768 (mejor para español)
- **Estadísticas**: Monitoreo de eficiencia y uso de IA
- **CORS Configurado**: Listo para GitHub Pages
- **Fallbacks de Emergencia**: Respuestas de respaldo si falla la IA

## 📁 Estructura del Proyecto

```
chatbot-api/
├── index.js              # Servidor Express principal
├── chatbot-logic.js      # Lógica de routing local/IA
├── escaleras-catalog.js  # Base de conocimientos completa
├── package.json          # Dependencias
├── .env.example          # Ejemplo de variables de entorno
├── .gitignore           # Archivos a ignorar
└── README.md            # Este archivo
```

## 🚀 Despliegue en Railway

### Paso 1: Crear nuevo repositorio en GitHub

```bash
# Crear repo en GitHub llamado: escaleras-ferre-chatbot-api
# Luego clonar y copiar estos archivos
git clone https://github.com/TU_USUARIO/escaleras-ferre-chatbot-api.git
cd escaleras-ferre-chatbot-api

# Copiar archivos del chatbot-api aquí
# Luego:
git add .
git commit -m "feat: Initial chatbot API setup"
git push origin main
```

### Paso 2: Obtener API Key de Groq

1. Ve a https://console.groq.com/keys
2. Inicia sesión o crea cuenta
3. Crea una nueva API Key
4. **¡IMPORTANTE!**: Copia la key (no se mostrará de nuevo)

### Paso 3: Desplegar en Railway

1. **Crear cuenta en Railway**
   - Ve a https://railway.app
   - Haz clic en "Start a New Project"
   - Conecta tu cuenta de GitHub

2. **Crear nuevo proyecto**
   - Selecciona "Deploy from GitHub repo"
   - Autoriza Railway para acceder a tus repositorios
   - Selecciona `escaleras-ferre-chatbot-api`

3. **Configurar variables de entorno**
   - En el dashboard del proyecto, ve a "Variables"
   - Agrega la variable:
     ```
     GROQ_API_KEY=tu_api_key_de_groq_aqui
     ```
   - Railway automáticamente asigna `PORT`

4. **Desplegar**
   - Railway detecta automáticamente Node.js
   - El deploy inicia automáticamente
   - Espera a que termine (1-2 minutos)

5. **Obtener URL del API**
   - Ve a "Settings" → "Domains"
   - Haz clic en "Generate Domain"
   - Copia la URL (ej: `https://tu-proyecto.railway.app`)

### Paso 4: Actualizar Frontend

Actualiza el archivo `index.html` en tu repositorio principal para usar la API:

```javascript
// Reemplazar el código del chatbot que usa Groq directamente
// por llamadas a tu backend:

const API_URL = 'https://tu-proyecto.railway.app/chat';

async function sendMessage(message) {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: message,
            history: conversationHistory
        })
    });

    const data = await response.json();
    return data.response;
}
```

## 🧪 Pruebas Locales

```bash
# Instalar dependencias
npm install

# Crear archivo .env
echo "GROQ_API_KEY=tu_api_key_aqui" > .env

# Ejecutar servidor
npm start

# El servidor estará en http://localhost:3000
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
  "response": "Para 8 metros te recomiendo la extensión EF 8,60...",
  "source": "ai",
  "model": "mixtral-8x7b-32768",
  "timestamp": "2025-12-06T..."
}
```

### GET /
Información del API y estadísticas

### GET /health
Health check para Railway

### GET /stats
Estadísticas detalladas de uso

**Response:**
```json
{
  "ai_calls": 45,
  "local_responses": 123,
  "total_messages": 168,
  "errors": 2,
  "efficiency_percent": 73,
  "message": "73% de respuestas sin usar IA (ahorro de tokens)"
}
```

## 🔧 Configuración CORS

El API está configurado para aceptar peticiones desde:

- `https://nicolas2456.github.io`
- `https://escaleras-ferre.github.io`
- `http://localhost:3000`
- `http://127.0.0.1:5500`

Para agregar más orígenes, edita el array en `index.js`:

```javascript
app.use(cors({
  origin: [
    'https://tu-dominio.com',
    // ... más orígenes
  ]
}));
```

## 📈 Optimización de Tokens

El sistema usa una estrategia de 3 niveles:

1. **Respuesta Local** (0 tokens): Saludos, contacto, precios genéricos
2. **Fallback Local** (0 tokens): Mensajes muy cortos o sin keywords
3. **Groq IA** (tokens): Solo para consultas específicas de productos

**Ejemplo de eficiencia típica**: 70-80% de respuestas sin usar tokens

## 🛡️ Manejo de Errores

Si Groq falla, el sistema responde automáticamente con:

```
"Disculpa, tuve un problema técnico. Para atención inmediata contacta:
📱 Bogotá: 3008611868 (Virtual)
📱 Bucaramanga: 3181027047 (Cll 34 #11-27)"
```

## 📝 Notas Importantes

- **API Key Security**: NUNCA subir la API key a GitHub
- **Rate Limits**: Groq tiene límites según tu plan
- **Logs**: Railway muestra logs en tiempo real en el dashboard
- **Auto-redeploy**: Cada push a main redespliega automáticamente
- **Sleeping**: Railway puede dormir el servicio en plan gratuito (despertar toma ~30s)

## 🔄 Actualización del API

```bash
# Hacer cambios en el código
git add .
git commit -m "fix: Mejora en respuestas"
git push origin main

# Railway redespliega automáticamente
```

## 📞 Soporte

Para problemas con:
- **Groq API**: https://console.groq.com
- **Railway**: https://docs.railway.app
- **Este código**: Crear issue en GitHub

---

**Versión**: 1.0.0
**Modelo IA**: Mixtral-8x7b-32768
**Última actualización**: Diciembre 2025
