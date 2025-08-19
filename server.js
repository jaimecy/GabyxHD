const express = require('express');
const cors = require('cors');
const { google } = require('googleapis');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://tu-dominio.railway.app'] // Cambiar por tu dominio real
        : true,
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Configuración de Google Sheets
const sheets = google.sheets({ version: 'v4' });

// Middleware de logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ 
        success: false, 
        error: 'Error interno del servidor',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Algo salió mal'
    });
});

// Endpoint principal para obtener datos de Google Sheets
app.get('/api/sheets-data', async (req, res) => {
    try {
        const apiKey = process.env.GOOGLE_API_KEY;
        const spreadsheetId = process.env.SPREADSHEET_ID;

        if (!apiKey || !spreadsheetId) {
            console.error('Variables de entorno faltantes:', { 
                hasApiKey: !!apiKey, 
                hasSpreadsheetId: !!spreadsheetId 
            });
            return res.status(500).json({
                success: false,
                error: 'Configuración del servidor incompleta'
            });
        }

        console.log('Solicitando datos de Google Sheets...');
        
        const response = await sheets.spreadsheets.values.get({
            auth: apiKey,
            spreadsheetId: spreadsheetId,
            range: 'Datos!A:F'
        });

        const values = response.data.values;
        
        if (!values || values.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'No se encontraron datos en la hoja'
            });
        }

        // Procesar datos
        const headers = values[0];
        const rows = values.slice(1).map(row => {
            const processedRow = {};
            headers.forEach((header, index) => {
                processedRow[header] = row[index] || '';
            });
            return processedRow;
        });

        console.log(`Datos obtenidos: ${rows.length} filas`);

        res.json({
            success: true,
            headers: headers,
            data: rows,
            totalRows: rows.length,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Error al obtener datos de Google Sheets:', error);
        
        if (error.code === 403) {
            return res.status(403).json({
                success: false,
                error: 'Acceso denegado a Google Sheets. Verifica tu API key.'
            });
        }
        
        if (error.code === 404) {
            return res.status(404).json({
                success: false,
                error: 'Spreadsheet no encontrado. Verifica el ID.'
            });
        }

        res.status(500).json({
            success: false,
            error: 'Error al obtener datos de Google Sheets',
            message: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
        });
    }
});

// Endpoint de prueba
app.get('/api/test', (req, res) => {
    res.json({
        success: true,
        message: 'Servidor funcionando correctamente',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Endpoint de salud para Railway
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'Ruta no encontrada'
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor iniciado en puerto ${PORT}`);
    console.log(`📊 Entorno: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔑 API Key configurada: ${process.env.GOOGLE_API_KEY ? '✅' : '❌'}`);
    console.log(`📋 Spreadsheet ID: ${process.env.SPREADSHEET_ID || 'No configurado'}`);
    console.log(`🌐 CORS habilitado para: ${process.env.NODE_ENV === 'production' ? 'dominio específico' : 'todos los orígenes'}`);
});

// Manejo de señales para cierre graceful
process.on('SIGTERM', () => {
    console.log('🛑 Señal SIGTERM recibida, cerrando servidor...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('🛑 Señal SIGINT recibida, cerrando servidor...');
    process.exit(0);
});

module.exports = app;
