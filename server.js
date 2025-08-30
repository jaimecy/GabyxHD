const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Archivo para almacenar los montajes permanentemente
const MONTAGES_FILE = path.join(__dirname, 'montajes.json');

// Middleware
app.use(cors({
    origin: true, // Permitir todos los orígenes temporalmente
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

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

// Función para cargar montajes desde el archivo
async function loadMontages() {
    try {
        const data = await fs.readFile(MONTAGES_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            // Si el archivo no existe, crear con datos iniciales
            const initialData = {
                montages: [
                    ['Fecha', 'Título del directo de Twitch', 'Precio €', 'Procesador', 'Tarjeta gráfica', 'Torre'],
                    ['2025-01-03', 'Montaje PC 1800€ MONTECH KING 95 BLANCO', '1800', 'AMD RYZEN 7 7700', 'NVIDIA RTX 4070 SUPER', 'MONTECH KING 95 PRO'],
                    ['2025-01-06', 'Montaje PC 2700€ - XPG INVADER X & RTX 4080 Super & Ryzen 9700X', '2700', 'AMD RYZEN 7 9700X', 'NVIDIA RTX 4080 SUPER', 'XPG INVADER X'],
                    ['2025-01-07', 'Montaje PC 3500€ | 4080 Super & AMD 9900X & NZXT H9 Flow', '3500', 'AMD RYZEN 9 9900X', 'NVIDIA RTX 4080 SUPER', 'NZXT H9 FLOW'],
                    ['2025-01-08', 'Montaje PC 1960€ | 4070 Ti Super & Ryzen 7700 & Antec C3', '1960', 'AMD RYZEN 7 7700', 'NVIDIA RTX 4070 TI SUPER', 'ANTEC C3'],
                    ['2025-01-10', 'Montaje PC 1950€ | Tower 300 + AMD 7700 + 4070 Super', '1950', 'AMD RYZEN 7 7700', 'NVIDIA RTX 4070 SUPER', 'THERMALTAKE TOWER 300'],
                    ['2025-01-11', 'Montaje PC 1900€ | Tower 300 + Ryzen 7900 + 4060 Ti 16GB', '1900', 'AMD RYZEN 9 7900', 'NVIDIA RTX 4060 TI 16GB', 'THERMALTAKE TOWER 300'],
                    ['2025-01-16', 'Montaje PC 1500€ Micro ATX - 7800XT & 7700X', '1500', 'AMD RYZEN 7 7700X', 'AMD RX 7800 XT', 'DEEPCOOL CH360 DIGITAL'],
                    ['2025-01-19', 'Montaje PC 2600€ - Lian Li Vision & 7800X3D & 4080 Super', '2600', 'AMD RYZEN 7 7800X3D', 'NVIDIA RTX 4080 SUPER', 'LIAN LI O11 VISION'],
                    ['2025-01-20', 'Montaje PC 1100€ - RTX 4060 & 7600X & MONTECH SKY TWO', '1100', 'AMD RYZEN 5 7600X', 'NVIDIA RTX 4060', 'MONTECH SKY TWO'],
                    ['2025-01-21', 'Montaje PC 1500€ QHD - RX 7800XT & 7600X & MONTECH SKY TWO', '1500', 'AMD RYZEN 5 7600X', 'AMD RX 7800 XT', 'MONTECH SKY TWO'],
                    ['2025-01-22', 'Montaje PC 2100€ - 4070 Ti Super & 9700X & MONTECH SKY TWO', '2100', 'AMD RYZEN 7 9700X', 'NVIDIA RTX 4070 TI SUPER', 'MONTECH SKY TWO'],
                    ['2025-01-25', 'Montaje PC 3500€ - 4080 Super + 9700X + HYTE Y70', '3500', 'AMD RYZEN 7 9700X', 'NVIDIA RTX 4080 SUPER', 'HYTE Y70'],
                    ['2025-01-26', 'Montaje PC 1660€ - 4070 Super + Ryzen 7700 + Nox Hummer Glock', '1660', 'AMD RYZEN 7 7700', 'NVIDIA RTX 4070 SUPER', 'NOX HUMMER GLOCK'],
                    ['2025-01-27', 'Montaje PC 2900€ Edicion - 4080 Super + Ryzen 7950X + DEEPCOOL CH560', '2900', 'AMD RYZEN 9 7950X', 'NVIDIA RTX 4080 SUPER', 'DEEPCOOL CH560'],
                    ['2025-02-01', 'Montaje PC 2850€ Blanco - 4080 Super & Ryzen 7900 & Lian Li Vision', '2850', 'AMD RYZEN 9 7900', 'NVIDIA RTX 4080 SUPER', 'LIAN LI O11 VISION'],
                    ['2025-02-03', 'Montaje PC 2300€ - 4070 Ti Super & AMD 7700 & HYTE Y60', '2300', 'AMD RYZEN 7 7700', 'NVIDIA RTX 4070 TI SUPER', 'HYTE Y60'],
                    ['2025-02-05', 'Montaje PC 1800€ - 4070 Ti Super & 7600X & Montech SKY TWO', '1800', 'AMD RYZEN 5 7600X', 'NVIDIA RTX 4070 TI SUPER', 'MONTECH SKY TWO'],
                    ['2025-02-12', 'Montaje PC 1550€ Blanco - RX 7700XT & 7600X & Montech King 95', '1550', 'AMD RYZEN 5 7600X', 'AMD RX 7700 XT', 'MONTECH KING 95 PRO'],
                    ['2025-02-14', 'Montaje PC 980€ Blanco - RTX 4060 & 12400F & DeepCool Ch360 Digital', '980', 'INTEL I5-12400F', 'NVIDIA RTX 4060', 'DEEPCOOL CH360 DIGITAL'],
                    ['2025-02-18', 'Montaje PC 2500€ - 9800X3D & 4070 Ti Super & Antec C7', '2500', 'AMD RYZEN 9 9800X3D', 'NVIDIA RTX 4070 TI SUPER', 'ANTEC C7'],
                    ['2025-02-24', 'Montaje PC 1850€ - 4070 Ti Super & AMD 7600 & Forgeon Arcanite', '1850', 'AMD RYZEN 5 7600', 'NVIDIA RTX 4070 TI SUPER', 'FORGEON ARCANITE'],
                    ['2025-03-04', 'Montaje PC 3200€ - RTX 5080 & 9800X3D & TUF GT302', '3200', 'AMD RYZEN 9 9800X3D', 'NVIDIA RTX 5080', 'ASUS TUF GT302'],
                    ['2025-03-06', 'Montaje PC 2350€ - 4070 Ti Super & 7600X & HYTE Y60', '2350', 'AMD RYZEN 5 7600X', 'NVIDIA RTX 4070 TI SUPER', 'HYTE Y60'],
                    ['2025-03-08', 'Montaje PC 1700€ - RX 7800XT & AMD 7700 & PHANTEKS EVOLV X2', '1700', 'AMD RYZEN 7 7700', 'AMD RX 7800 XT', 'PHANTEKS EVOLV X2'],
                    ['2025-03-12', 'Montaje PC 1000€ - i5 12400F & 4060 Ti & Montech XR', '1000', 'INTEL I5-12400F', 'NVIDIA RTX 4060 TI', 'MONTECH XR'],
                    ['2025-03-16', 'Montaje PC 2400€ - 4070 Ti Super & 9700X & NZXT H7 Flow', '2400', 'AMD RYZEN 7 9700X', 'NVIDIA RTX 4070 TI SUPER', 'NZXT H7 FLOW'],
                    ['2025-03-17', 'Montaje PC 4000€ - RTX 5080 & 9800X3D & HYTE Y70', '4000', 'AMD RYZEN 9 9800X3D', 'NVIDIA RTX 5080', 'HYTE Y70'],
                    ['2025-03-18', 'Montaje PC 3250€ - RTX 5080 & 9800X3D & HYTE Y60', '3250', 'AMD RYZEN 9 9800X3D', 'NVIDIA RTX 5080', 'HYTE Y60'],
                    ['2025-03-19', 'Montaje PC 2400€ - RTX 5070 Ti & 7800X3D & TUF GT302', '2400', 'AMD RYZEN 7 7800X3D', 'NVIDIA RTX 5070 TI', 'ASUS TUF GT302'],
                    ['2025-03-24', 'Montaje PC 1400€ - 7800XT & 7600X & ANTEC C3', '1400', 'AMD RYZEN 5 7600X', 'AMD RX 7800 XT', 'ANTEC C3'],
                    ['2025-03-25', 'Montaje PC 2550€ - RX 9070 & 7800X3D & LIAN LI VISION', '2550', 'AMD RYZEN 7 7800X3D', 'AMD RX 9070', 'LIAN LI O11 VISION'],
                    ['2025-03-27', 'Montaje PC 2300€ - RTX 5070 Ti & 7800X3D & MONTECH GX', '2300', 'AMD RYZEN 7 7800X3D', 'NVIDIA RTX 5070 TI', 'MONTECH GX'],
                    ['2025-03-30', 'Montaje PC 2500€ - RTX 5070 Ti & 7800X3D & DEEPCOOL CH560', '2500', 'AMD RYZEN 7 7800X3D', 'NVIDIA RTX 5070 TI', 'DEEPCOOL CH560'],
                    ['2025-04-01', 'Montaje PC 4200€ - RTX 5080 & 9800X3D & HYTE Y70', '4200', 'AMD RYZEN 9 9800X3D', 'NVIDIA RTX 5080', 'HYTE Y70'],
                    ['2025-04-02', 'Montaje PC 1300€ - 7800 XT & 7600X & MONTECH XR', '1300', 'AMD RYZEN 5 7600X', 'AMD RX 7800 XT', 'MONTECH XR'],
                    ['2025-04-04', 'Montaje PC 2350€ Blanco - 9070 XT & 7700X & Lian Li Evo', '2350', 'AMD RYZEN 7 7700X', 'AMD RX 9070 XT', 'LIAN LI O11 DYNAMIC EVO'],
                    ['2025-04-06', 'Montaje PC 3900€ - RTX 5080 & 9800X3D & LIAN LI VISION CHROME', '3900', 'AMD RYZEN 9 9800X3D', 'NVIDIA RTX 5080', 'LIAN LI O11 VISION'],
                    ['2025-04-08', 'Montaje PC 3750€ - RTX 5080 & 9800X3D & Lian Li Evo', '3750', 'AMD RYZEN 9 9800X3D', 'NVIDIA RTX 5080', 'LIAN LI O11 DYNAMIC EVO'],
                    ['2025-04-13', 'Montaje PC 3100€ - RTX 5080 & 9800X3D & LIAN LI DYNAMIC', '3100', 'AMD RYZEN 9 9800X3D', 'NVIDIA RTX 5080', 'LIAN LI O11 DYNAMIC'],
                    ['2025-04-14', 'Montaje PC 5100€ - RTX 5080 & 9800X3D & LIAN LI EVO & Muchos Extras', '5100', 'AMD RYZEN 9 9800X3D', 'NVIDIA RTX 5080', 'LIAN LI O11 DYNAMIC EVO'],
                    ['2025-04-16', 'Montaje PC 3250€ - RTX 5080 & 9800X3D & Phanteks EVOLV X2 Dorada', '3250', 'AMD RYZEN 9 9800X3D', 'NVIDIA RTX 5080', 'PHANTEKS EVOLV X2'],
                    ['2025-04-19', 'Montaje PC 7700€! - El PC GAMER MAS POTENTE DEL MUNDO 2025', '7700', 'INTEL CORE ULTRA 9 285K', 'NVIDIA RTX 5090', 'LIAN LI O11D EVO RGB LAMBORGHINI'],
                    ['2025-04-22', 'Montaje PC 2100€ Edicion 3D - RTX 5070 Ti & 7900 & DeepCool Ch360', '2100', 'AMD RYZEN 9 7900', 'NVIDIA RTX 5070 TI', 'DEEPCOOL CH360'],
                    ['2025-04-24', 'Montaje PC 2650€ Blanco - RTX 5070 Ti & 7800X3D & HYTE Y70', '2650', 'AMD RYZEN 7 7800X3D', 'NVIDIA RTX 5070 TI', 'HYTE Y70'],
                    ['2025-04-26', 'Montaje PC 2850€ Blanco - RTX 5070 Ti & 7800X3D & LIAN LI EVO', '2850', 'AMD RYZEN 7 7800X3D', 'NVIDIA RTX 5070 TI', 'LIAN LI O11 DYNAMIC EVO'],
                    ['2025-04-29', 'Montaje PC 3000€ - RTX 5080 & 9800X3D & LIAN LI VISION CHROME', '3000', 'AMD RYZEN 9 9800X3D', 'NVIDIA RTX 5080', 'LIAN LI O11 VISION'],
                    ['2025-05-02', 'Montaje PC 2750€ - RTX 5080 & 7800X3D & Phanteks Evolv X2 Gold', '2750', 'AMD RYZEN 7 7800X3D', 'NVIDIA RTX 5080', 'PHANTEKS EVOLV X2'],
                    ['2025-05-20', 'Montaje PC 2160€ - 5070 Ti & R7 7700 & Lian Li Evo', '2160', 'AMD RYZEN 7 7700', 'NVIDIA RTX 5070 TI', 'LIAN LI O11 DYNAMIC EVO'],
                    ['2025-05-21', 'Montaje PC 3000€ - RTX 5080 & 9800X3D & Antec C7', '3000', 'AMD RYZEN 9 9800X3D', 'NVIDIA RTX 5080', 'ANTEC C7'],
                    ['2025-05-22', 'Montaje PC 2300€ - RTX 5070 Ti & 7800X3D & XPG Invader X', '2300', 'AMD RYZEN 7 7800X3D', 'NVIDIA RTX 5070 TI', 'XPG INVADER X'],
                    ['2025-05-26', 'Montaje PC 3200€ - RTX 5070 Ti & 9800X3D & HYTE Y70 Touch', '3200', 'AMD RYZEN 9 9800X3D', 'NVIDIA RTX 5070 TI', 'HYTE Y70'],
                    ['2025-05-27', 'Montaje PC 5400€ Full Blanco - RTX 5090 & 9800X3D & Lian Li Vision', '5400', 'AMD RYZEN 9 9800X3D', 'NVIDIA RTX 5090', 'LIAN LI O11 VISION'],
                    ['2025-05-29', 'Montaje PC 3900€ - RTX 5080 & 9800X3D & Lian Li Evo', '3900', 'AMD RYZEN 9 9800X3D', 'NVIDIA RTX 5080', 'LIAN LI O11 DYNAMIC EVO'],
                    ['2025-06-05', 'Montaje PC 2350€ - RTX 5070 Ti & 9800X3D & Einarex S700', '2350', 'AMD RYZEN 9 9800X3D', 'NVIDIA RTX 5070 TI', 'EINAREX S700'],
                    ['2025-06-11', 'Montaje PC 3400€ - RTX 5080 & 9800X3D & HYTE Y70', '3400', 'AMD RYZEN 9 9800X3D', 'NVIDIA RTX 5080', 'HYTE Y70'],
                    ['2025-06-16', 'Montaje PC 2100€ - RTX 5070 Ti & 7800X3D & HYTE Y70', '2100', 'AMD RYZEN 7 7800X3D', 'NVIDIA RTX 5070 TI', 'HYTE Y70'],
                    ['2025-06-18', 'Montaje PC 3700€ - 9950X3D & RTX 5080 & Lian Li Evo', '3700', 'AMD RYZEN 9 9950X3D', 'NVIDIA RTX 5080', 'LIAN LI O11 DYNAMIC EVO'],
                    ['2025-06-19', 'Montaje PC 4600€ - 9950X3D & RTX 5080 & Thermaltake Tower 600', '4600', 'AMD RYZEN 9 9950X3D', 'NVIDIA RTX 5080', 'THERMALTAKE TOWER 600'],
                    ['2025-06-23', 'Montaje PC 3800€ - 9800X3D & RTX 5080 & Lian Li Evo', '3800', 'AMD RYZEN 9 9800X3D', 'NVIDIA RTX 5080', 'LIAN LI O11 DYNAMIC EVO'],
                    ['2025-06-24', 'Montaje PC 3650€ - 9800X3D & RTX 5080 & NZXT H9 Flow RGB', '3650', 'AMD RYZEN 9 9800X3D', 'NVIDIA RTX 5080', 'NZXT H9 FLOW'],
                    ['2025-06-25', 'Montaje PC 5000€ - 9950X3D & RTX 5080 Astral & NZXT & Lian Li Evo', '5000', 'AMD RYZEN 9 9950X3D', 'NVIDIA RTX 5080', 'LIAN LI O11 DYNAMIC EVO'],
                    ['2025-07-01', 'Montaje PC 3200€ - 9800X3D & RTX 5080 & Phanteks Evolv X2', '3200', 'AMD RYZEN 9 9800X3D', 'NVIDIA RTX 5080', 'PHANTEKS EVOLV X2'],
                    ['2025-07-03', 'Montaje PC 5100€ - Core Ultra 9 285K & RTX 5080 & Asus Rog Hyperion', '5100', 'INTEL CORE ULTRA 9 285K', 'NVIDIA RTX 5080', 'ASUS ROG HYPERION'],
                    ['2025-07-08', 'Montaje PC 3500€ Blanco - 9800X3D & RTX 5080 & Lian Li Evo', '3500', 'AMD RYZEN 9 9800X3D', 'NVIDIA RTX 5080', 'LIAN LI O11 DYNAMIC EVO'],
                    ['2025-07-09', 'Montaje PC 4100€ Blanco - 9950X3D & RTX 5080 & HYTE Y70 Touch', '4100', 'AMD RYZEN 9 9950X3D', 'NVIDIA RTX 5080', 'HYTE Y70'],
                    ['2025-07-10', 'Montaje PC 3500€ - 9800X3D & RTX 5080 & Asus Tuf GT502', '3500', 'AMD RYZEN 9 9800X3D', 'NVIDIA RTX 5080', 'ASUS TUF GT502'],
                    ['2025-07-15', 'Montaje PC 1900€ - 7800X3D & RT 5060 Ti 16GB & Asus Tuf GT502', '1900', 'AMD RYZEN 7 7800X3D', 'NVIDIA RTX 5060 TI 16GB', 'ASUS TUF GT502'],
                    ['2025-07-16', 'Montaje PC 3000€ - 9800X3D & RTX 5080 & XYZ TESSERACT', '3000', 'AMD RYZEN 9 9800X3D', 'NVIDIA RTX 5080', 'XYZ TESSERACT'],
                    ['2025-07-17', 'Montaje PC 2900€ - 9800X3D & RTX 5080 & ASUS A31 Plus', '2900', 'AMD RYZEN 9 9800X3D', 'NVIDIA RTX 5080', 'ASUS A31 PLUS'],
                    ['2025-07-21', 'Montaje PC 2000€ - 7800X3D & RTX 5070 Ti & MSI Pano 110R PZ', '2000', 'AMD RYZEN 7 7800X3D', 'NVIDIA RTX 5070 TI', 'MSI PANO 110R PZ'],
                    ['2025-07-22', 'Montaje PC 6000€ - 9950X3D & RTX 5090 & Hyte Y70 Snow', '6000', 'AMD RYZEN 9 9950X3D', 'NVIDIA RTX 5090', 'HYTE Y70'],
                    ['2025-07-23', 'Montaje PC 2450€ - 7800X3D & RTX 5080 & Asus A31 Plus', '2450', 'AMD RYZEN 7 7800X3D', 'NVIDIA RTX 5080', 'ASUS A31 PLUS'],
                    ['2025-07-25', 'Montaje PC 3000€ Blanco - 9800X3D & RTX 5080 Aero & Hyte Y70', '3000', 'AMD RYZEN 9 9800X3D', 'NVIDIA RTX 5080', 'HYTE Y70'],
                    ['2025-07-28', 'Montaje PC 3400€ - 9800X3D & RTX 5080 Aero & Lian Li Evo', '3400', 'AMD RYZEN 9 9800X3D', 'NVIDIA RTX 5080', 'LIAN LI O11 DYNAMIC EVO'],
                    ['2025-07-30', 'Montaje PC 3400€ Blanco - 9800X3D & RTX 5080 Aero & Lian Li Evo', '3400', 'AMD RYZEN 9 9800X3D', 'NVIDIA RTX 5080', 'LIAN LI O11 DYNAMIC EVO'],
                    ['2025-07-31', 'Montaje PC 3100€ Blanco - 9800X3D & RTX 5080 Aero & Lian Li Evo', '3100', 'AMD RYZEN 9 9800X3D', 'NVIDIA RTX 5080', 'LIAN LI O11 DYNAMIC EVO'],
                    ['2025-08-01', 'Montaje PC 2300€ - 9800X3D & RTX 5070 Ti & MSi Pano 110R PZ', '2300', 'AMD RYZEN 9 9800X3D', 'NVIDIA RTX 5070 TI', 'MSI PANO 110R PZ'],
                    ['2025-08-05', 'Montaje PC 4400€ - 9800X3D - RTX 5080 Astral & Phanteks NV5', '4400', 'AMD RYZEN 9 9800X3D', 'NVIDIA RTX 5080', 'PHANTEKS NV5'],
                    ['2025-08-07', 'Montaje PC 3250€ - 9800X3D & RTX 5080 & Lian Li Evo', '3250', 'AMD RYZEN 9 9800X3D', 'NVIDIA RTX 5080', 'LIAN LI O11 DYNAMIC EVO'],
                    ['2025-08-08', 'Montaje PC 2100€ - 7800X3D & RTX 5070 Ti & NZXT H7 Flow', '2100', 'AMD RYZEN 7 7800X3D', 'NVIDIA RTX 5070 TI', 'NZXT H7 FLOW'],
                    ['2025-08-11', 'Montaje PC 1850€ - 9700X & RX 9070XT & ASUS A31 Plus', '1850', 'AMD RYZEN 7 9700X', 'AMD RX 9070 XT', 'ASUS A31 PLUS'],
                    ['2025-08-12', 'Montamos el PC de AWITA - 6000€ - RTX 5090 & 9950X3D & Phanteks Evolv X2', '6000', 'AMD RYZEN 9 9950X3D', 'NVIDIA RTX 5090', 'PHANTEKS EVOLV X2'],
                    ['2025-08-22', 'Montaje PC 3300€ - RTX 5080 & 9800X3D & Lian Li Evo', '3300', 'AMD RYZEN 9 9800X3D', 'NVIDIA RTX 5080', 'LIAN LI O11 DYNAMIC EVO'],
                    ['2025-08-25', 'Montaje PC 3150€ - RTX 5080 & 9800X3D & Phanteks Evolv X2', '3150', 'AMD RYZEN 9 9800X3D', 'NVIDIA RTX 5080', 'PHANTEKS EVOLV X2'],
                    ['2025-08-26', 'Montaje PC 1530€ Full Blanco - RTX 5070 & 9600X & MSI Pano 110R PZ', '1530', 'AMD RYZEN 5 9600X', 'NVIDIA RTX 5070', 'MSI PANO 110R PZ'],
                    ['2025-08-28', 'Montaje PC 2950€ Invertido - 9800X3D & RTX 5080 & BeQuiet 600 LX', '2950', 'AMD RYZEN 9 9800X3D', 'NVIDIA RTX 5080', 'BEQUIET 600 LX']
                ]
            };
            
            // Guardar datos iniciales
            await fs.writeFile(MONTAGES_FILE, JSON.stringify(initialData, null, 2));
            console.log('✅ Archivo de montajes creado con datos iniciales');
            
            return initialData;
        }
        throw error;
    }
}

// Función para guardar montajes en el archivo
async function saveMontages(data) {
    try {
        await fs.writeFile(MONTAGES_FILE, JSON.stringify(data, null, 2));
        console.log('✅ Montajes guardados correctamente');
        return true;
    } catch (error) {
        console.error('❌ Error al guardar montajes:', error);
        return false;
    }
}

// Endpoint de ping para verificar conectividad
app.get('/api/ping', (req, res) => {
    res.json({
        success: true,
        message: 'Pong!',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Endpoint principal para obtener todos los montajes
app.get('/api/sheets-data', async (req, res) => {
    try {
        console.log('📊 Solicitando todos los montajes...');
        
        const montagesData = await loadMontages();
        
        console.log(`✅ Montajes obtenidos: ${montagesData.montages.length - 1} filas (sin headers)`);

        res.json({
            success: true,
            headers: montagesData.montages[0],
            data: montagesData.montages.slice(1),
            totalRows: montagesData.montages.length - 1,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ Error al obtener montajes:', error);
        res.status(500).json({
            success: false,
            error: 'Error al obtener montajes',
            message: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
        });
    }
});

// NUEVO: Endpoint para importar datos masivos
app.post('/api/import-montages', async (req, res) => {
    try {
        const { montages } = req.body;
        
        if (!montages || !Array.isArray(montages)) {
            return res.status(400).json({
                success: false,
                error: 'Datos de montajes inválidos'
            });
        }
        
        console.log(`📥 Importando ${montages.length} montajes...`);
        
        // Cargar montajes existentes
        const montagesData = await loadMontages();
        
        // Reemplazar todos los montajes (mantener headers)
        montagesData.montages = [montagesData.montages[0], ...montages];
        
        // Guardar en archivo
        const saved = await saveMontages(montagesData);
        
        if (saved) {
            console.log(`✅ ${montages.length} montajes importados correctamente`);
            res.json({
                success: true,
                message: `${montages.length} montajes importados correctamente`,
                totalMontages: montagesData.montages.length - 1,
                timestamp: new Date().toISOString()
            });
        } else {
            throw new Error('Error al guardar los montajes');
        }
        
    } catch (error) {
        console.error('❌ Error al importar montajes:', error);
        res.status(500).json({
            success: false,
            error: 'Error al importar montajes',
            message: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
        });
    }
});

// NUEVO: Endpoint para añadir un nuevo montaje
app.post('/api/add-montage', async (req, res) => {
    try {
        const { fecha, titulo, precio, procesador, grafica, torre } = req.body;
        
        // Validar datos requeridos
        if (!fecha || !titulo || !precio || !procesador || !grafica || !torre) {
            return res.status(400).json({
                success: false,
                error: 'Todos los campos son requeridos'
            });
        }
        
        console.log('➕ Añadiendo nuevo montaje:', { fecha, titulo, precio, procesador, grafica, torre });
        
        // Cargar montajes existentes
        const montagesData = await loadMontages();
        
        // Añadir nuevo montaje al inicio (después de headers)
        const newMontage = [fecha, titulo, precio, procesador, grafica, torre];
        montagesData.montages.splice(1, 0, newMontage);
        
        // Guardar en archivo
        const saved = await saveMontages(montagesData);
        
        if (saved) {
            console.log('✅ Montaje añadido correctamente');
            res.json({
                success: true,
                message: 'Montaje añadido correctamente',
                montage: newMontage,
                totalMontages: montagesData.montages.length - 1,
                timestamp: new Date().toISOString()
            });
        } else {
            throw new Error('Error al guardar el montaje');
        }
        
    } catch (error) {
        console.error('❌ Error al añadir montaje:', error);
        res.status(500).json({
            success: false,
            error: 'Error al añadir montaje',
            message: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
        });
    }
});

// NUEVO: Endpoint para eliminar un montaje
app.delete('/api/delete-montage/:index', async (req, res) => {
    try {
        const index = parseInt(req.params.index);
        
        if (isNaN(index) || index < 0) {
            return res.status(400).json({
                success: false,
                error: 'Índice de montaje inválido'
            });
        }
        
        console.log(`🗑️ Eliminando montaje en índice: ${index}`);
        
        // Cargar montajes existentes
        const montagesData = await loadMontages();
        
        console.log(`📊 Total montajes en archivo: ${montagesData.montages.length}`);
        console.log(`🎯 Índice a eliminar: ${index}`);
        console.log(`📋 Montaje en índice ${index}:`, montagesData.montages[index]);
        
        // Verificar que el índice sea válido
        if (index >= montagesData.montages.length) {
            console.log(`❌ Índice ${index} inválido - fuera de rango`);
            return res.status(404).json({
                success: false,
                error: 'Montaje no encontrado'
            });
        }
        
        // Eliminar montaje (el índice ya incluye el offset de los headers)
        const deletedMontage = montagesData.montages.splice(index, 1)[0];
        console.log(`✂️ Montaje eliminado:`, deletedMontage);
        
        // Guardar en archivo
        const saved = await saveMontages(montagesData);
        
        if (saved) {
            console.log('✅ Montaje eliminado correctamente');
            res.json({
                success: true,
                message: 'Montaje eliminado correctamente',
                deletedMontage: deletedMontage,
                totalMontages: montagesData.montages.length - 1,
                timestamp: new Date().toISOString()
            });
        } else {
            throw new Error('Error al guardar los cambios');
        }
        
    } catch (error) {
        console.error('❌ Error al eliminar montaje:', error);
        res.status(500).json({
            success: false,
            error: 'Error al eliminar montaje',
            message: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
        });
    }
});

// NUEVO: Endpoint para eliminar un montaje por fecha
app.delete('/api/delete-montage-by-date', async (req, res) => {
    try {
        const { fecha, titulo } = req.body;
        
        if (!fecha) {
            return res.status(400).json({
                success: false,
                error: 'Fecha es requerida'
            });
        }
        
        console.log(`🗑️ Eliminando montaje por fecha: ${fecha}, título: ${titulo || 'N/A'}`);
        
        // Cargar montajes existentes
        const montagesData = await loadMontages();
        
        // Buscar el montaje por fecha (y título si está disponible)
        let montageIndex = -1;
        for (let i = 1; i < montagesData.montages.length; i++) {
            const montage = montagesData.montages[i];
            if (montage[0] === fecha) {
                // Si tenemos título, verificar que coincida también
                if (titulo && montage[1] === titulo) {
                    montageIndex = i;
                    break;
                } else if (!titulo) {
                    // Si no tenemos título, usar la primera fecha que coincida
                    montageIndex = i;
                    break;
                }
            }
        }
        
        if (montageIndex === -1) {
            return res.status(404).json({
                success: false,
                error: `No se encontró montaje con fecha: ${fecha}`
            });
        }
        
        // Eliminar el montaje encontrado
        const deletedMontage = montagesData.montages.splice(montageIndex, 1);
        
        console.log(`🗑️ Montaje eliminado:`, deletedMontage[0]);
        
        // Guardar en archivo
        const saved = await saveMontages(montagesData);
        
        if (saved) {
            console.log('✅ Montaje eliminado correctamente por fecha');
            res.json({
                success: true,
                message: 'Montaje eliminado correctamente por fecha',
                deletedMontage: deletedMontage[0],
                totalMontages: montagesData.montages.length - 1,
                timestamp: new Date().toISOString()
        });
        } else {
            throw new Error('Error al guardar los cambios');
        }
        
    } catch (error) {
        console.error('❌ Error al eliminar montaje por fecha:', error);
        res.status(500).json({
            success: false,
            error: 'Error al eliminar montaje por fecha',
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
    console.log(`💾 Almacenamiento: Archivo local (${MONTAGES_FILE})`);
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
