/**
 * SERINELEC — Interacciones y Componentes UI
 * - Hero Carousel (accesible, pausado en hover/foco, teclado, touch swipe)
 * - Menú Mobile Drawer
 * - Selector de idiomas
 * - Formulario de contacto con respuesta confirmada por servidor
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
  const toggleBtn = ensureHeaderControls();
  const drawer = document.querySelector('.js-mobile-drawer') || createMobileDrawer();
  const backdrop = document.querySelector('.js-mobile-backdrop') || createMobileBackdrop();
  const closeBtn = drawer.querySelector('.js-drawer-close');
  let previousBodyOverflow = '';

  if (!toggleBtn || !drawer || !backdrop) return;

  drawer.id = drawer.id || 'mobile-drawer';
  drawer.setAttribute('aria-hidden', drawer.classList.contains('is-open') ? 'false' : 'true');
  toggleBtn.setAttribute('aria-controls', drawer.id);

  function openDrawer() {
    drawer.classList.add('is-open');
    backdrop.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    toggleBtn.setAttribute('aria-expanded', 'true');
    previousBodyOverflow = document.body.style.overflow;
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
    document.body.style.overflow = previousBodyOverflow;
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

function getCurrentPageName() {
  const pathname = window.location.pathname;
  const lastSegment = pathname.split('/').filter(Boolean).pop();
  return !lastSegment || !lastSegment.endsWith('.html') ? 'index.html' : lastSegment;
}

function getLanguageNavigation() {
  const page = getCurrentPageName();
  const language = document.documentElement.lang.toLowerCase();

  if (language.startsWith('pt')) {
    return [
      { label: '🇨🇱 Español', href: `../${page}` },
      { label: '🇧🇷 Português', current: true },
      { label: '🇺🇸 English', href: `../en/${page}` }
    ];
  }

  if (language.startsWith('en')) {
    return [
      { label: '🇨🇱 Español', href: `../${page}` },
      { label: '🇧🇷 Português', href: `../pt-br/${page}` },
      { label: '🇺🇸 English', current: true }
    ];
  }

  return [
    { label: '🇨🇱 Español', current: true },
    { label: '🇧🇷 Português', href: `pt-br/${page}` },
    { label: '🇺🇸 English', href: `en/${page}` }
  ];
}

function getMobileMenuCopy() {
  const language = document.documentElement.lang.toLowerCase();
  if (language.startsWith('pt')) {
    return { menu: 'Menu', close: 'Fechar menu de navegação', language: 'Idioma', contact: 'Fale conosco' };
  }
  if (language.startsWith('en')) {
    return { menu: 'Menu', close: 'Close navigation menu', language: 'Language', contact: 'Contact us' };
  }
  return { menu: 'Menú', close: 'Cerrar menú de navegación', language: 'Idioma', contact: 'Contáctenos' };
}

function createLanguageSelector() {
  const copy = getMobileMenuCopy();
  const options = getLanguageNavigation();
  const current = options.find((option) => option.current) || options[0];
  const selector = document.createElement('div');
  const button = document.createElement('button');
  const dropdown = document.createElement('div');

  selector.className = 'lang-selector js-lang-selector';
  button.className = 'lang-btn js-lang-btn';
  button.type = 'button';
  button.setAttribute('aria-haspopup', 'true');
  button.setAttribute('aria-expanded', 'false');
  button.setAttribute('aria-label', copy.language);
  button.textContent = current.label;

  dropdown.className = 'lang-dropdown js-lang-dropdown';
  dropdown.setAttribute('role', 'menu');
  options.forEach((option) => {
    const item = document.createElement(option.current ? 'span' : 'a');
    item.className = `lang-option${option.current ? ' is-active' : ''}`;
    item.textContent = option.label;
    if (option.current) {
      item.setAttribute('aria-current', 'true');
    } else {
      item.href = option.href;
      item.setAttribute('role', 'menuitem');
    }
    dropdown.append(item);
  });

  selector.append(button, dropdown);
  return selector;
}

function createHeaderContactLink(type) {
  const isEmail = type === 'email';
  const link = document.createElement('a');
  const language = document.documentElement.lang.toLowerCase();
  const title = isEmail
    ? language.startsWith('pt') ? 'E-mail direto' : language.startsWith('en') ? 'Direct email' : 'Correo electrónico directo'
    : language.startsWith('pt') ? 'Telefone direto' : language.startsWith('en') ? 'Direct telephone' : 'Teléfono directo';

  link.className = 'header-contact-link';
  link.href = isEmail ? 'mailto:lcarrasco@serinelec.cl' : 'tel:+56985680824';
  link.title = title;
  link.textContent = isEmail ? 'lcarrasco@serinelec.cl' : '+56 9 8568 0824';
  return link;
}

function addContactIcon(link) {
  if (link.querySelector('svg')) return;

  const isEmail = link.href.startsWith('mailto:');
  const label = link.textContent.trim();
  const icon = isEmail
    ? '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>'
    : '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>';
  const text = document.createElement('span');

  link.textContent = '';
  link.insertAdjacentHTML('afterbegin', icon);
  text.textContent = label;
  link.append(text);
}

function ensureDesktopContactLinks(headerTools) {
  let contactGroup = headerTools.querySelector('.header-contact-direct');
  const directLinks = Array.from(headerTools.children).filter((child) => child.classList && child.classList.contains('header-contact-link'));

  if (!contactGroup) {
    contactGroup = document.createElement('div');
    contactGroup.className = 'header-contact-direct';
    directLinks.forEach((link) => contactGroup.append(link));
    headerTools.insertBefore(contactGroup, headerTools.querySelector('.js-lang-selector'));
  }

  ['tel:', 'mailto:'].forEach((protocol) => {
    let link = contactGroup.querySelector(`.header-contact-link[href^="${protocol}"]`);
    if (!link) {
      link = createHeaderContactLink(protocol === 'mailto:' ? 'email' : 'phone');
      contactGroup.append(link);
    }
    addContactIcon(link);
  });
}

function ensureHeaderControls() {
  let headerTools = document.querySelector('.header-tools');
  const headerContainer = document.querySelector('.header-top-container');
  if (!headerTools && headerContainer) {
    headerTools = document.createElement('div');
    headerTools.className = 'header-tools';
    headerContainer.append(headerTools);
  }
  if (!headerTools) return null;

  if (!document.querySelector('.js-lang-selector')) {
    headerTools.append(createLanguageSelector());
  }
  ensureDesktopContactLinks(headerTools);

  let toggleBtn = document.querySelector('.js-mobile-toggle');
  if (!toggleBtn) {
    const copy = getMobileMenuCopy();
    toggleBtn = document.createElement('button');
    toggleBtn.type = 'button';
    toggleBtn.className = 'mobile-toggle js-mobile-toggle';
    toggleBtn.setAttribute('aria-label', copy.menu);
    toggleBtn.setAttribute('aria-expanded', 'false');
    toggleBtn.innerHTML = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
    headerTools.append(toggleBtn);
  }

  return toggleBtn;
}

function createMobileDrawer() {
  const copy = getMobileMenuCopy();
  const drawer = document.createElement('aside');
  const header = document.createElement('div');
  const closeButton = document.createElement('button');
  const navigation = document.createElement('nav');
  const navList = document.createElement('div');
  const language = document.createElement('section');
  const footer = document.createElement('div');

  drawer.id = 'mobile-drawer';
  drawer.className = 'mobile-drawer js-mobile-drawer';
  drawer.setAttribute('aria-hidden', 'true');
  drawer.setAttribute('aria-label', copy.menu);
  drawer.setAttribute('role', 'dialog');
  drawer.setAttribute('aria-modal', 'true');

  header.className = 'mobile-drawer-header';
  header.innerHTML = '<strong>Serinelec</strong>';
  closeButton.type = 'button';
  closeButton.className = 'drawer-close js-drawer-close';
  closeButton.setAttribute('aria-label', copy.close);
  closeButton.innerHTML = '<span aria-hidden="true">×</span>';
  header.append(closeButton);

  navigation.setAttribute('aria-label', copy.menu);
  navList.className = 'mobile-nav-list';
  document.querySelectorAll('.main-navbar .nav-link').forEach((link) => {
    const mobileLink = document.createElement('a');
    mobileLink.className = `mobile-nav-link${link.classList.contains('is-active') ? ' is-active' : ''}`;
    mobileLink.href = link.getAttribute('href');
    mobileLink.textContent = link.textContent.trim();
    navList.append(mobileLink);
  });
  navigation.append(navList);

  language.className = 'mobile-language';
  language.innerHTML = `<p>${copy.language}</p>`;
  getLanguageNavigation().forEach((option) => {
    const item = document.createElement(option.current ? 'span' : 'a');
    item.textContent = option.label;
    if (option.current) {
      item.setAttribute('aria-current', 'true');
    } else {
      item.href = option.href;
    }
    language.append(item);
  });

  footer.className = 'mobile-drawer-footer';
  footer.innerHTML = `<a class="btn btn-accent" href="contacto.html">${copy.contact}</a><a href="tel:+56985680824">+56 9 8568 0824</a><a href="mailto:lcarrasco@serinelec.cl">lcarrasco@serinelec.cl</a>`;
  drawer.append(header, navigation, language, footer);
  document.body.append(drawer);
  return drawer;
}

function createMobileBackdrop() {
  const backdrop = document.createElement('div');
  backdrop.className = 'mobile-backdrop js-mobile-backdrop';
  document.body.append(backdrop);
  return backdrop;
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

  });

  // Os seletores desktop e móvel partilham a mesma rota estática por página.
  document.querySelectorAll('.js-lang-option-disabled').forEach((opt) => {
    const isEnglish = opt.textContent.includes('English');
    opt.classList.remove('is-disabled');
    opt.textContent = isEnglish ? '🇺🇸 English' : '🇧🇷 Português';
    opt.addEventListener('click', (e) => {
      e.preventDefault();
      const page = window.location.pathname.split('/').pop() || 'index.html';
      window.location.href = `${isEnglish ? 'en' : 'pt-br'}/${page}`;
    });
  });
}

/* ==========================================================================
   4. Hero Carousel
   ========================================================================== */
