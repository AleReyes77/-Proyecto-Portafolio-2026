// ===================================
// GESTOR DE ANIMACIONES
// ===================================

import { $, $$ } from '../utils/dom-helpers.js';

const AnimationManager = {
  init: () => {
    // Inicializar animaciones de revelado al hacer scroll
    AnimationManager.initRevealAnimations();
    
    // Inicializar partículas del hero
    AnimationManager.initHeroParticles();
    
    // Inicializar animaciones de hover
    AnimationManager.initHoverAnimations();
    
    // Inicializar animaciones de entrada
    AnimationManager.initEntranceAnimations();
  },
  
  initRevealAnimations: () => {
    const revealElements = $$('.reveal');
    
    if (revealElements.length === 0) return;
    
    const observerOptions = {
      root: null,
      rootMargin: '-10% 0px -10% 0px',
      threshold: 0
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    revealElements.forEach(element => observer.observe(element));
  },
  
  initHeroParticles: () => {
    const container = $('#heroParticles');
    if (!container) return;
    
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      // Tamaño aleatorio
      const size = 1 + Math.random() * 3;
      
      // Posición aleatoria
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      
      // Duración de animación aleatoria
      const duration = 10 + Math.random() * 20;
      const delay = Math.random() * 5;
      
      // Aplicar estilos
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${x}%`;
      particle.style.top = `${y}%`;
      particle.style.animationDuration = `${duration}s`;
      particle.style.animationDelay = `${delay}s`;
      
      // Color aleatorio
      const colors = [
        'rgba(109, 93, 255, 0.6)',
        'rgba(0, 212, 255, 0.6)',
        'rgba(255, 122, 217, 0.6)'
      ];
      const color = colors[Math.floor(Math.random() * colors.length)];
      particle.style.background = color;
      
      container.appendChild(particle);
    }
  },
  
  initHoverAnimations: () => {
    // Efecto de hover para tarjetas
    const cards = $$('.card');
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-8px) scale(1.02)';
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
      });
    });
    
    // Efecto de hover para botones
    const buttons = $$('.btn');
    buttons.forEach(button => {
      button.addEventListener('mouseenter', () => {
        button.style.transform = 'translateY(-3px)';
      });
      
      button.addEventListener('mouseleave', () => {
        button.style.transform = 'translateY(0)';
      });
    });
  },
  
  initEntranceAnimations: () => {
    // Animación de entrada para elementos específicos
    const heroTitle = $('.hero-title');
    if (heroTitle) {
      heroTitle.style.animation = 'slideInUp 1s ease-out forwards';
    }
    
    const heroSubtitle = $('.hero-subtitle');
    if (heroSubtitle) {
      heroSubtitle.style.animation = 'slideInUp 1s ease-out 0.3s forwards';
      heroSubtitle.style.opacity = '0';
    }
    
    const heroActions = $('.hero-actions');
    if (heroActions) {
      heroActions.style.animation = 'slideInUp 1s ease-out 0.6s forwards';
      heroActions.style.opacity = '0';
    }
  }
};

export default AnimationManager;