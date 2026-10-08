/**
 * SERINELEC — Interacciones y Componentes UI
 * - Hero Carousel (accesible, pausado en hover/foco, teclado, touch swipe)
 * - Menú Mobile Drawer
 * - Selector de Idiomas con aviso de 'Próximamente'
 * - Formulario de Contacto estático con validación y estado honesto
 * - Año dinámico de copyright
 */

document.addEventListener('DOMContentLoaded', () => {
  initCopyrightYear();
  initMobileDrawer();
  initLanguageSelector();
  initHeroCarousel();
  initContactForm();
});

/* ==========================================================================
   1. Año Dinámico
   ========================================================================== */
function initCopyrightYear() {
  const yearEls = document.querySelectorAll('.js-current-year');
  const currentYear = new Date().getFullYear();
  yearEls.forEach((el) => {
    el.textContent = currentYear;
  });
}

/* ==========================================================================
   2. Menú Mobile Drawer
   ========================================================================== */
function initMobileDrawer() {
  const toggleBtn = document.querySelector('.js-mobile-toggle');
  const drawer = document.querySelector('.js-mobile-drawer');
  const backdrop = document.querySelector('.js-mobile-backdrop');
  const closeBtn = document.querySelector('.js-drawer-close');

  if (!toggleBtn || !drawer || !backdrop) return;

  function openDrawer() {
    drawer.classList.add('is-open');
    backdrop.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    toggleBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    // Mover foco al primer enlace
    const firstFocusable = drawer.querySelector('button, a');
    if (firstFocusable) firstFocusable.focus();
  }

  function closeDrawer() {
    drawer.classList.remove('is-open');
    backdrop.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    toggleBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    toggleBtn.focus();
  }

  toggleBtn.addEventListener('click', () => {
    const isOpen = drawer.classList.contains('is-open');
    if (isOpen) closeDrawer();
    else openDrawer();
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeDrawer);
  }

  backdrop.addEventListener('click', closeDrawer);

  // Cerrar al presionar Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
      closeDrawer();
    }
  });
}

/* ==========================================================================
   3. Selector de Idiomas
   ========================================================================== */
function initLanguageSelector() {
  const langSelectors = document.querySelectorAll('.js-lang-selector');

  langSelectors.forEach((selector) => {
    const btn = selector.querySelector('.js-lang-btn');
    const dropdown = selector.querySelector('.js-lang-dropdown');
    if (!btn || !dropdown) return;

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = dropdown.classList.contains('is-open');
      dropdown.classList.toggle('is-open', !isOpen);
      btn.setAttribute('aria-expanded', String(!isOpen));
    });

    // Cerrar al hacer click fuera
    document.addEventListener('click', (e) => {
      if (!selector.contains(e.target)) {
        dropdown.classList.remove('is-open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });

    // Manejo de opciones deshabilitadas con mensaje accesible
    const disabledOptions = dropdown.querySelectorAll('.js-lang-option-disabled');
    disabledOptions.forEach((opt) => {
      opt.addEventListener('click', (e) => {
        e.preventDefault();
        alert('Este idioma estará disponible próximamente en futuras actualizaciones.');
      });
    });
  });
}

/* ==========================================================================
   4. Hero Carousel
   ========================================================================== */
function initHeroCarousel() {
  const carousel = document.querySelector('.js-hero-carousel');
  if (!carousel) return;

  const slides = carousel.querySelectorAll('.js-carousel-slide');
  const indicators = carousel.querySelectorAll('.js-carousel-indicator');
  const prevBtn = carousel.querySelector('.js-carousel-prev');
  const nextBtn = carousel.querySelector('.js-carousel-next');

  if (slides.length <= 1) return;

  let currentIndex = 0;
  let autoplayTimer = null;
  const AUTOPLAY_INTERVAL = 6000;
  let isPaused = false;

  function goToSlide(index) {
    slides[currentIndex].classList.remove('is-active');
    slides[currentIndex].setAttribute('aria-hidden', 'true');
    if (indicators[currentIndex]) {
      indicators[currentIndex].classList.remove('is-active');
      indicators[currentIndex].setAttribute('aria-current', 'false');
    }

    currentIndex = (index + slides.length) % slides.length;

    slides[currentIndex].classList.add('is-active');
    slides[currentIndex].setAttribute('aria-hidden', 'false');
    if (indicators[currentIndex]) {
      indicators[currentIndex].classList.add('is-active');
      indicators[currentIndex].setAttribute('aria-current', 'true');
    }
  }

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  function prevSlide() {
    goToSlide(currentIndex - 1);
  }

  function startAutoplay() {
    // Respetar preferencia prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    stopAutoplay();
    autoplayTimer = setInterval(() => {
      if (!isPaused) {
        nextSlide();
      }
    }, AUTOPLAY_INTERVAL);
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  // Controles Botones
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      startAutoplay();
    });
  }
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      startAutoplay();
    });
  }

  // Indicadores
  indicators.forEach((indicator, idx) => {
    indicator.addEventListener('click', () => {
      goToSlide(idx);
      startAutoplay();
    });
  });

  // Pausa en hover y foco para accesibilidad
  carousel.addEventListener('mouseenter', () => { isPaused = true; });
  carousel.addEventListener('mouseleave', () => { isPaused = false; });
  carousel.addEventListener('focusin', () => { isPaused = true; });
  carousel.addEventListener('focusout', () => { isPaused = false; });

  // Navegación por teclado (Flechas izquierda y derecha)
  carousel.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      prevSlide();
      startAutoplay();
    } else if (e.key === 'ArrowRight') {
      nextSlide();
      startAutoplay();
    }
  });

  // Soporte Touch Swipe para móviles
  let touchStartX = 0;
  let touchEndX = 0;

  carousel.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  carousel.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 40) {
      if (diff < 0) {
        nextSlide(); // Deslizar hacia la izquierda
      } else {
        prevSlide(); // Deslizar hacia la derecha
      }
      startAutoplay();
    }
  }

  // Iniciar
  startAutoplay();
}

