// ===================================
// GESTOR DE FORMULARIOS
// ===================================

import { $, $$ } from '../utils/dom-helpers.js';
import { isValidEmail } from '../utils/validators.js';
import ToastManager from './toast-manager.js';
import LanguageManager from './language-manager.js';

const FormManager = {
  init: () => {
    // Inicializar formulario de contacto
    FormManager.initContactForm();
  },
  
  initContactForm: () => {
    const form = $('#contactForm');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      FormManager.handleContactFormSubmit(form);
    });
    
    // Validación en tiempo real
    const inputs = $$('#contactForm input, #contactForm textarea, #contactForm select');
    inputs.forEach(input => {
      input.addEventListener('blur', () => {
        FormManager.validateField(input);
      });
      
      input.addEventListener('input', () => {
        FormManager.clearFieldError(input);
      });
    });
  },
  
  validateField: (field) => {
    const value = field.value.trim();
    const fieldName = field.id || field.name;
    
    // Limpiar error previo
    FormManager.clearFieldError(field);
    
    // Validar según el tipo de campo
    let isValid = true;
    let errorMessage = '';
    
    if (field.required && !value) {
      isValid = false;
      errorMessage = LanguageManager.getText('formRequired');
    } else if (field.type === 'email' && value) {
      if (!isValidEmail(value)) {
        isValid = false;
        errorMessage = LanguageManager.getText('formInvalidEmail');
      }
    }
    
    if (!isValid) {
      FormManager.showFieldError(field, errorMessage);
    }
    
    return isValid;
  },
  
  showFieldError: (field, message) => {
    // Crear elemento de error
    const errorElement = document.createElement('div');
    errorElement.className = 'form-error';
    errorElement.textContent = message;
    errorElement.style.color = 'var(--brand-error)';
    errorElement.style.fontSize = 'var(--font-sm)';
    errorElement.style.marginTop = 'var(--spacing-xs)';
    
    // Insertar después del campo
    field.parentNode.appendChild(errorElement);
    
    // Marcar campo como inválido
    field.classList.add('is-invalid');
  },
  
  clearFieldError: (field) => {
    // Remover clase de error
    field.classList.remove('is-invalid');
    
    // Remover mensaje de error
    const errorElement = field.parentNode.querySelector('.form-error');
    if (errorElement) {
      errorElement.remove();
    }
  },
  
  handleContactFormSubmit: async (form) => {
    // Validar todos los campos
    const fields = $$('#contactForm input, #contactForm textarea, #contactForm select');
    let isValid = true;
    
    fields.forEach(field => {
      if (!FormManager.validateField(field)) {
        isValid = false;
      }
    });
    
    if (!isValid) {
      ToastManager.show({
        type: 'error',
        message: LanguageManager.getText('formError'),
        duration: 5000
      });
      return;
    }
    
    // Obtener datos del formulario
    const formData = new FormData(form);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      subject: formData.get('subject'),
      message: formData.get('message'),
      date: new Date().toISOString()
    };
    
    // Simular envío
    ToastManager.show({
      type: 'success',
      message: LanguageManager.getText('formSuccess'),
      duration: 5000
    });
    
    // Resetear formulario
    form.reset();
    
    // Actualizar mensaje del formulario
    const formMessage = $('#formMessage');
    if (formMessage) {
      formMessage.textContent = LanguageManager.getText('formSuccess');
      formMessage.style.color = 'var(--brand-success)';
      
      setTimeout(() => {
        formMessage.textContent = '';
      }, 5000);
    }
    
    // Aquí normalmente se enviarían los datos a un servidor
    console.log('Form data:', data);
  }
};

export default FormManager;