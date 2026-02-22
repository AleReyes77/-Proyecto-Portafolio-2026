// ===================================
// FUNCIONES DE AYUDA GENERALES
// ===================================

/**
 * Generar ID único
 */
export const generateId = () => `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

/**
 * Formatear fecha
 */
export const formatDate = (date, locale = 'es-ES') => {
  const d = new Date(date);
  return d.toLocaleDateString(locale, { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

/**
 * Formatear número
 */
export const formatNumber = (num, locale = 'es-ES') => {
  return num.toLocaleString(locale);
};

/**
 * Debounce para eventos
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle para eventos
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Detectar dispositivo
 */
export const isMobile = () => window.innerWidth <= 991;
export const isTablet = () => window.innerWidth > 767 && window.innerWidth <= 991;
export const isDesktop = () => window.innerWidth > 991;

/**
 * Detectar preferencia de movimiento reducido
 */
export const prefersReducedMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Esperar un tiempo
 */
export const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export default {
  generateId,
  formatDate,
  formatNumber,
  debounce,
  throttle,
  isMobile,
  isTablet,
  isDesktop,
  prefersReducedMotion,
  wait
};