/**
 * Keihan Javadi - Precision Engineering & Research Portfolio JavaScript
 * Sharif University of Technology - Mechanical Engineering
 */

document.addEventListener('DOMContentLoaded', () => {
  // =========================================================================
  // 1. Theme Switcher (Dark / Light Mode)
  // =========================================================================
  const themeToggle = document.getElementById('theme-toggle');
  const htmlRoot = document.documentElement;

  const savedTheme = localStorage.getItem('kj_theme');
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  const initialTheme = savedTheme || (prefersLight ? 'light' : 'dark');

  setTheme(initialTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = htmlRoot.getAttribute('data-theme') || 'dark';
      const nextTheme = current === 'dark' ? 'light' : 'dark';
      setTheme(nextTheme);
    });
  }

  function setTheme(theme) {
    htmlRoot.setAttribute('data-theme', theme);
    localStorage.setItem('kj_theme', theme);

    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#050811' : '#f8fafc');
    }
  }

  // =========================================================================
  // 2. Navbar Shrink & Scrollspy
  // =========================================================================
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -65% 0px',
    threshold: 0,
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((sec) => navObserver.observe(sec));

  // =========================================================================
  // 3. Mobile Navigation Drawer
  // =========================================================================
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navMenu = document.getElementById('nav-menu');

  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      hamburgerBtn.classList.toggle('open', isOpen);
      hamburgerBtn.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        hamburgerBtn.classList.remove('open');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // =========================================================================
  // 4. Interactive Project Image Showcase (Thumbnail Switcher)
  // =========================================================================
  const carousels = document.querySelectorAll('.thumbs-carousel');

  carousels.forEach((carousel) => {
    const targetImgId = carousel.getAttribute('data-target');
    const targetImg = document.getElementById(targetImgId);
    const thumbBtns = carousel.querySelectorAll('.thumb-btn');

    if (!targetImg) return;

    thumbBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        thumbBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const newSrc = btn.getAttribute('data-src');
        const newCaption = btn.getAttribute('data-caption');

        targetImg.style.opacity = '0.3';
        targetImg.style.transform = 'scale(0.97)';

        setTimeout(() => {
          targetImg.src = newSrc;
          targetImg.setAttribute('data-caption', newCaption || '');
          targetImg.style.opacity = '1';
          targetImg.style.transform = 'scale(1)';
        }, 150);
      });
    });
  });

  // =========================================================================
  // 5. Technical Deep Dive Modals
  // =========================================================================
  const openModalBtns = document.querySelectorAll('.open-modal-btn');
  const closeModalBtns = document.querySelectorAll('.modal-close-btn');
  const modalBackdrops = document.querySelectorAll('.modal-backdrop');

  openModalBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-modal');
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeAllModals() {
    modalBackdrops.forEach((modal) => modal.classList.remove('open'));
    document.body.style.overflow = '';
  }

  closeModalBtns.forEach((btn) => {
    btn.addEventListener('click', closeAllModals);
  });

  modalBackdrops.forEach((backdrop) => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        closeAllModals();
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllModals();
      closeLightbox();
    }
  });

  // Modal Tab Switching
  const modalTabBtns = document.querySelectorAll('.modal-tab-btn');

  modalTabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const parentModal = btn.closest('.modal-dialog');
      if (!parentModal) return;

      const targetTabId = btn.getAttribute('data-tab');

      parentModal.querySelectorAll('.modal-tab-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      parentModal.querySelectorAll('.modal-tab-pane').forEach((pane) => {
        if (pane.getAttribute('id') === targetTabId) {
          pane.classList.add('active');
        } else {
          pane.classList.remove('active');
        }
      });
    });
  });

  // =========================================================================
  // 6. Fullscreen Lightbox for Enlarged Diagrams
  // =========================================================================
  const lightbox = document.getElementById('lightbox-overlay');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxCloseBtn = document.querySelector('.lightbox-close-btn');

  function openLightbox(src, caption) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightboxCaption.textContent = caption || '';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    if (!document.querySelector('.modal-backdrop.open')) {
      document.body.style.overflow = '';
    }
  }

  if (lightboxCloseBtn) {
    lightboxCloseBtn.addEventListener('click', closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }

  // Bind to all lightbox triggers (images in cards, galleries, frames)
  document.querySelectorAll('.lightbox-trigger').forEach((img) => {
    img.addEventListener('click', () => {
      openLightbox(img.src, img.getAttribute('data-caption'));
    });
  });

  // =========================================================================
  // 7. Toast Notice & Copy Helpers (Citation / Email)
  // =========================================================================
  const toast = document.getElementById('toast-notice');
  const toastText = document.getElementById('toast-text');
  let toastTimer = null;

  function showToast(message) {
    if (!toast) return;
    toastText.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  // Copy Email Buttons
  document.querySelectorAll('.copy-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Email copied: ${textToCopy}`);
        });
      }
    });
  });

  // Copy Citation / BibTeX
  document.querySelectorAll('.copy-citation-btn, .copy-bibtex-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const citation = btn.getAttribute('data-citation') || btn.getAttribute('data-bibtex');
      if (citation) {
        navigator.clipboard.writeText(citation).then(() => {
          showToast('Citation copied to clipboard!');
        });
      }
    });
  });

  // =========================================================================
  // 8. Projects Filter Tabs
  // =========================================================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });

  // =========================================================================
  // 9. Contact Form Handler (Direct Mailto with Values)
  // =========================================================================
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contact-name').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const subject = document.getElementById('contact-subject').value.trim();
      const body = document.getElementById('contact-body').value.trim();

      const fullSubject = encodeURIComponent(`[Portfolio Inquiry] ${subject}`);
      const fullBody = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${body}`);

      window.location.href = `mailto:Javadi.keihan@gmail.com?subject=${fullSubject}&body=${fullBody}`;
    });
  }

  // =========================================================================
  // 10. Dynamic Year in Footer
  // =========================================================================
  const yearElem = document.getElementById('current-year');
  if (yearElem) {
    yearElem.textContent = new Date().getFullYear();
  }
});