function getCarouselCopy() {
  const language = document.documentElement.lang.toLowerCase();
  if (language.startsWith('pt')) {
    return { slide: 'Slide', previous: 'Slide anterior', next: 'Próximo slide', slides: 'Slides do carrossel' };
  }
  if (language.startsWith('en')) {
    return { slide: 'Slide', previous: 'Previous slide', next: 'Next slide', slides: 'Carousel slides' };
  }
  return { slide: 'Diapositiva', previous: 'Diapositiva anterior', next: 'Diapositiva siguiente', slides: 'Diapositivas del carrusel' };
}

function getLocalizedHeroSlides() {
  const language = document.documentElement.lang.toLowerCase();
  if (language.startsWith('pt')) {
    return [
      {
        eyebrow: 'INSPEÇÕES ITO E ASSESSORIA',
        title: 'Confiança e precisão em cada projeto',
        text: 'Serviços especializados de inspeção técnica de obras (ITO) e verificação de requisitos aplicáveis para apoiar instalações seguras e em conformidade.',
        image: 'hero-2-inspecciones',
        alt: 'Equipamentos de potência e inspeção técnica elétrica',
        primary: { label: 'Conheça nossas soluções', href: 'inspecciones.html' },
        secondary: { label: 'Falar com especialista', href: 'contacto.html' }
      },
      {
        eyebrow: 'SETOR INDUSTRIAL E MINERAÇÃO',
        title: 'Soluções para os desafios da sua empresa',
        text: 'Experiência técnica aplicada a projetos elétricos, transformação de potência e gestão de produção para a indústria e mineração.',
        image: 'hero-3-proyectos',
        alt: 'Infraestrutura e linhas elétricas industriais',
        primary: { label: 'Fale conosco', href: 'contacto.html' },
        secondary: { label: 'Gestão e Produção', href: 'gestion-produccion.html' }
      }
    ];
  }
  if (language.startsWith('en')) {
    return [
      {
        eyebrow: 'ITO INSPECTIONS AND ADVISORY',
        title: 'Confidence and precision in every project',
        text: 'Specialised technical works inspection (ITO) and applicable-requirements verification to support safe, compliant installations.',
        image: 'hero-2-inspecciones',
        alt: 'Power equipment and electrical technical inspection',
        primary: { label: 'Explore our solutions', href: 'inspecciones.html' },
        secondary: { label: 'Speak with a specialist', href: 'contacto.html' }
      },
      {
        eyebrow: 'INDUSTRY AND MINING',
        title: 'Solutions for your company’s challenges',
        text: 'Technical experience applied to electrical projects, power transformation and production management for industry and mining.',
        image: 'hero-3-proyectos',
        alt: 'Industrial electrical infrastructure and power lines',
        primary: { label: 'Contact us', href: 'contacto.html' },
        secondary: { label: 'Management and Production', href: 'gestion-produccion.html' }
      }
    ];
  }
  return [];
}

