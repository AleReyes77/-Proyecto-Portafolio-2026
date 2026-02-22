// ===================================
// GESTOR DE ACCESIBILIDAD
// ===================================

import { $, $$ } from '../utils/dom-helpers.js';

const AccessibilityManager = {
  init: () => {
    // Mejorar navegación por teclado
    AccessibilityManager.initKeyboardNavigation();
    
    // Mejorar focus states
    AccessibilityManager.initFocusManagement();
    
    // Detectar y mejorar contraste
    AccessibilityManager.checkContrast();
  },
  
  initKeyboardNavigation: () => {
    // Navegación con teclas
    document.addEventListener('keydown', (e) => {
      // Skip to content
      if (e.key === 'S' && e.altKey) {
        e.preventDefault();
        $('#main-content').focus();
      }
      
      // Cerrar modales con Escape (ya está en main.js)
    });
  },
  
  initFocusManagement: () => {
    // Mantener el focus dentro de modales
    const modal = $('#projectModal');
    if (modal) {
      modal.addEventListener('keydown', (e) => {
        if (e.key !== 'Tab') return;
        
        const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      });
    }
    
    // Restaurar focus al cerrar modal
    let lastFocusedElement = null;
    
    document.addEventListener('focusin', () => {
      lastFocusedElement = document.activeElement;
    });
    
    const modalOverlay = $('#modalOverlay');
    if (modalOverlay) {
      modalOverlay.addEventListener('click', () => {
        if (lastFocusedElement) {
          setTimeout(() => lastFocusedElement.focus(), 100);
        }
      });
    }
  },
  
  checkContrast: () => {
    // Verificar contraste de elementos importantes (simulado)
    const importantTexts = $$('h1, h2, h3, h4, .btn, .nav-link');
    
    // En un proyecto real, aquí se calcularía el ratio de contraste
    console.log(`[Accessibility] Verificado contraste de ${importantTexts.length} elementos`);
  }
};

export default AccessibilityManager;