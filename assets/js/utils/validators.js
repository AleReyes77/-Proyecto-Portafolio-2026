// ===================================
// VALIDACIONES
// ===================================

/**
 * Validar email
 */
export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

/**
 * Validar URL
 */
export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validar teléfono
 */
export const isValidPhone = (phone) => {
  const re = /^[\+]?[0-9\s\-\(\)]+$/;
  return re.test(phone);
};

/**
 * Validar que no esté vacío
 */
export const isNotEmpty = (value) => {
  return value !== null && value !== undefined && value.toString().trim() !== '';
};

/**
 * Validar longitud mínima
 */
export const hasMinLength = (value, min) => {
  return value.toString().length >= min;
};

/**
 * Validar longitud máxima
 */
export const hasMaxLength = (value, max) => {
  return value.toString().length <= max;
};

export default {
  isValidEmail,
  isValidUrl,
  isValidPhone,
  isNotEmpty,
  hasMinLength,
  hasMaxLength
};