function createLocalizedHeroSlide(slide, index, total) {
  const article = document.createElement('article');
  const background = document.createElement('div');
  const picture = document.createElement('picture');
  const source = document.createElement('source');
  const image = document.createElement('img');
  const overlay = document.createElement('div');
  const content = document.createElement('div');
  const body = document.createElement('div');
  const eyebrow = document.createElement('span');
  const title = document.createElement('h2');
  const text = document.createElement('p');
  const actions = document.createElement('div');

  article.className = 'carousel-slide js-carousel-slide';
  article.setAttribute('aria-roledescription', 'slide');
  article.setAttribute('aria-label', `${index} ${getCarouselCopy().slide} ${total}`);
  article.setAttribute('aria-hidden', 'true');
  background.className = 'slide-bg-container';
  source.srcset = `../assets/images/hero/${slide.image}.webp`;
  source.type = 'image/webp';
  image.src = `../assets/images/hero/${slide.image}.jpg`;
  image.alt = slide.alt;
  image.className = 'slide-bg-image';
  image.loading = 'lazy';
  overlay.className = 'slide-overlay';
  picture.append(source, image);
  background.append(picture, overlay);

  content.className = 'container slide-content';
  body.className = 'slide-body';
  eyebrow.className = 'slide-pill';
  eyebrow.textContent = slide.eyebrow;
  title.className = 'slide-title';
  title.textContent = slide.title;
  text.className = 'slide-text';
  text.textContent = slide.text;
  actions.className = 'slide-actions';
  [
    { ...slide.primary, className: 'btn btn-accent btn-lg' },
    { ...slide.secondary, className: 'btn btn-outline-white btn-lg' }
  ].forEach((action) => {
    const link = document.createElement('a');
    link.href = action.href;
    link.className = action.className;
    link.textContent = action.label;
    actions.append(link);
  });
  body.append(eyebrow, title, text, actions);
  content.append(body);
  article.append(background, content);
  return article;
}

