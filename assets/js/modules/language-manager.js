// ===================================
// GESTOR DE IDIOMAS
// ===================================

import { AppState } from './app-state.js';
import ToastManager from './toast-manager.js';

const translations = {
  es: {
    // Navegación
    navHome: "Inicio",
    navAbout: "Acerca",
    navSkills: "Habilidades",
    navProjects: "Proyectos",
    navExperience: "Experiencia",
    navContact: "Contacto",
    navHire: "Contrátame",
    
    // Hero
    heroAvailable: "Disponible para nuevos proyectos",
    heroTitle1: "Transformando ideas en",
    heroTitle2: "experiencias digitales excepcionales",
    heroSubtitle: "Soy NovaVisionWeb, desarrollador full-stack senior con 10+ años de experiencia...",
    
    // Más traducciones...
  },
  
  en: {
    // Navigation
    navHome: "Home",
    navAbout: "About",
    navSkills: "Skills",
    navProjects: "Projects",
    navExperience: "Experience",
    navContact: "Contact",
    navHire: "Hire Me",
    
    // Hero
    heroAvailable: "Available for new projects",
    heroTitle1: "Transforming ideas into",
    heroTitle2: "exceptional digital experiences",
    heroSubtitle: "I'm NovaVisionWeb, a senior full-stack developer with 10+ years of experience...",
    
    // More translations...
  }
};

const LanguageManager = {
  init: () => {
    // Aplicar idioma guardado
    LanguageManager.applyLanguage(AppState.language);
    
    // Event listeners para botones de idioma
    const langButtons = [
      document.getElementById('langToggle'),
      document.getElementById('langToggleMobile')
    ];
    
    langButtons.forEach(button => {
      if (button) {
        button.addEventListener('click', () => LanguageManager.toggleLanguage());
      }
    });
  },
  
  applyLanguage: (language) => {
    AppState.language = language;
    localStorage.setItem('language', language);
    
    // Traducir todos los elementos con data-i18n
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
      const key = element.getAttribute('data-i18n');
      if (translations[language] && translations[language][key]) {
        const text = translations[language][key];
        
        // Manejar placeholders
        if (element.hasAttribute('data-i18n-params')) {
          const params = JSON.parse(element.getAttribute('data-i18n-params'));
          let finalText = text;
          for (const [param, value] of Object.entries(params)) {
            finalText = finalText.replace(`{${param}}`, value);
          }
          element.textContent = finalText;
        } else {
          element.textContent = text;
        }
      }
    });
    
    // Actualizar atributo lang del documento
    document.documentElement.setAttribute('lang', language);
    
    // Disparar evento personalizado
    document.dispatchEvent(new CustomEvent('languageChanged', { detail: { language } }));
  },
  
  toggleLanguage: () => {
    const newLanguage = AppState.language === 'es' ? 'en' : 'es';
    LanguageManager.applyLanguage(newLanguage);
    
    // Mostrar toast
    ToastManager.show({
      type: 'success',
      message: LanguageManager.getText('toastLanguageChanged', { language: newLanguage === 'es' ? 'Español' : 'English' }),
      duration: 3000
    });
  },
  
  getText: (key, params = {}) => {
    const translation = translations[AppState.language][key] || key;
    let text = translation;
    
    for (const [param, value] of Object.entries(params)) {
      text = text.replace(`{${param}}`, value);
    }
    
    return text;
  }
};

export default LanguageManager;