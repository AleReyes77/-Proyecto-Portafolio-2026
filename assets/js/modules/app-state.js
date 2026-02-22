export class AppState {
  constructor() {
    this._theme = localStorage.getItem('theme') || 
                  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    this._language = localStorage.getItem('language') || 'es';
    this._user = null;
    this._notifications = [];
    this._settings = {};
  }
  
  // Getters y setters para theme
  get theme() {
    return this._theme;
  }
  
  set theme(value) {
    if (value === 'dark' || value === 'light') {
      this._theme = value;
      localStorage.setItem('theme', value);
    } else {
      console.warn(`Intento de establecer tema inválido: ${value}`);
    }
  }
  
  // Getters y setters para language
  get language() {
    return this._language;
  }
  
  set language(value) {
    this._language = value;
    localStorage.setItem('language', value);
  }
  
  // Getters y setters para user
  get user() {
    return this._user;
  }
  
  set user(value) {
    this._user = value;
  }
  
  // Métodos para notifications
  addNotification(notification) {
    this._notifications.push(notification);
  }
  
  clearNotifications() {
    this._notifications = [];
  }
  
  // Métodos para settings
  updateSettings(newSettings) {
    this._settings = { ...this._settings, ...newSettings };
  }
  
  // Método para reset
  reset() {
    this._theme = 'dark';
    this._language = 'es';
    this._user = null;
    this._notifications = [];
    this._settings = {};
    
    localStorage.removeItem('theme');
    localStorage.removeItem('language');
    
    console.log('🔄 AppState reiniciado');
  }
}

// Exportar instancia única (singleton)
export const appState = new AppState();
export default appState;