// Protección contra herramientas de desarrollo
(function() {
    'use strict';
    
    // Verificar si estamos en localhost (desarrollo)
    const isLocalhost = window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1' || 
                       window.location.hostname === '';

    // Solo aplicar protecciones si NO estamos en localhost
    if (!isLocalhost) {
        
        // Deshabilitar clic derecho
        document.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            return false;
        });

        // Deshabilitar teclas de acceso rápido a DevTools
        document.addEventListener('keydown', function(e) {
            // F12
            if (e.keyCode === 123) {
                e.preventDefault();
                return false;
            }
            
            // Ctrl+Shift+I (Inspeccionar)
            if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
                e.preventDefault();
                return false;
            }
            
            // Ctrl+Shift+J (Consola)
            if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
                e.preventDefault();
                return false;
            }
            
            // Ctrl+U (Ver código fuente)
            if (e.ctrlKey && e.keyCode === 85) {
                e.preventDefault();
                return false;
            }
            
            // Ctrl+Shift+C (Inspeccionar elemento)
            if (e.ctrlKey && e.shiftKey && e.keyCode === 67) {
                e.preventDefault();
                return false;
            }
        });

        // Deshabilitar consola de manera más suave
        if (typeof console !== 'undefined') {
            console.log = function() {};
            console.info = function() {};
            console.warn = function() {};
            console.error = function() {};
            console.debug = function() {};
        }
        
    } else {
        // Si estamos en localhost, permitir consola para debugging
        console.log('🔧 Modo desarrollo activado - Herramientas de desarrollo permitidas');
    }

// Función para generar hash de contraseña (versión navegador)
function hashPassword(password) {
    const salt = 'gaby_montages_2025'; // Salt único para tu aplicación
    const encoder = new TextEncoder();
    const data = encoder.encode(password + salt);
    
    return crypto.subtle.digest('SHA-256', data).then(hashBuffer => {
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    });
}

// Función para verificar contraseña (versión navegador)
async function verifyPassword(inputPassword, hashedPassword) {
    try {
        const inputHash = await hashPassword(inputPassword);
        return inputHash === hashedPassword;
    } catch (error) {
        console.error('Error al verificar contraseña:', error);
        return false;
    }
}

})();
