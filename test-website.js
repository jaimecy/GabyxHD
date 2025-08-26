#!/usr/bin/env node

const https = require('https');
const http = require('http');
const { URL } = require('url');

// Colores para la consola
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function makeRequest(url, options = {}) {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const isHttps = urlObj.protocol === 'https:';
        const client = isHttps ? https : http;
        
        const requestOptions = {
            hostname: urlObj.hostname,
            port: urlObj.port || (isHttps ? 443 : 80),
            path: urlObj.pathname + urlObj.search,
            method: options.method || 'GET',
            headers: {
                'User-Agent': 'GabyxHD-Test-Script/1.0',
                'Accept': 'text/html,application/json,*/*',
                ...options.headers
            },
            timeout: options.timeout || 10000
        };

        const req = client.request(requestOptions, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                resolve({
                    statusCode: res.statusCode,
                    headers: res.headers,
                    data: data,
                    url: url
                });
            });
        });

        req.on('error', reject);
        req.on('timeout', () => {
            req.destroy();
            reject(new Error('Timeout'));
        });

        req.end();
    });
}

async function testEndpoint(url, description) {
    try {
        log(`\n🔍 Probando: ${description}`, 'cyan');
        log(`   URL: ${url}`, 'blue');
        
        const startTime = Date.now();
        const response = await makeRequest(url);
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        
        log(`   ✅ Status: ${response.statusCode}`, 'green');
        log(`   ⏱️  Tiempo de respuesta: ${responseTime}ms`, 'yellow');
        log(`   📏 Tamaño de respuesta: ${response.data.length} bytes`, 'yellow');
        
        // Verificar headers importantes
        if (response.headers['content-type']) {
            log(`   📄 Content-Type: ${response.headers['content-type']}`, 'blue');
        }
        if (response.headers['server']) {
            log(`   🖥️  Server: ${response.headers['server']}`, 'blue');
        }
        
        return { success: true, responseTime, statusCode: response.statusCode };
        
    } catch (error) {
        log(`   ❌ Error: ${error.message}`, 'red');
        return { success: false, error: error.message };
    }
}

async function testCORS(url, origin) {
    try {
        log(`\n🌐 Probando CORS desde: ${origin}`, 'cyan');
        
        const response = await makeRequest(url, {
            method: 'OPTIONS',
            headers: {
                'Origin': origin,
                'Access-Control-Request-Method': 'GET',
                'Access-Control-Request-Headers': 'Content-Type'
            }
        });
        
        const corsHeaders = {
            'access-control-allow-origin': response.headers['access-control-allow-origin'],
            'access-control-allow-methods': response.headers['access-control-allow-methods'],
            'access-control-allow-headers': response.headers['access-control-allow-headers']
        };
        
        log(`   ✅ CORS Headers:`, 'green');
        Object.entries(corsHeaders).forEach(([key, value]) => {
            if (value) {
                log(`      ${key}: ${value}`, 'blue');
            }
        });
        
        return true;
        
    } catch (error) {
        log(`   ❌ Error CORS: ${error.message}`, 'red');
        return false;
    }
}

async function runTests() {
    log('🚀 Iniciando pruebas de GabyxHD...', 'bright');
    log('=' * 50, 'blue');
    
    const startTime = Date.now();
    const results = [];
    
    // Pruebas de conectividad básica
    results.push(await testEndpoint('https://gabyxhd-production.up.railway.app/health', 'Backend Health Check'));
    results.push(await testEndpoint('https://gabyxhd-production.up.railway.app/api/ping', 'Backend Ping'));
    results.push(await testEndpoint('https://gabyxhd.netlify.app/', 'Web Principal (Netlify)'));
    results.push(await testEndpoint('https://montajesgabyxhd.art/', 'Dominio Personalizado'));
    
    // Pruebas de CORS
    await testCORS('https://gabyxhd-production.up.railway.app/api/ping', 'https://gabyxhd.netlify.app');
    await testCORS('https://gabyxhd-production.up.railway.app/api/ping', 'https://montajesgabyxhd.art');
    
    // Pruebas de rendimiento
    log('\n📊 Pruebas de Rendimiento...', 'magenta');
    const performanceTests = [];
    
    for (let i = 0; i < 3; i++) {
        const result = await testEndpoint('https://gabyxhd-production.up.railway.app/api/ping', `Ping ${i + 1}/3`);
        if (result.success) {
            performanceTests.push(result.responseTime);
        }
    }
    
    if (performanceTests.length > 0) {
        const avgResponseTime = performanceTests.reduce((a, b) => a + b, 0) / performanceTests.length;
        const minResponseTime = Math.min(...performanceTests);
        const maxResponseTime = Math.max(...performanceTests);
        
        log(`\n📈 Estadísticas de Rendimiento:`, 'magenta');
        log(`   Promedio: ${avgResponseTime.toFixed(2)}ms`, 'yellow');
        log(`   Mínimo: ${minResponseTime}ms`, 'green');
        log(`   Máximo: ${maxResponseTime}ms`, 'red');
    }
    
    // Resumen final
    const endTime = Date.now();
    const totalTime = endTime - startTime;
    const successfulTests = results.filter(r => r.success).length;
    const totalTests = results.length;
    
    log('\n' + '=' * 50, 'blue');
    log('📋 RESUMEN FINAL', 'bright');
    log(`   ⏱️  Tiempo total de pruebas: ${totalTime}ms`, 'yellow');
    log(`   ✅ Pruebas exitosas: ${successfulTests}/${totalTests}`, 'green');
    log(`   ❌ Pruebas fallidas: ${totalTests - successfulTests}/${totalTests}`, 'red');
    
    if (successfulTests === totalTests) {
        log('\n🎉 ¡Todas las pruebas pasaron exitosamente!', 'bright');
    } else {
        log('\n⚠️  Algunas pruebas fallaron. Revisa los errores arriba.', 'yellow');
    }
    
    log('\n🔧 Para más detalles, abre test-website.html en tu navegador', 'cyan');
}

// Manejar errores no capturados
process.on('unhandledRejection', (reason, promise) => {
    log(`\n❌ Error no manejado: ${reason}`, 'red');
    process.exit(1);
});

// Ejecutar pruebas
if (require.main === module) {
    runTests().catch(error => {
        log(`\n💥 Error fatal: ${error.message}`, 'red');
        process.exit(1);
    });
}

module.exports = { testEndpoint, testCORS };
