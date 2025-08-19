# 🖥️ PC Builds Analyzer - Backend Seguro

Backend optimizado y seguro para analizar builds de PC desde Google Sheets, con protección completa de claves API.

## ✨ Características

- 🔒 **100% Seguro**: Clave API completamente oculta
- 🚀 **Optimizado**: Código limpio y eficiente para producción
- 📊 **Google Sheets**: Conexión directa y segura
- 🌐 **CORS Configurado**: Seguridad para producción
- 📝 **Logging Avanzado**: Monitoreo completo de requests
- 🏥 **Health Checks**: Endpoints para Railway
- 🛡️ **Manejo de Errores**: Respuestas consistentes y seguras

## 🚀 Instalación Local

### 1. Clonar y Instalar
```bash
git clone <tu-repositorio>
cd pc-builds-analyzer
npm install
```

### 2. Configurar Variables de Entorno
Copia `config.example` a `.env`:
```bash
cp config.example .env
```

Edita `.env` con tus credenciales:
```env
GOOGLE_API_KEY=tu_clave_api_real_aqui
SPREADSHEET_ID=1OCMcUJ0VerXZLEgyjapb_lNvRZQL05lIcGf882AaTfU
NODE_ENV=development
```

### 3. Ejecutar
```bash
# Desarrollo (con auto-reload)
npm run dev

# Producción
npm start
```

## 🌐 Endpoints Disponibles

### 📊 Datos de Google Sheets
```
GET /api/sheets-data
```
**Respuesta:**
```json
{
  "success": true,
  "headers": ["Fecha", "Título", "Precio", "Procesador", "Gráfica", "Torre"],
  "data": [...],
  "totalRows": 82,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 🧪 Test del Servidor
```
GET /api/test
```

### 🏥 Estado del Servidor
```
GET /health
```

## 🚀 Deploy en Railway

### 1. Preparar Repositorio
```bash
git add .
git commit -m "Backend optimizado para Railway"
git push origin main
```

### 2. Conectar Railway
- Ve a [Railway.app](https://railway.app)
- Conecta tu repositorio de GitHub
- Railway detectará automáticamente la configuración

### 3. Configurar Variables
En Railway Dashboard:
- `GOOGLE_API_KEY`: Tu clave API de Google
- `SPREADSHEET_ID`: ID de tu spreadsheet
- `NODE_ENV`: `production`

### 4. Deploy Automático
Railway hará deploy automático en cada push a `main`.

## 🔧 Optimizaciones Implementadas

### Frontend (`index.html`)
- ✅ Código JavaScript limpio y eficiente
- ✅ Eliminación de funciones no utilizadas
- ✅ Manejo optimizado de datos del backend
- ✅ Estructura de clase mejorada

### Backend (`server.js`)
- ✅ Middleware de logging avanzado
- ✅ Manejo robusto de errores
- ✅ CORS configurado para producción
- ✅ Health checks para Railway
- ✅ Cierre graceful del servidor
- ✅ Validación de variables de entorno
- ✅ Respuestas consistentes y seguras

### Configuración
- ✅ `package.json` optimizado con scripts de producción
- ✅ Configuración específica para Railway
- ✅ Variables de entorno organizadas
- ✅ Engines especificados para compatibilidad

## 📊 Monitoreo y Logs

El servidor registra automáticamente:
- Todas las requests con timestamp
- Errores detallados
- Estado de variables de entorno
- Métricas de rendimiento

## 🛡️ Seguridad

- **API Key**: Completamente oculta en variables de entorno
- **CORS**: Configurado para dominios específicos en producción
- **Rate Limiting**: Protección contra abuso (configurable)
- **Error Handling**: No expone información sensible en producción

## 🔄 Actualizaciones

Para actualizar:
```bash
git pull origin main
npm install
npm start
```

Railway detectará cambios automáticamente.

## 📞 Soporte

- **Issues**: [GitHub Issues](https://github.com/tu-usuario/pc-builds-analyzer/issues)
- **Documentación**: [Wiki del Proyecto](https://github.com/tu-usuario/pc-builds-analyzer/wiki)

---

**¡Tu aplicación está lista para producción! 🎉**
