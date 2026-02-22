// ===================================
// GESTOR DE PROYECTOS
// ===================================

import { $, $$ } from '../utils/dom-helpers.js';
import { AppState } from './app-state.js';
import LanguageManager from './language-manager.js';

const ProjectManager = {
  init: () => {
    // Inicializar filtros de proyectos
    ProjectManager.initProjectFilters();
    
    // Inicializar modales de proyectos
    ProjectManager.initProjectModals();
    
    // Inicializar navegación entre proyectos en el modal
    ProjectManager.initModalNavigation();
  },
  
  initProjectFilters: () => {
    const filterButtons = $$('.projects-filter .btn');
    const projectCards = $$('.project-card');
    
    if (filterButtons.length === 0 || projectCards.length === 0) return;
    
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Remover clase active de todos los botones
        filterButtons.forEach(btn => btn.classList.remove('active'));
        
        // Agregar clase active al botón clickeado
        button.classList.add('active');
        
        // Obtener filtro
        const filter = button.getAttribute('data-filter');
        
        // Filtrar proyectos
        projectCards.forEach(card => {
          const categories = card.getAttribute('data-category').split(',');
          
          if (filter === 'all' || categories.includes(filter)) {
            card.style.display = 'block';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 10);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 300);
          }
        });
      });
    });
  },
  
  initProjectModals: () => {
    const viewButtons = $$('.project-view');
    const modal = $('#projectModal');
    const modalOverlay = $('#modalOverlay');
    const modalClose = $('#modalClose');
    
    if (!modal || !modalOverlay || !modalClose) return;
    
    viewButtons.forEach(button => {
      button.addEventListener('click', () => {
        const projectId = parseInt(button.getAttribute('data-project'));
        ProjectManager.openProjectModal(projectId);
      });
    });
    
    // Cerrar modal al hacer clic en el overlay
    modalOverlay.addEventListener('click', () => {
      ProjectManager.closeProjectModal();
    });
    
    // Cerrar modal al presionar Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        ProjectManager.closeProjectModal();
      }
    });
    
    // Cerrar modal con botón
    modalClose.addEventListener('click', () => {
      ProjectManager.closeProjectModal();
    });
  },
  
  initModalNavigation: () => {
    const modalPrev = $('#modalPrev');
    const modalNext = $('#modalNext');
    const modalVisit = $('#modalVisit');
    
    if (modalPrev) {
      modalPrev.addEventListener('click', () => {
        ProjectManager.navigateProject('prev');
      });
    }
    
    if (modalNext) {
      modalNext.addEventListener('click', () => {
        ProjectManager.navigateProject('next');
      });
    }
    
    if (modalVisit) {
      modalVisit.addEventListener('click', () => {
        const currentProject = AppState.projects[AppState.currentProjectIndex];
        if (currentProject && currentProject.link) {
          window.open(currentProject.link, '_blank', 'noopener,noreferrer');
        }
      });
    }
  },
  
  openProjectModal: (projectId) => {
    const modal = $('#projectModal');
    const modalTitle = $('#modalTitle');
    const modalContent = $('#modalContent');
    
    if (!modal || !modalTitle || !modalContent) return;
    
    // Encontrar el proyecto
    const projectIndex = AppState.projects.findIndex(p => p.id === projectId);
    if (projectIndex === -1) return;
    
    AppState.currentProjectIndex = projectIndex;
    const project = AppState.projects[projectIndex];
    
    // Actualizar contenido del modal
    modalTitle.textContent = project.title;
    modalContent.innerHTML = project.longDescription;
    
    // Abrir modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Actualizar navegación
    ProjectManager.updateModalNavigation();
  },
  
  closeProjectModal: () => {
    const modal = $('#projectModal');
    if (!modal) return;
    
    modal.classList.remove('active');
    document.body.style.overflow = '';
  },
  
  navigateProject: (direction) => {
    let newIndex;
    
    if (direction === 'prev') {
      newIndex = AppState.currentProjectIndex - 1;
      if (newIndex < 0) newIndex = AppState.projects.length - 1;
    } else if (direction === 'next') {
      newIndex = AppState.currentProjectIndex + 1;
      if (newIndex >= AppState.projects.length) newIndex = 0;
    }
    
    AppState.currentProjectIndex = newIndex;
    const project = AppState.projects[newIndex];
    
    // Actualizar contenido del modal
    const modalTitle = $('#modalTitle');
    const modalContent = $('#modalContent');
    
    if (modalTitle && modalContent) {
      modalTitle.textContent = project.title;
      modalContent.innerHTML = project.longDescription;
      
      // Scroll al principio del contenido
      modalContent.scrollTop = 0;
    }
    
    // Actualizar navegación
    ProjectManager.updateModalNavigation();
  },
  
  updateModalNavigation: () => {
    const modalPrev = $('#modalPrev');
    const modalNext = $('#modalNext');
    const modalVisit = $('#modalVisit');
    
    if (!modalPrev || !modalNext || !modalVisit) return;
    
    const project = AppState.projects[AppState.currentProjectIndex];
    
    // Actualizar estado de botones
    modalPrev.disabled = AppState.projects.length <= 1;
    modalNext.disabled = AppState.projects.length <= 1;
    modalVisit.disabled = !project.link;
    
    // Actualizar texto del botón de visita
    const visitText = LanguageManager.getText('modalVisit');
    modalVisit.innerHTML = `<i class="fas fa-external-link-alt"></i><span>${visitText}</span>`;
  }
};

export default ProjectManager;