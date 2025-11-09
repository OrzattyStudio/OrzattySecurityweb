// Fallback Animation System (when AOS is not loaded)
function initializeFallbackAnimations() {
  if (typeof IntersectionObserver === 'undefined') return;

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('aos-animate');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Find all elements that should be animated
  const animatedElements = document.querySelectorAll('[data-aos]');
  
  // Add initial animation state
  animatedElements.forEach(el => {
    el.classList.add('aos-fallback');
    observer.observe(el);
  });

  // Add fallback styles
  const style = document.createElement('style');
  style.textContent = `
    .aos-fallback {
      opacity: 0;
      transform: translateY(30px);
      transition: opacity 0.8s ease, transform 0.8s ease;
    }
    .aos-fallback.aos-animate {
      opacity: 1;
      transform: translateY(0);
    }
  `;
  document.head.appendChild(style);
}

// Initialize AOS (Animate On Scroll) or fallback
document.addEventListener('DOMContentLoaded', function() {
  // Check if AOS is available and initialize
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      offset: 100,
      delay: 0
    });
  } else {
    // AOS not available, use Intersection Observer fallback
    initializeFallbackAnimations();
  }

  // Form Validation Helper Functions
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  function validateField(input) {
    let isValid = true;
    let errorMessage = '';

    if (input.hasAttribute('required') && !input.value.trim()) {
      isValid = false;
      errorMessage = 'Este campo es obligatorio';
    } else if (input.type === 'email' && input.value.trim() && !validateEmail(input.value)) {
      isValid = false;
      errorMessage = 'Ingresa un email válido';
    }

    // Update UI
    const errorElement = input.parentElement.querySelector('.field-error');
    if (!isValid) {
      input.classList.add('error');
      if (!errorElement) {
        const error = document.createElement('span');
        error.className = 'field-error';
        error.style.color = '#ef4444';
        error.style.fontSize = '0.875rem';
        error.style.marginTop = '0.25rem';
        error.style.display = 'block';
        error.textContent = errorMessage;
        input.parentElement.appendChild(error);
      } else {
        errorElement.textContent = errorMessage;
      }
    } else {
      input.classList.remove('error');
      if (errorElement) {
        errorElement.remove();
      }
    }

    return isValid;
  }

  function validateForm(form) {
    const inputs = form.querySelectorAll('[required]');
    let isValid = true;
    let errors = [];

    inputs.forEach(input => {
      if (!validateField(input)) {
        isValid = false;
        const label = input.previousElementSibling?.textContent || input.name;
        errors.push(`${label}`);
      }
    });

    return { isValid, errors };
  }

  // Real-time validation for all form fields
  const allInputs = document.querySelectorAll('input, select, textarea');
  allInputs.forEach(input => {
    // Validate on blur
    input.addEventListener('blur', function() {
      if (this.hasAttribute('required') || (this.type === 'email' && this.value.trim())) {
        validateField(this);
      }
    });
    
    // Clear error and validate on input (real-time feedback)
    input.addEventListener('input', function() {
      if (this.classList.contains('error')) {
        validateField(this);
      }
    });

    // Validate on change for select elements
    if (input.tagName === 'SELECT') {
      input.addEventListener('change', function() {
        validateField(this);
      });
    }
  });

  // EmailJS Configuration
  const EMAILJS_PUBLIC_KEY = '9BJcijB0VqohdodL6';
  const EMAILJS_SERVICE_ID = 'service_hndf74d';
  const EMAILJS_TEMPLATE_ID = 'template_1xd1jrc';

  // Initialize EmailJS
  if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY !== '9BJcijB0VqohdodL6') {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  }

  // Custom Quote Form Handler with SweetAlert2, Validation and EmailJS
  const customQuoteForm = document.getElementById('customQuoteForm');
  
  if (customQuoteForm) {
    customQuoteForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Validate form
      const validation = validateForm(this);
      
      if (!validation.isValid) {
        if (typeof Swal !== 'undefined') {
          Swal.fire({
            icon: 'error',
            title: 'Formulario Incompleto',
            html: '<p>Por favor, revisa los campos marcados en rojo y corrige los errores.</p>',
            confirmButtonText: 'Entendido',
            background: '#0a0a0a',
            color: '#e5e7eb',
            confirmButtonColor: '#d4af37'
          });
        } else {
          alert('Por favor, completa todos los campos requeridos correctamente.');
        }
        return;
      }
      
      const formData = {
        assetType: document.getElementById('assetType').value,
        scope: document.getElementById('scope').value,
        challenge: document.getElementById('challenge').value,
        email: document.getElementById('email').value
      };
      
      // Disable submit button during processing
      const submitBtn = this.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Enviando...';
      
      // Check if EmailJS is configured
      if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY !== 'TU_PUBLIC_KEY_AQUI') {
        // Send email using EmailJS
        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
          asset_type: formData.assetType,
          scope: formData.scope,
          challenge: formData.challenge,
          user_email: formData.email,
          to_email: 'orzattydavid@gmail.com' // Reemplaza con tu email real donde quieres recibir las solicitudes
        })
        .then(function(response) {
          console.log('Email enviado exitosamente:', response);
          
          if (typeof Swal !== 'undefined') {
            Swal.fire({
              icon: 'success',
              title: '¡Solicitud Enviada!',
              html: '<p>Gracias por su solicitud de presupuesto personalizado.</p><p>Hemos recibido su información y nos pondremos en contacto con usted en las próximas <strong>24 horas</strong> para discutir sus necesidades de seguridad.</p>',
              confirmButtonText: 'Entendido',
              background: '#0a0a0a',
              color: '#e5e7eb',
              confirmButtonColor: '#d4af37'
            });
          } else {
            alert('¡Gracias por su solicitud! Nos pondremos en contacto con usted en las próximas 24 horas.');
          }
          
          customQuoteForm.reset();
          // Clear all error states
          const errorElements = customQuoteForm.querySelectorAll('.field-error');
          errorElements.forEach(el => el.remove());
          const errorInputs = customQuoteForm.querySelectorAll('.error');
          errorInputs.forEach(el => el.classList.remove('error'));
          
          // Re-enable button
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        })
        .catch(function(error) {
          console.error('Error al enviar email:', error);
          
          if (typeof Swal !== 'undefined') {
            Swal.fire({
              icon: 'error',
              title: 'Error al Enviar',
              html: '<p>Hubo un problema al enviar su solicitud. Por favor, intente nuevamente o contáctenos directamente.</p>',
              confirmButtonText: 'Entendido',
              background: '#0a0a0a',
              color: '#e5e7eb',
              confirmButtonColor: '#d4af37'
            });
          } else {
            alert('Error al enviar la solicitud. Por favor, intente nuevamente.');
          }
          
          // Re-enable button
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        });
      } else {
        // EmailJS not configured - fallback to console log
        console.log('Solicitud de presupuesto personalizado:', formData);
        console.warn('EmailJS no está configurado. Por favor, configura tus credenciales en script.js');
        
        if (typeof Swal !== 'undefined') {
          Swal.fire({
            icon: 'warning',
            title: 'Modo Demo',
            html: '<p>EmailJS no está configurado. Los datos se han registrado en la consola.</p><p>Para activar el envío de emails, configura tus credenciales de EmailJS en script.js</p>',
            confirmButtonText: 'Entendido',
            background: '#0a0a0a',
            color: '#e5e7eb',
            confirmButtonColor: '#d4af37'
          });
        } else {
          alert('EmailJS no está configurado. Ver consola para detalles.');
        }
        
        customQuoteForm.reset();
        const errorElements = customQuoteForm.querySelectorAll('.field-error');
        errorElements.forEach(el => el.remove());
        const errorInputs = customQuoteForm.querySelectorAll('.error');
        errorInputs.forEach(el => el.classList.remove('error'));
        
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    });
  }

  // Pricing Buttons Handler with SweetAlert2
  const pricingButtons = document.querySelectorAll('.btn-pricing');
  pricingButtons.forEach(button => {
    button.addEventListener('click', function() {
      const card = this.closest('.pricing-card');
      const planName = card.querySelector('h3').textContent;
      const price = card.querySelector('.price').textContent;
      
      if (typeof Swal !== 'undefined') {
        Swal.fire({
          icon: 'info',
          title: `Plan ${planName}`,
          html: `<p>Has seleccionado el plan <strong>${planName}</strong> por <strong>${price}</strong>.</p><p>¿Deseas proceder con la solicitud?</p>`,
          showCancelButton: true,
          confirmButtonText: 'Solicitar Ahora',
          cancelButtonText: 'Cancelar',
          background: '#0a0a0a',
          color: '#e5e7eb',
          confirmButtonColor: '#d4af37',
          cancelButtonColor: '#1e3a8a'
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire({
              icon: 'success',
              title: '¡Excelente Elección!',
              html: '<p>Nos pondremos en contacto contigo pronto para procesar tu solicitud del plan <strong>' + planName + '</strong>.</p>',
              confirmButtonText: 'Perfecto',
              background: '#0a0a0a',
              color: '#e5e7eb',
              confirmButtonColor: '#d4af37'
            });
          }
        });
      } else {
        alert(`¡Gracias por su interés en el plan ${planName}! Nos pondremos en contacto con usted para procesar su solicitud.`);
      }
    });
  });

  // Enhanced Smooth Scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      e.preventDefault();
      const target = document.querySelector(href);
      
      if (target) {
        // Use smooth scroll if available
        if ('scrollBehavior' in document.documentElement.style) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        } else {
          // Fallback for browsers that don't support smooth scroll
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
          const startPosition = window.pageYOffset;
          const distance = targetPosition - startPosition;
          const duration = 800;
          let start = null;
          
          function animation(currentTime) {
            if (start === null) start = currentTime;
            const timeElapsed = currentTime - start;
            const run = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
          }
          
          function ease(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
          }
          
          requestAnimationFrame(animation);
        }
      }
    });
  });

  // Add loading animation for forms
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      const submitBtn = this.querySelector('button[type="submit"]');
      if (submitBtn && !submitBtn.disabled) {
        submitBtn.disabled = true;
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Procesando...';
        
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }, 2000);
      }
    });
  });
});

// Add CSS for error states
const errorStyle = document.createElement('style');
errorStyle.textContent = `
  .error {
    border-color: #ef4444 !important;
  }
  .field-error {
    color: #ef4444;
    font-size: 0.875rem;
    margin-top: 0.25rem;
    display: block;
  }
`;
document.head.appendChild(errorStyle);
