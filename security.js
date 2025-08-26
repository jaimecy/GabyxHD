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

        // Detectar cuando se abren las herramientas de desarrollo (versión suavizada)
        let devtools = {
            open: false,
            warningShown: false
        };

        setInterval(function() {
            const threshold = 160;
            const widthThreshold = window.outerWidth - window.innerWidth > threshold;
            const heightThreshold = window.outerHeight - window.innerHeight > threshold;
            
            if (widthThreshold || heightThreshold) {
                if (!devtools.open) {
                    devtools.open = true;
                    // En lugar de redirigir, mostrar una advertencia sutil
                    if (!devtools.warningShown) {
                        devtools.warningShown = true;
                        // Crear una notificación sutil
                        const warning = document.createElement('div');
                        warning.style.cssText = `
                            position: fixed;
                            top: 10px;
                            right: 10px;
                            background: rgba(255, 0, 0, 0.8);
                            color: white;
                            padding: 10px;
                            border-radius: 5px;
                            z-index: 9999;
                            font-size: 12px;
                            max-width: 200px;
                        `;
                        warning.textContent = '⚠️ Herramientas de desarrollo detectadas';
                        document.body.appendChild(warning);
                        
                        // Remover la advertencia después de 3 segundos
                        setTimeout(() => {
                            if (warning.parentNode) {
                                warning.parentNode.removeChild(warning);
                            }
                        }, 3000);
                    }
                }
            } else {
                devtools.open = false;
                devtools.warningShown = false;
            }
        }, 1000); // Aumentar el intervalo para reducir falsos positivos

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

})();
