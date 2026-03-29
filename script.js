/**
 * LUMINARY — Premium Learning Platform
 * script.js | jQuery + Vanilla ES6
 * Handles: Loader, Navbar, Scroll, Dark Mode, Typed Effect,
 *          Course Filter, Counter, Carousel, Ripple, Form Validation
 */

$(document).ready(function () {

  /* =====================================================
     1. PAGE LOADER
  ===================================================== */
  setTimeout(() => {
    $('#page-loader').addClass('hidden');
    $('body').css('overflow', '');
  }, 2000);
  $('body').css('overflow', 'hidden');


  /* =====================================================
     2. AOS INIT
  ===================================================== */
  AOS.init({
    duration: 800,
    once: true,
    offset: 80,
    easing: 'ease-out-cubic',
  });


  /* =====================================================
     3. NAVBAR: transparent → solid on scroll + spy
  ===================================================== */
  const $nav = $('#mainNav');
  const $sections = $('section[id]');
  const $navLinks = $('.nav-link');

  function handleNavScroll() {
    const scrollY = $(window).scrollTop();

    // Solid navbar
    if (scrollY > 60) {
      $nav.addClass('scrolled');
    } else {
      $nav.removeClass('scrolled');
    }

    // Scroll-spy
    let current = '';
    $sections.each(function () {
      const sectionTop = $(this).offset().top - 90;
      if (scrollY >= sectionTop) {
        current = $(this).attr('id');
      }
    });

    $navLinks.removeClass('active');
    if (current) {
      $navLinks.filter(`[href="#${current}"]`).addClass('active');
    }
  }

  $(window).on('scroll', handleNavScroll);
  handleNavScroll();


  /* =====================================================
     4. SMOOTH SCROLL (jQuery)
  ===================================================== */
  $(document).on('click', 'a[href^="#"]', function (e) {
    const target = $(this).attr('href');
    if ($(target).length) {
      e.preventDefault();
      const offset = $(target).offset().top - 70;
      $('html, body').animate({ scrollTop: offset }, 650, 'swing');
      // Close mobile menu if open
      $('.navbar-collapse').collapse('hide');
    }
  });


  /* =====================================================
     5. SCROLL-TO-TOP BUTTON
  ===================================================== */
  const $scrollBtn = $('#scroll-top');

  $(window).on('scroll', function () {
    if ($(this).scrollTop() > 400) {
      $scrollBtn.addClass('visible');
    } else {
      $scrollBtn.removeClass('visible');
    }
  });

  $scrollBtn.on('click', function () {
    $('html, body').animate({ scrollTop: 0 }, 600);
  });


  /* =====================================================
     6. DARK / LIGHT THEME TOGGLE
  ===================================================== */
  const $html = $('html');
  const $themeIcon = $('#theme-icon');
  const savedTheme = localStorage.getItem('luminary-theme') || 'dark';
  applyTheme(savedTheme);

  function applyTheme(theme) {
    $html.attr('data-theme', theme);
    if (theme === 'light') {
      $themeIcon.removeClass('fa-moon').addClass('fa-sun');
    } else {
      $themeIcon.removeClass('fa-sun').addClass('fa-moon');
    }
    localStorage.setItem('luminary-theme', theme);
  }

  $('#theme-toggle').on('click', function () {
    const current = $html.attr('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });


  /* =====================================================
     7. TYPED HEADING EFFECT
  ===================================================== */
  const words = ['Future', 'Coding', 'Design', 'AI/ML', 'Success'];
  let wIdx = 0;
  let cIdx = 0;
  let deleting = false;
  const $typed = $('.typed-text');

  function typeLoop() {
    const word = words[wIdx];

    if (!deleting) {
      $typed.text(word.slice(0, cIdx + 1));
      cIdx++;
      if (cIdx === word.length) {
        deleting = true;
        setTimeout(typeLoop, 1800);
        return;
      }
    } else {
      $typed.text(word.slice(0, cIdx - 1));
      cIdx--;
      if (cIdx === 0) {
        deleting = false;
        wIdx = (wIdx + 1) % words.length;
      }
    }

    setTimeout(typeLoop, deleting ? 60 : 100);
  }

  setTimeout(typeLoop, 2200); // start after loader


  /* =====================================================
     8. COURSE FILTERING + LIVE SEARCH
  ===================================================== */
  const $filterBtns = $('.filter-btn');
  const $courseItems = $('.course-item');
  const $searchInput = $('#courseSearch');
  const $noResults = $('#noResults');

  let activeFilter = 'all';

  function filterCourses() {
    const searchTerm = $searchInput.val().toLowerCase().trim();
    let visibleCount = 0;

    $courseItems.each(function () {
      const category = $(this).data('category');
      const title = $(this).find('h3').text().toLowerCase();
      const desc = $(this).find('p').text().toLowerCase();

      const categoryMatch = activeFilter === 'all' || category === activeFilter;
      const searchMatch = !searchTerm || title.includes(searchTerm) || desc.includes(searchTerm);

      if (categoryMatch && searchMatch) {
        $(this).removeClass('hidden').addClass('animate__animated animate__fadeIn');
        visibleCount++;
      } else {
        $(this).addClass('hidden').removeClass('animate__animated animate__fadeIn');
      }
    });

    if (visibleCount === 0) {
      $noResults.removeClass('d-none');
    } else {
      $noResults.addClass('d-none');
    }
  }

  $filterBtns.on('click', function () {
    $filterBtns.removeClass('active');
    $(this).addClass('active');
    activeFilter = $(this).data('filter');
    filterCourses();
  });

  $searchInput.on('input keyup', function () {
    filterCourses();
  });


  /* =====================================================
     9. STATS COUNTER ANIMATION (jQuery)
  ===================================================== */
  let counterDone = false;

  function animateCounters() {
    if (counterDone) return;

    const $statsSection = $('#stats');
    if ($statsSection.length === 0) return;

    const sectionTop = $statsSection.offset().top;
    const windowBottom = $(window).scrollTop() + $(window).height();

    if (windowBottom > sectionTop + 100) {
      counterDone = true;

      $('.stat-num').each(function () {
        const $el = $(this);
        const target = parseInt($el.data('target'), 10);
        const duration = 1800;
        const start = Date.now();

        function update() {
          const elapsed = Date.now() - start;
          const progress = Math.min(elapsed / duration, 1);
          // easeOutExpo
          const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
          const current = Math.floor(ease * target);
          $el.text(current.toLocaleString());
          if (progress < 1) requestAnimationFrame(update);
        }

        requestAnimationFrame(update);
      });
    }
  }

  $(window).on('scroll', animateCounters);
  animateCounters(); // check on load


  /* =====================================================
     10. TESTIMONIAL CAROUSEL — auto slide + pause on hover
  ===================================================== */
  const carouselEl = document.getElementById('testimonialCarousel');
  if (carouselEl) {
    const carousel = new bootstrap.Carousel(carouselEl, {
      interval: 5000,
      ride: 'carousel',
      wrap: true,
    });

    // Sync indicator dots
    carouselEl.addEventListener('slide.bs.carousel', function (e) {
      $('.ci-dot').removeClass('active');
      $(`.ci-dot[data-bs-slide-to="${e.to}"]`).addClass('active');
    });

    // Pause on hover
    $('#testimonialCarousel').on('mouseenter', function () {
      carousel.pause();
    }).on('mouseleave', function () {
      carousel.cycle();
    });
  }


  /* =====================================================
     11. RIPPLE EFFECT ON BUTTONS
  ===================================================== */
  $(document).on('click', '.ripple-btn', function (e) {
    const $btn = $(this);
    const offset = $btn.offset();
    const x = e.pageX - offset.left;
    const y = e.pageY - offset.top;
    const size = Math.max($btn.outerWidth(), $btn.outerHeight());

    const $ripple = $('<span class="ripple"></span>').css({
      width: size,
      height: size,
      left: x - size / 2,
      top: y - size / 2,
    });

    $btn.append($ripple);
    setTimeout(() => $ripple.remove(), 700);
  });


  /* =====================================================
     12. FORM VALIDATION (Real-time + Submission)
  ===================================================== */

  // ── Validation Rules ──
  const validators = {
    name: {
      validate: (val) => val.trim().length >= 3,
      errorMsg: 'Name must be at least 3 characters.',
      successMsg: 'Looks good!',
    },
    email: {
      validate: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim()),
      errorMsg: 'Please enter a valid email address.',
      successMsg: 'Valid email address.',
    },
    phone: {
      validate: (val) => /^\d{10,12}$/.test(val.trim().replace(/[\s\-()]/g, '')),
      errorMsg: 'Phone must be 10–12 digits (numbers only).',
      successMsg: 'Valid phone number.',
    },
    message: {
      validate: (val) => val.trim().length >= 10,
      errorMsg: 'Message must be at least 10 characters.',
      successMsg: 'Message looks great!',
    },
  };

  // ── Utility: set field state ──
  function setFieldState($input, state, msg) {
    const $wrap = $input.closest('.input-wrap');
    const $feedback = $wrap.closest('.form-group-custom').find('.field-feedback');

    $wrap.removeClass('is-valid is-invalid');
    $feedback.removeClass('error success').text('');

    if (state === 'valid') {
      $wrap.addClass('is-valid');
      $feedback.addClass('success').text(msg || '');
    } else if (state === 'invalid') {
      $wrap.addClass('is-invalid');
      $feedback.addClass('error').text(msg || '');
    }
  }

  // ── Utility: validate a single field ──
  function validateField($input) {
    const name = $input.attr('name');
    const val = $input.val();
    const rule = validators[name];

    if (!rule) return true;

    if (!val.trim()) {
      setFieldState($input, 'invalid', 'This field is required.');
      return false;
    }

    if (!rule.validate(val)) {
      setFieldState($input, 'invalid', rule.errorMsg);
      return false;
    }

    setFieldState($input, 'valid', rule.successMsg);
    return true;
  }

  // ── Real-time validation: keyup ──
  $('#contactForm input, #contactForm textarea').on('keyup input', function () {
    const $this = $(this);
    // Only validate once user has typed something
    if ($this.val().trim().length > 0) {
      validateField($this);
    } else {
      // Clear state if empty
      const $wrap = $this.closest('.input-wrap');
      const $feedback = $this.closest('.form-group-custom').find('.field-feedback');
      $wrap.removeClass('is-valid is-invalid');
      $feedback.removeClass('error success').text('');
    }
  });

  // ── Real-time validation: blur (on leave) ──
  $('#contactForm input, #contactForm textarea').on('blur', function () {
    validateField($(this));
  });

  // ── Phone: allow only digits, spaces, dashes ──
  $('#cPhone').on('keypress', function (e) {
    const char = String.fromCharCode(e.which);
    if (!/[\d\s\-()]/.test(char)) {
      e.preventDefault();
    }
  });

  // ── Form submission ──
  $('#contactForm').on('submit', function (e) {
    e.preventDefault();

    // Validate all fields
    let isValid = true;
    $(this).find('input, textarea').each(function () {
      if (!validateField($(this))) {
        isValid = false;
      }
    });

    if (!isValid) {
      // Shake the form
      const $glass = $('.contact-glass');
      $glass.addClass('animate__animated animate__shakeX');
      setTimeout(() => $glass.removeClass('animate__animated animate__shakeX'), 600);
      // Focus first invalid
      $('#contactForm .input-wrap.is-invalid input, #contactForm .input-wrap.is-invalid textarea').first().focus();
      return;
    }

    // Simulate submit
    const $btn = $('#submitBtn');
    const $btnText = $btn.find('.btn-text');
    const $btnLoader = $btn.find('.btn-loader');

    $btn.prop('disabled', true);
    $btnText.addClass('d-none');
    $btnLoader.removeClass('d-none');

    setTimeout(() => {
      // Reset
      $btn.prop('disabled', false);
      $btnText.removeClass('d-none');
      $btnLoader.addClass('d-none');

      // Show success
      $('#contactForm').addClass('d-none');
      $('#successMsg').removeClass('d-none').addClass('animate__animated animate__fadeInUp');

      // Auto-reset after 5s
      setTimeout(() => {
        $('#contactForm')[0].reset();
        $('#contactForm input, #contactForm textarea').each(function () {
          const $wrap = $(this).closest('.input-wrap');
          const $feedback = $(this).closest('.form-group-custom').find('.field-feedback');
          $wrap.removeClass('is-valid is-invalid');
          $feedback.removeClass('error success').text('');
        });
        $('#contactForm').removeClass('d-none');
        $('#successMsg').addClass('d-none').removeClass('animate__animated animate__fadeInUp');
      }, 5000);
    }, 2000);
  });


  /* =====================================================
     13. PARALLAX CTA BACKGROUND
  ===================================================== */
  $(window).on('scroll', function () {
    const scrolled = $(this).scrollTop();
    const $cta = $('#cta');
    if ($cta.length === 0) return;
    const sectionTop = $cta.offset().top;
    const relative = scrolled - sectionTop;
    $('.cta-parallax-bg').css('transform', `translateY(${relative * 0.25}px)`);
  });


  /* =====================================================
     14. ENROLL BUTTON FEEDBACK (cards)
  ===================================================== */
  $(document).on('click', '.btn-card', function () {
    const $btn = $(this);
    const original = $btn.html();
    $btn.html('<i class="fa-solid fa-check me-1"></i> Added to Cart!');
    $btn.css({ background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', 'border-color': 'transparent' });
    setTimeout(() => {
      $btn.html(original);
      $btn.css({ background: '', color: '', 'border-color': '' });
    }, 2200);
  });

}); // end document ready