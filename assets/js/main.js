// js/main.js
import AppState from './modules/app-state.js';
import * as Utils from './utils/helpers.js';
import * as Dom from './utils/dom-helpers.js';
import * as Validators from './utils/validators.js';

// Importar módulos principales (solo los que tienes)
import ThemeManager from './modules/theme-manager.js';
import LanguageManager from './modules/language-manager.js';
import NavigationManager from './modules/navigation-manager.js';
import LogoGenerator from './modules/logo-generator.js';
import ProjectManager from './modules/project-manager.js';
import FormManager from './modules/form-manager.js';
import ToastManager from './modules/toast-manager.js';
import AnimationManager from './modules/animation-manager.js';
import AccessibilityManager from './modules/accessibility-manager.js';

// Combinar utilidades
const UtilsCombined = { ...Utils, ...Dom, ...Validators };

// Inicialización de la aplicación
const App = {
  init: () => {
    console.log('[App] Inicializando aplicación...');

    try {
      // 1. TEMA (Primero porque afecta CSS)
      const themeManager = new ThemeManager();
      themeManager.init();
      console.log('✅ ThemeManager inicializado');

      // 2. IDIOMAS
      LanguageManager.init();
      console.log('✅ LanguageManager inicializado');

      // 3. NAVEGACIÓN
      NavigationManager.init();
      console.log('✅ NavigationManager inicializado');

      // 4. LOGO GENERATOR (¡CRÍTICO!)
      LogoGenerator.init();
      console.log('✅ LogoGenerator inicializado');

      // 5. PROYECTOS
      ProjectManager.init();
      console.log('✅ ProjectManager inicializado');

      // 6. FORMULARIOS
      FormManager.init();
      console.log('✅ FormManager inicializado');

      // 7. TOASTS
      ToastManager.init();
      console.log('✅ ToastManager inicializado');

      // 8. ANIMACIONES
      AnimationManager.init();
      console.log('✅ AnimationManager inicializado');

      // 9. ACCESIBILIDAD
      AccessibilityManager.init();
      console.log('✅ AccessibilityManager inicializado');

      // Configurar utilidades
      if (UtilsCombined.lazyLoadImages) UtilsCombined.lazyLoadImages();
      if (UtilsCombined.prefetchResources) UtilsCombined.prefetchResources();

      console.log('🎉 Todos los módulos inicializados correctamente');

      // Evento de carga completa
      window.addEventListener('load', () => {
        console.log('[App] Aplicación cargada y lista');
        const loadTime = performance.now();
        console.log(`[App] Tiempo de carga: ${Math.round(loadTime)}ms`);
        
        // Mostrar estado actual
        console.log(`
        ============================
        App State:
        - Tema: ${AppState.theme}
        - Idioma: ${AppState.language}
        - Logos activos: ${AppState.floatingLogos ? AppState.floatingLogos.length : 0}
        ============================
        `);
      });

    } catch (error) {
      console.error('[App] Error al inicializar módulos:', error);
      
      // Mostrar toast de error
      ToastManager.show({
        type: 'error',
        message: 'Error al cargar algunas funciones. Por favor, recarga la página.',
        duration: 5000
      });
    }
  }
};

// Punto de entrada
document.addEventListener('DOMContentLoaded', () => {
  console.log('[App] DOM cargado, verificando elementos...');

  // Verificar elementos CRÍTICOS
  const criticalElements = [
    { id: '#themeToggle', name: 'Botón de tema' },
    { id: '#logoCanvas', name: 'Canvas de logos' },
    { id: '#floatingLogos', name: 'Contenedor de logos flotantes' },
    { id: '#generateVSCode', name: 'Botón generar VS Code' }
  ];

  let missingElements = [];
  
  criticalElements.forEach(element => {
    if (!Dom.$(element.id)) {
      console.error(`❌ ${element.name} no encontrado: ${element.id}`);
      missingElements.push(element.name);
    }
  });

  if (missingElements.length === 0) {
    console.log('✅ Todos los elementos críticos encontrados');
    App.init();
  } else {
    console.error(`❌ Faltan ${missingElements.length} elementos críticos:`, missingElements);
    
    // Mostrar alerta en la página
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: #ef4444;
      color: white;
      padding: 15px;
      border-radius: 8px;
      z-index: 99999;
      text-align: center;
      max-width: 500px;
    `;
    errorDiv.innerHTML = `
      <strong>Error de carga</strong><br>
      Faltan elementos: ${missingElements.join(', ')}<br>
      Verifica la consola (F12) para más detalles.
    `;
    document.body.appendChild(errorDiv);
    
    // Intentar inicializar de todos modos
    setTimeout(() => {
      console.log('[App] Intentando inicialización de todos modos...');
      App.init();
    }, 1000);
  }
});

// Polyfills para navegadores antiguos
if (!Element.prototype.closest) {
  Element.prototype.closest = function(s) {
    let el = this;
    do {
      if (el.matches(s)) return el;
      el = el.parentElement || el.parentNode;
    } while (el !== null && el.nodeType === 1);
    return null;
  };
}

if (!Element.prototype.matches) {
  Element.prototype.matches = 
    Element.prototype.matchesSelector || 
    Element.prototype.mozMatchesSelector ||
    Element.prototype.msMatchesSelector || 
    Element.prototype.oMatchesSelector || 
    Element.prototype.webkitMatchesSelector ||
    function(s) {
      const matches = (this.document || this.ownerDocument).querySelectorAll(s);
      let i = matches.length;
      while (--i >= 0 && matches.item(i) !== this) {}
      return i > -1;
    };
}

// Exportar para depuración
window.AppDebug = {
  state: AppState,
  utils: UtilsCombined,
  modules: {
    ThemeManager,
    LanguageManager,
    NavigationManager,
    LogoGenerator,
    ProjectManager,
    FormManager,
    ToastManager,
    AnimationManager,
    AccessibilityManager
  }
};

console.log('[App] Script cargado. Esperando DOM...');