/* ==========================================================================
   5. Formulario de Contacto
   ========================================================================== */
function initContactForm() {
  const form = document.querySelector('.js-contact-form');
  if (!form) return;

  const statusNotice = document.querySelector('.js-form-feedback');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;
    const nameInput = form.querySelector('#nombre');
    const emailInput = form.querySelector('#correo');
    const asuntoInput = form.querySelector('#asunto');
    const mensajeInput = form.querySelector('#mensaje');

    // Validación básica de campos requeridos
    [nameInput, emailInput, asuntoInput, mensajeInput].forEach((input) => {
      if (!input) return;
      if (!input.value.trim()) {
        input.classList.add('is-invalid');
        isValid = false;
      } else {
        input.classList.remove('is-invalid');
      }
    });

    // Validación simple de email
    if (emailInput && emailInput.value.trim()) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(emailInput.value.trim())) {
        emailInput.classList.add('is-invalid');
        isValid = false;
      }
    }

    if (!isValid) {
      if (statusNotice) {
        statusNotice.style.display = 'block';
        statusNotice.className = 'form-status-notice';
        statusNotice.style.backgroundColor = '#fef2f2';
        statusNotice.style.borderColor = '#fecaca';
        statusNotice.style.color = '#991b1b';
        statusNotice.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          <div><strong>Atención:</strong> Por favor complete todos los campos obligatorios correctamente.</div>
        `;
      }
      return;
    }

    // Estado honesto según regla: NO simular envío falso, avisar estado real de homologación V1
    if (statusNotice) {
      statusNotice.style.display = 'block';
      statusNotice.className = 'form-status-notice';
      statusNotice.style.backgroundColor = '#eff6ff';
      statusNotice.style.borderColor = '#bfdbfe';
      statusNotice.style.color = '#1e40af';
      statusNotice.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
        <div>
          <strong>Versión de Homologación (V1):</strong> El formulario valida correctamente sus datos, pero el servicio de recepción de mensajes no está conectado en esta versión de demostración. Para comunicarse hoy con la empresa, por favor utilice el correo directo <a href="mailto:lcarrasco@serinelec.cl" style="text-decoration:underline; font-weight:700;">lcarrasco@serinelec.cl</a> o el teléfono <a href="tel:+56985680824" style="text-decoration:underline; font-weight:700;">+56 9 8568 0824</a>.
        </div>
      `;
    }
  });

  // Limpiar error al escribir
  form.querySelectorAll('.form-control').forEach((input) => {
    input.addEventListener('input', () => {
      input.classList.remove('is-invalid');
    });
  });
}