function ensureCarouselControls(carousel, slideCount) {
  if (carousel.querySelector('.carousel-controls')) return;

  const copy = getCarouselCopy();
  const controls = document.createElement('div');
  const container = document.createElement('div');
  const pagination = document.createElement('div');
  const arrows = document.createElement('div');

  controls.className = 'carousel-controls';
  container.className = 'container';
  pagination.className = 'carousel-pagination';
  pagination.setAttribute('role', 'tablist');
  pagination.setAttribute('aria-label', copy.slides);
  for (let index = 0; index < slideCount; index += 1) {
    const indicator = document.createElement('button');
    indicator.type = 'button';
    indicator.className = `carousel-indicator js-carousel-indicator${index === 0 ? ' is-active' : ''}`;
    indicator.setAttribute('role', 'tab');
    indicator.setAttribute('aria-selected', String(index === 0));
    indicator.setAttribute('aria-label', `${copy.slide} ${index + 1}`);
    pagination.append(indicator);
  }
  arrows.className = 'carousel-nav-arrows';
  [
    { className: 'carousel-btn js-carousel-prev', label: copy.previous, icon: '<polyline points="15 18 9 12 15 6"></polyline>' },
    { className: 'carousel-btn js-carousel-next', label: copy.next, icon: '<polyline points="9 18 15 12 9 6"></polyline>' }
  ].forEach((action) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = action.className;
    button.setAttribute('aria-label', action.label);
    button.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${action.icon}</svg>`;
    arrows.append(button);
  });
  container.append(pagination, arrows);
  controls.append(container);
  carousel.append(controls);
}

function prepareHeroCarousel(carousel) {
  carousel.classList.add('js-hero-carousel');
  const slidesContainer = carousel.querySelector('.carousel-slides');
  if (!slidesContainer) return [];

  let slides = Array.from(slidesContainer.querySelectorAll('.carousel-slide'));
  if (slides.length === 1) {
    const localizedSlides = getLocalizedHeroSlides();
    localizedSlides.forEach((slide, index) => {
      slidesContainer.append(createLocalizedHeroSlide(slide, index + 2, localizedSlides.length + 1));
    });
    slides = Array.from(slidesContainer.querySelectorAll('.carousel-slide'));
  }
  slides.forEach((slide, index) => {
    slide.classList.add('js-carousel-slide');
    slide.setAttribute('aria-roledescription', 'slide');
    slide.setAttribute('aria-label', `${index + 1} ${getCarouselCopy().slide} ${slides.length}`);
    slide.setAttribute('aria-hidden', String(index !== 0));
    slide.classList.toggle('is-active', index === 0);
  });
  if (slides.length > 1) ensureCarouselControls(carousel, slides.length);
  return slides;
}

function initHeroCarousel() {
  const carousel = document.querySelector('.js-hero-carousel, .hero-carousel');
  if (!carousel) return;

  const slides = prepareHeroCarousel(carousel);
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
      indicators[currentIndex].setAttribute('aria-selected', 'false');
    }

    currentIndex = (index + slides.length) % slides.length;

    slides[currentIndex].classList.add('is-active');
    slides[currentIndex].setAttribute('aria-hidden', 'false');
    if (indicators[currentIndex]) {
      indicators[currentIndex].classList.add('is-active');
      indicators[currentIndex].setAttribute('aria-current', 'true');
      indicators[currentIndex].setAttribute('aria-selected', 'true');
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
  const submitBtn = form.querySelector('.js-form-submit');
  const language = document.documentElement.lang.toLowerCase();
  const copy = language.startsWith('pt') ? {
    invalid: 'Atenção: preencha corretamente todos os campos obrigatórios.',
    sending: 'Enviando sua solicitação…',
    success: 'Recebemos sua solicitação. Nossa equipe entrará em contato em breve.',
    unavailable: 'O serviço de mensagens está indisponível no momento. Use o e-mail ou telefone de contato.',
    unexpected: 'Não foi possível enviar sua solicitação. Tente novamente mais tarde ou entre em contato diretamente.',
    send: 'Enviar solicitação'
  } : language.startsWith('en') ? {
    invalid: 'Please complete all required fields correctly.',
    sending: 'Sending your request…',
    success: 'We received your request. Our team will be in touch shortly.',
    unavailable: 'The messaging service is currently unavailable. Please use the email address or telephone number provided.',
    unexpected: 'We could not send your request. Please try again later or contact us directly.',
    send: 'Send request'
  } : {
    invalid: 'Atención: Por favor complete todos los campos obligatorios correctamente.',
    sending: 'Enviando su requerimiento…',
    success: 'Recibimos su requerimiento. Nuestro equipo se contactará a la brevedad.',
    unavailable: 'El servicio de mensajería no está disponible por el momento. Utilice el correo o teléfono de contacto.',
    unexpected: 'No fue posible enviar su requerimiento. Intente nuevamente más tarde o contáctenos directamente.',
    send: 'Enviar Requerimiento'
  };

  function showStatus(type, message) {
    if (!statusNotice) return;
    const palette = type === 'success'
      ? ['#ecfdf5', '#a7f3d0', '#065f46']
      : type === 'error'
        ? ['#fef2f2', '#fecaca', '#991b1b']
        : ['#eff6ff', '#bfdbfe', '#1e40af'];
    statusNotice.style.display = 'flex';
    statusNotice.style.backgroundColor = palette[0];
    statusNotice.style.borderColor = palette[1];
    statusNotice.style.color = palette[2];
    statusNotice.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg><div>${message}</div>`;
  }

  form.addEventListener('submit', async (e) => {
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
      showStatus('error', copy.invalid);
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = copy.sending;
    }
    showStatus('info', copy.sending);

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8', 'Accept': 'application/json' },
        body: new URLSearchParams(new FormData(form)),
        credentials: 'same-origin'
      });
      const payload = await response.json().catch(() => ({}));
      if (response.ok && payload.ok === true) {
        form.reset();
        showStatus('success', payload.message || copy.success);
      } else {
        showStatus('error', payload.message || copy.unavailable);
      }
    } catch (_) {
      showStatus('error', copy.unexpected);
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = copy.send;
      }
    }
  });

  // Limpiar error al escribir
  form.querySelectorAll('.form-control').forEach((input) => {
    input.addEventListener('input', () => {
      input.classList.remove('is-invalid');
    });
  });
}
