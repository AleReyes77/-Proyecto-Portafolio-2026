// ===================================
// GESTOR DE NAVEGACIÓN
// ===================================

import { debounce, throttle } from '../utils/helpers.js';
import { $, $$, smoothScroll } from '../utils/dom-helpers.js';

const NavigationManager = {
  init: () => {
    // Inicializar menú hamburguesa
    NavigationManager.initMobileMenu();
    
    // Inicializar scroll spy
    NavigationManager.initScrollSpy();
    
    // Inicializar scroll suave para enlaces internos
    NavigationManager.initSmoothScroll();
    
    // Cambiar estilo del header al hacer scroll
    NavigationManager.initHeaderScroll();
  },
  
  initMobileMenu: () => {
    const menuToggle = $('#menuToggle');
    const menuClose = $('#menuClose');
    const navOverlay = $('#navOverlay');
    const navMobile = $('#navMobile');
    
    if (menuToggle) {
      menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navOverlay.classList.toggle('active');
        navMobile.classList.toggle('active');
        document.body.style.overflow = 'hidden';
        menuToggle.setAttribute('aria-expanded', 'true');
      });
    }
    
    if (menuClose) {
      menuClose.addEventListener('click', () => {
        NavigationManager.closeMobileMenu();
      });
    }
    
    if (navOverlay) {
      navOverlay.addEventListener('click', () => {
        NavigationManager.closeMobileMenu();
      });
    }
    
    // Cerrar menú al hacer clic en un enlace
    const mobileLinks = $$('.nav-mobile-link');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        NavigationManager.closeMobileMenu();
      });
    });
    
    // Cerrar menú al presionar Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMobile.classList.contains('active')) {
        NavigationManager.closeMobileMenu();
      }
    });
  },
  
  closeMobileMenu: () => {
    const menuToggle = $('#menuToggle');
    const menuClose = $('#menuClose');
    const navOverlay = $('#navOverlay');
    const navMobile = $('#navMobile');
    
    if (menuToggle) menuToggle.classList.remove('active');
    if (menuClose) menuClose.classList.remove('active');
    if (navOverlay) navOverlay.classList.remove('active');
    if (navMobile) navMobile.classList.remove('active');
    document.body.style.overflow = '';
    if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
  },
  
  initScrollSpy: () => {
    const sections = $$('section[id]');
    const navLinks = $$('.nav-link, .nav-mobile-link');
    
    if (sections.length === 0 || navLinks.length === 0) return;
    
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          
          // Actualizar enlaces activos
          navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${id}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, observerOptions);
    
    sections.forEach(section => observer.observe(section));
  },
  
  initSmoothScroll: () => {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
      
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = $(targetId);
      if (!targetElement) return;
      
      e.preventDefault();
      smoothScroll(targetElement);
      
      // Cerrar menú móvil si está abierto
      if ($('#navMobile').classList.contains('active')) {
        NavigationManager.closeMobileMenu();
      }
    });
  },
  
  initHeaderScroll: () => {
    const header = $('#header');
    if (!header) return;
    
    window.addEventListener('scroll', throttle(() => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      if (scrollTop > 100) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, 100));
  }
};

export default NavigationManager;