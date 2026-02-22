import { AppState } from './app-state.js';
import { $ } from '../utils/dom-helpers.js';

export default class ThemeManager {
  constructor() {
    this.themeToggle = $('#themeToggle');
    this.themeToggleMobile = $('#themeToggleMobile');
    this.footerThemeToggle = $('#footerThemeToggle');
    this.themeIcon = $('.theme-icon');
    this.html = document.documentElement;
  }
  
  init() {
    console.log('🎨 ThemeManager inicializando...');
    
    // Cargar tema guardado o detectar preferencia del sistema
    this.loadTheme();
    
    // Configurar event listeners
    this.bindEvents();
    
    // Configurar preferencia del sistema
    this.setupSystemPreference();
    
    console.log('✅ ThemeManager inicializado');
  }
  
  loadTheme() {
    // Verificar localStorage
    const savedTheme = localStorage.getItem('theme');
    
    // Verificar preferencia del sistema
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const systemTheme = prefersDark ? 'dark' : 'light';
    
    // Usar tema guardado, o el del sistema, o 'dark' por defecto
    const theme = savedTheme || systemTheme || 'dark';
    
    this.applyTheme(theme);
    return theme;
  }
  
  applyTheme(theme) {
    // Aplicar tema al documento
    this.html.setAttribute('data-theme', theme);
    
    // Actualizar AppState
    AppState.theme = theme;
    
    // Guardar en localStorage
    localStorage.setItem('theme', theme);
    
    // Actualizar meta theme-color
    this.updateMetaThemeColor(theme);
    
    // Actualizar íconos
    this.updateThemeIcons(theme);
    
    // Disparar evento personalizado
    document.dispatchEvent(new CustomEvent('themeChanged', { 
      detail: { theme } 
    }));
    
    console.log(`🌓 Tema aplicado: ${theme}`);
  }
  
  updateMetaThemeColor(theme) {
    const themeColor = theme === 'dark' ? '#0b0d12' : '#f8fafc';
    let metaThemeColor = $('meta[name="theme-color"]');
    
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.name = 'theme-color';
      document.head.appendChild(metaThemeColor);
    }
    
    metaThemeColor.setAttribute('content', themeColor);
  }
  
  updateThemeIcons(theme) {
    const icons = document.querySelectorAll('.theme-icon');
    
    icons.forEach(icon => {
      if (theme === 'dark') {
        icon.textContent = '☀️';
        icon.setAttribute('aria-label', 'Cambiar a tema claro');
        icon.title = 'Cambiar a tema claro';
      } else {
        icon.textContent = '🌙';
        icon.setAttribute('aria-label', 'Cambiar a tema oscuro');
        icon.title = 'Cambiar a tema oscuro';
      }
    });
  }
  
  toggleTheme() {
    const currentTheme = this.html.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    this.applyTheme(newTheme);
  }
  
  bindEvents() {
    // Botón principal
    if (this.themeToggle) {
      this.themeToggle.addEventListener('click', () => this.toggleTheme());
      console.log('✅ Botón themeToggle encontrado');
    } else {
      console.warn('⚠️ Botón themeToggle no encontrado');
    }
    
    // Botón móvil
    if (this.themeToggleMobile) {
      this.themeToggleMobile.addEventListener('click', () => this.toggleTheme());
    }
    
    // Botón footer
    if (this.footerThemeToggle) {
      this.footerThemeToggle.addEventListener('click', () => this.toggleTheme());
    }
    
    // También permitir tecla 'T' para alternar tema
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 't') {
        e.preventDefault();
        this.toggleTheme();
      }
    });
  }
  
  setupSystemPreference() {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    mediaQuery.addEventListener('change', (e) => {
      // Solo cambiar si no hay tema guardado
      if (!localStorage.getItem('theme')) {
        const newTheme = e.matches ? 'dark' : 'light';
        this.applyTheme(newTheme);
        console.log(`🔄 Tema cambiado por preferencia del sistema: ${newTheme}`);
      }
    });
  }
  
  // Método para obtener tema actual
  getCurrentTheme() {
    return this.html.getAttribute('data-theme') || 'dark';
  }
  
  // Método para forzar tema específico
  setTheme(theme) {
    if (theme === 'dark' || theme === 'light') {
      this.applyTheme(theme);
    } else {
      console.warn('⚠️ Tema no válido. Usando "dark" por defecto');
      this.applyTheme('dark');
    }
  }
}