// ===================================
// GESTOR DE NOTIFICACIONES TOAST
// ===================================

import { $, $$ } from '../utils/dom-helpers.js';
import { AppState } from './app-state.js';

const ToastManager = {
  init: () => {
    // No hay inicialización necesaria
  },
  
  show: (options) => {
    const {
      type = 'info',
      message = '',
      duration = 3000
    } = options;
    
    // Crear elemento toast
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    // Icono según tipo
    let icon = 'info-circle';
    switch (type) {
      case 'success':
        icon = 'check-circle';
        break;
      case 'error':
        icon = 'exclamation-circle';
        break;
      case 'warning':
        icon = 'exclamation-triangle';
        break;
      case 'info':
      default:
        icon = 'info-circle';
        break;
    }
    
    toast.innerHTML = `
      <div class="toast-icon">
        <i class="fas fa-${icon}"></i>
      </div>
      <div class="toast-message">${message}</div>
      <button class="toast-close" aria-label="Cerrar notificación">
        <i class="fas fa-times"></i>
      </button>
    `;
    
    // Agregar al contenedor
    const container = $('#toastContainer');
    if (!container) return;
    
    container.appendChild(toast);
    
    // Animar entrada
    setTimeout(() => {
      toast.classList.add('show');
    }, 10);
    
    // Configurar cierre automático
    const timeout = setTimeout(() => {
      ToastManager.hide(toast);
    }, duration);
    
    // Configurar cierre manual
    const closeButton = toast.querySelector('.toast-close');
    if (closeButton) {
      closeButton.addEventListener('click', () => {
        clearTimeout(timeout);
        ToastManager.hide(toast);
      });
    }
    
    // Agregar al estado
    AppState.toastQueue.push({
      element: toast,
      timeout: timeout
    });
  },
  
  hide: (toast) => {
    toast.classList.remove('show');
    
    // Remover después de la animación
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
      
      // Remover del estado
      const index = AppState.toastQueue.findIndex(t => t.element === toast);
      if (index !== -1) {
        AppState.toastQueue.splice(index, 1);
      }
    }, 300);
  },
  
  clearAll: () => {
    AppState.toastQueue.forEach(toast => {
      clearTimeout(toast.timeout);
      ToastManager.hide(toast.element);
    });
    
    AppState.toastQueue = [];
  }
};

export default ToastManager;