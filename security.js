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

        // Detectar cuando se abren las herramientas de desarrollo
        let devtools = {
            open: false
        };

        setInterval(function() {
            const threshold = 160;
            const widthThreshold = window.outerWidth - window.innerWidth > threshold;
            const heightThreshold = window.outerHeight - window.innerHeight > threshold;
            
            if (widthThreshold || heightThreshold) {
                if (!devtools.open) {
                    devtools.open = true;
                    window.location.href = 'about:blank';
                }
            } else {
                devtools.open = false;
            }
        }, 500);

        // Deshabilitar consola
        console.log = function() {};
        console.info = function() {};
        console.warn = function() {};
        console.error = function() {};
        console.debug = function() {};
        
    } else {
        // Si estamos en localhost, permitir consola para debugging
        console.log('🔧 Modo desarrollo activado - Herramientas de desarrollo permitidas');
    }

})();
