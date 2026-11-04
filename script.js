/**
 * VerdeVivo Paisagismo & Floricultura - Interações da Landing Page
 * Paisagismo Autoral, Jardinagem Residencial/Condominial e Floricultura Boutique
 * JavaScript Vanilla Puro, Leve e de Alta Performance
 */

document.addEventListener('DOMContentLoaded', () => {
  // Configuração Principal (WhatsApp Comercial)
  const WHATSAPP_PHONE = '5511999999999'; // Formato: DDI + DDD + Número sem espaços ou traços

  /* ==========================================================
     1. MODAL DE TRIAGEM RÁPIDA DE WHATSAPP (1-CLIQUE)
     ========================================================== */
  const triageModal = document.getElementById('triageModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const serviceOptionsContainer = document.getElementById('serviceOptions');
  const clientNameInput = document.getElementById('clientName');
  const clientLocationInput = document.getElementById('clientLocation');
  const submitWhatsappBtn = document.getElementById('submitWhatsappBtn');
  const openModalButtons = document.querySelectorAll('.open-triage-modal');

  let selectedService = 'Manutenção de Jardins & Condomínios';

  // Função para abrir o modal
  function openModal(defaultService = null) {
    if (defaultService && defaultService !== 'Projeto Completo') {
      selectedService = defaultService;
      // Atualizar chips ativos
      const chips = serviceOptionsContainer.querySelectorAll('.chip');
      let found = false;
      chips.forEach(chip => {
        if (chip.dataset.value.toLowerCase().includes(defaultService.toLowerCase()) || 
            defaultService.toLowerCase().includes(chip.dataset.value.toLowerCase())) {
          chip.classList.add('active');
          found = true;
        } else {
          chip.classList.remove('active');
        }
      });
      if (!found && chips.length > 0) {
        chips[0].classList.add('active');
        selectedService = chips[0].dataset.value;
      }
    }

    triageModal.classList.add('active');
    triageModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  // Função para fechar o modal
  function closeModal() {
    triageModal.classList.remove('active');
    triageModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Event Listeners dos botões de abertura
  openModalButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const service = btn.getAttribute('data-service') || 'Manutenção de Jardins & Condomínios';
      openModal(service);
      const navMenu = document.getElementById('navMenu');
      const mobileToggle = document.getElementById('mobileToggle');
      if (navMenu && mobileToggle) {
        navMenu.classList.remove('active');
        mobileToggle.classList.remove('active');
      }
    });
  });

  // Fechar no clique do X
  modalCloseBtn.addEventListener('click', closeModal);

  // Fechar ao clicar fora do card
  triageModal.addEventListener('click', (e) => {
    if (e.target === triageModal) {
      closeModal();
    }
  });

  // Fechar com a tecla ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && triageModal.classList.contains('active')) {
      closeModal();
    }
  });

  // Seleção de Chips de Categoria no Modal
  if (serviceOptionsContainer) {
    const chips = serviceOptionsContainer.querySelectorAll('.chip');
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        selectedService = chip.getAttribute('data-value');
      });
    });
  }

  // Disparo Personalizado para o WhatsApp
  submitWhatsappBtn.addEventListener('click', () => {
    const name = clientNameInput.value.trim();
    const location = clientLocationInput.value.trim();

    let message = `Olá, VerdeVivo Paisagismo & Floricultura! Gostaria de orçamento/atendimento para *${selectedService}*.`;

    if (name) {
      message = `Olá, VerdeVivo Paisagismo & Floricultura! Meu nome é *${name}* e gostaria de orçamento/atendimento para *${selectedService}*.`;
    }

    if (location) {
      message += ` Local/Bairro: *${location}*.`;
    }

    message += ` Podem me passar mais informações e disponibilidade?`;

    const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    setTimeout(closeModal, 400);
  });


  /* ==========================================================
     2. ACCORDION DE DÚVIDAS FREQUENTES (FAQ)
     ========================================================== */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        const otherAnswer = otherItem.querySelector('.faq-answer');
        otherAnswer.style.maxHeight = null;
      });

      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });


  /* ==========================================================
     3. MENU MOBILE & NAVEGAÇÃO SUAVE
     ========================================================== */
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      mobileToggle.classList.toggle('active');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileToggle.classList.remove('active');
      });
    });
  }


  /* ==========================================================
     4. ANIMAÇÃO DE CONTAGEM DAS MÉTRICAS
     ========================================================== */
  const statsElements = document.querySelectorAll('.stat-value');
  let animatedStats = false;

  const statsSection = document.querySelector('.stats-counter-section');

  if (statsSection && statsElements.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animatedStats) {
          animatedStats = true;
          statsElements.forEach(el => {
            const target = parseInt(el.getAttribute('data-target'), 10);
            const originalText = el.innerText;
            const hasPlus = originalText.includes('+');
            const hasPercent = originalText.includes('%');
            const hasYears = originalText.includes('Anos');
            const hasHours = originalText.endsWith('h');

            let current = 0;
            const duration = 1800;
            const increment = Math.max(1, Math.ceil(target / (duration / 25)));

            const counter = setInterval(() => {
              current += increment;
              if (current >= target) {
                current = target;
                clearInterval(counter);
                const formatted = target >= 1000 ? target.toLocaleString('pt-BR') : target;
                el.innerText = `${formatted}${hasPlus ? '+' : ''}${hasPercent ? '%' : ''}${hasYears ? ' Anos' : ''}${hasHours ? 'h' : ''}`;
              } else {
                const formatted = current >= 1000 ? current.toLocaleString('pt-BR') : current;
                el.innerText = `${formatted}${hasPlus ? '+' : ''}${hasPercent ? '%' : ''}${hasYears ? ' Anos' : ''}${hasHours ? 'h' : ''}`;
              }
            }, 25);
          });
        }
      });
    }, { threshold: 0.3 });

    observer.observe(statsSection);
  }


  /* ==========================================================
     5. HEADER ELEVATION NO SCROLL
     ========================================================== */
  const mainHeader = document.getElementById('mainHeader');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      mainHeader.style.boxShadow = '0 10px 30px -10px rgba(19, 32, 24, 0.12)';
      mainHeader.style.borderBottomColor = 'rgba(220, 228, 221, 0.6)';
    } else {
      mainHeader.style.boxShadow = 'none';
      mainHeader.style.borderBottomColor = '#DCE4DD';
    }
  }, { passive: true });
});

