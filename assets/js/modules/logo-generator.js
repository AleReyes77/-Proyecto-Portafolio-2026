// assets/js/modules/logo-generator.js
// ==============================================
// LOGO GENERATOR - VERSIÓN ROBUSTA CON VERIFICACIONES
// ==============================================

import AppState from './app-state.js';
import { $ } from '../utils/dom-helpers.js';

// Verificación rápida de dependencias
if (!AppState) {
  console.error('[LogoGenerator] ERROR CRÍTICO: AppState no está definido. Revisa la importación.');
}
if (!AppState.floatingLogos) {
  console.error('[LogoGenerator] ERROR: AppState.floatingLogos es undefined. Inicialízalo como [].');
  // Forzar inicialización para evitar errores
  AppState.floatingLogos = [];
}

const LogoGenerator = {
  logoTypes: {
    vscode: {
      name: 'VS Code',
      color: '#0078d4',
      icon: `<svg viewBox="0 0 24 24" width="100%" height="100%">
          <path fill="currentColor" d="M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z"/>
        </svg>`
    },
    html: {
      name: 'HTML5',
      color: '#e34f26',
      icon: '<i class="fab fa-html5"></i>'
    },
    css: {
      name: 'CSS3',
      color: '#1572b6',
      icon: '<i class="fab fa-css3-alt"></i>'
    },
    js: {
      name: 'JavaScript',
      color: '#f7df1e',
      icon: '<i class="fab fa-js-square"></i>'
    }
  },

  init() {
    console.log('[LogoGenerator] Inicializando...');
    this.initCanvas();
    this.bindButtons();
    this.animate();
    this.updateLogoCount();
  },

  initCanvas() {
    this.canvas = $('#logoCanvas');
    if (!this.canvas) {
      console.error('[LogoGenerator] No se encontró el elemento #logoCanvas');
      return;
    }
    this.ctx = this.canvas.getContext('2d');
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
    console.log('[LogoGenerator] Canvas inicializado');
  },

  resizeCanvas() {
    if (!this.canvas) return;
    const container = this.canvas.parentElement;
    if (!container) return;
    const width = container.clientWidth;
    const height = container.clientHeight;
    this.canvas.width = width > 0 ? width : 1200;
    this.canvas.height = height > 0 ? height : 400;
    console.log(`[LogoGenerator] Canvas redimensionado: ${this.canvas.width}x${this.canvas.height}`);
  },

  bindButtons() {
    const actions = {
      generateVSCode: 'vscode',
      generateHTML: 'html',
      generateCSS: 'css',
      generateJS: 'js',
      generateRandom: 'random',
      clearLogos: 'clear',
      pauseLogos: 'pause',
      resumeLogos: 'resume'
    };

    for (const [buttonId, action] of Object.entries(actions)) {
      const button = $(`#${buttonId}`);
      if (button) {
        button.addEventListener('click', (e) => {
          e.preventDefault();
          this.handleAction(action);
        });
        console.log(`[LogoGenerator] Botón #${buttonId} vinculado`);
      } else {
        console.warn(`[LogoGenerator] Botón #${buttonId} no encontrado en el DOM`);
      }
    }
  },

  handleAction(action) {
    console.log(`[LogoGenerator] Acción: ${action}`);
    switch (action) {
      case 'vscode':
      case 'html':
      case 'css':
      case 'js':
        this.generateLogo(action);
        break;
      case 'random':
        const types = Object.keys(this.logoTypes);
        if (types.length === 0) {
          console.error('[LogoGenerator] No hay tipos de logos definidos');
          return;
        }
        const randomType = types[Math.floor(Math.random() * types.length)];
        this.generateLogo(randomType);
        break;
      case 'clear':
        this.clearAll();
        break;
      case 'pause':
        AppState.isLogoAnimationPaused = true;
        console.log('[LogoGenerator] Animación pausada');
        break;
      case 'resume':
        AppState.isLogoAnimationPaused = false;
        console.log('[LogoGenerator] Animación reanudada');
        break;
    }
  },

  generateLogo(type) {
    const logoType = this.logoTypes[type];
    if (!logoType) {
      console.error(`[LogoGenerator] Tipo de logo desconocido: ${type}`);
      return;
    }

    const container = $('#floatingLogos');
    if (!container) {
      console.error('[LogoGenerator] Contenedor #floatingLogos no encontrado');
      return;
    }

    const logo = document.createElement('div');
    logo.className = 'floating-logo';
    logo.innerHTML = logoType.icon;

    const size = 30 + Math.random() * 40;
    const startX = Math.random() * (window.innerWidth - size);
    const startY = window.innerHeight;

    // Estilos críticos
    logo.style.position = 'absolute';
    logo.style.width = `${size}px`;
    logo.style.height = `${size}px`;
    logo.style.color = logoType.color;
    logo.style.fontSize = `${size * 0.6}px`;
    logo.style.left = `${startX}px`;
    logo.style.top = `${startY}px`;
    logo.style.opacity = '0.9';
    logo.style.zIndex = '10001';
    logo.style.pointerEvents = 'none';
    logo.style.userSelect = 'none';
    logo.style.willChange = 'transform, left, top';

    const logoData = {
      element: logo,
      x: startX,
      y: startY,
      size: size,
      speedX: (Math.random() - 0.5) * 1.5,
      speedY: -(1.5 + Math.random() * 2),
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 1.5
    };

    container.appendChild(logo);
    
    // Verificar que AppState.floatingLogos existe
    if (!AppState.floatingLogos) {
      AppState.floatingLogos = [];
    }
    AppState.floatingLogos.push(logoData);
    
    this.updateLogoCount();
    console.log(`[LogoGenerator] Logo generado: ${logoType.name} (total: ${AppState.floatingLogos.length})`);
  },

  clearAll() {
    const container = $('#floatingLogos');
    if (container) {
      container.innerHTML = '';
    }
    if (AppState.floatingLogos) {
      AppState.floatingLogos = [];
    }
    this.updateLogoCount();
    console.log('[LogoGenerator] Todos los logos eliminados');
  },

  animate() {
    if (!AppState.isLogoAnimationPaused) {
      this.updateLogos();
    }
    requestAnimationFrame(() => this.animate());
  },

  updateLogos() {
    // Verificar que AppState.floatingLogos existe y es un array
    if (!AppState.floatingLogos || !Array.isArray(AppState.floatingLogos)) {
      // Si no es array, lo inicializamos
      console.warn('[LogoGenerator] AppState.floatingLogos no es un array, reinicializando');
      AppState.floatingLogos = [];
      return;
    }

    const canvas = this.canvas;
    const ctx = this.ctx;

    // Limpiar canvas solo si es válido
    if (canvas && ctx && canvas.width > 0 && canvas.height > 0) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // Recorrer desde el final para poder eliminar elementos sin problemas de índice
    for (let i = AppState.floatingLogos.length - 1; i >= 0; i--) {
      const logo = AppState.floatingLogos[i];
      
      // Si el logo no tiene elemento, lo eliminamos
      if (!logo || !logo.element) {
        AppState.floatingLogos.splice(i, 1);
        continue;
      }

      // Actualizar posición
      logo.x += logo.speedX || 0;
      logo.y += logo.speedY || 0;
      logo.rotation += logo.rotationSpeed || 0;

      // Aplicar transformaciones
      logo.element.style.left = `${logo.x}px`;
      logo.element.style.top = `${logo.y}px`;
      logo.element.style.transform = `rotate(${logo.rotation}deg)`;

      // Dibujar efecto de brillo en canvas
      if (canvas && ctx && canvas.width > 0 && canvas.height > 0) {
        try {
          const centerX = logo.x + logo.size / 2;
          const centerY = logo.y + logo.size / 2;
          
          // Solo dibujar si está dentro del viewport (más o menos)
          if (centerX > -100 && centerX < canvas.width + 100 && 
              centerY > -100 && centerY < canvas.height + 100) {
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate((logo.rotation * Math.PI) / 180);
            
            ctx.beginPath();
            ctx.arc(0, 0, logo.size / 2, 0, Math.PI * 2);
            const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, logo.size / 2);
            gradient.addColorStop(0, 'rgba(109, 93, 255, 0.2)');
            gradient.addColorStop(1, 'rgba(109, 93, 255, 0)');
            ctx.fillStyle = gradient;
            ctx.fill();
            
            ctx.restore();
          }
        } catch (e) {
          // Ignorar errores de dibujo
        }
      }

      // Eliminar logos que salen de la pantalla
      if (logo.y < -200 || logo.x < -200 || logo.x > window.innerWidth + 200) {
        if (logo.element.parentNode) {
          logo.element.remove();
        }
        AppState.floatingLogos.splice(i, 1);
      }
    }

    // Actualizar contador si ha cambiado
    this.updateLogoCount();
  },

  updateLogoCount() {
    const countElement = $('#logoCount');
    if (countElement) {
      const count = AppState.floatingLogos ? AppState.floatingLogos.length : 0;
      countElement.textContent = count;
    }
  }
};

export default LogoGenerator;