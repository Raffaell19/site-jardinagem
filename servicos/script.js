// ==========================================================================
// TERRAVERDE JARDINAGEM PROFISSIONAL - SCRIPT DE INTERAÇÕES E CONVERSÃO
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
  initHeaderScroll();
  initTriageModal();
  initFaqAccordion();
  initStatsCounter();
  initSmoothScroll();
});

// 1. Mobile Menu Toggle
function initMobileMenu() {
  const hamburger = document.getElementById("hamburgerBtn");
  const navMenu = document.getElementById("navMenu");
  const navLinks = document.querySelectorAll(".nav-link");

  if (!hamburger || !navMenu) return;

  hamburger.addEventListener("click", () => {
    const isExpanded = hamburger.getAttribute("aria-expanded") === "true";
    hamburger.setAttribute("aria-expanded", !isExpanded);
    navMenu.classList.toggle("is-open");
    document.body.classList.toggle("menu-lock");
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.setAttribute("aria-expanded", "false");
      navMenu.classList.remove("is-open");
      document.body.classList.remove("menu-lock");
    });
  });
}

// 2. Header Glassmorphism on Scroll
function initHeaderScroll() {
  const header = document.querySelector(".main-header");
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();
}

// 3. Modal de Triagem Inteligente para WhatsApp
function initTriageModal() {
  const modal = document.getElementById("triageModal");
  const openButtons = document.querySelectorAll(".open-triage-modal");
  const closeBtn = document.getElementById("closeModalBtn");
  const modalServiceSelect = document.getElementById("modalServiceSelect");
  const modalForm = document.getElementById("modalTriageForm");

  if (!modal) return;

  const openModal = (serviceName) => {
    if (modalServiceSelect && serviceName) {
      for (let i = 0; i < modalServiceSelect.options.length; i++) {
        if (modalServiceSelect.options[i].text.includes(serviceName) || modalServiceSelect.options[i].value.includes(serviceName)) {
          modalServiceSelect.selectedIndex = i;
          break;
        }
      }
    }
    modal.classList.add("is-active");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-lock");
  };

  const closeModal = () => {
    modal.classList.remove("is-active");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-lock");
  };

  openButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const service = btn.getAttribute("data-service") || "";
      openModal(service);
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", closeModal);
  }

  modal.addEventListener("click", (e) => {
    if (e.target === modal || e.target.classList.contains("modal-overlay")) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-active")) {
      closeModal();
    }
  });

  if (modalForm) {
    modalForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const nameInput = document.getElementById("clientName");
      const serviceSelect = document.getElementById("modalServiceSelect");
      const areaTypeSelect = document.getElementById("modalAreaType");
      const notesInput = document.getElementById("clientNotes");

      const name = nameInput ? nameInput.value.trim() : "";
      const service = serviceSelect ? serviceSelect.value : "Serviços Gerais de Jardinagem";
      const areaType = areaTypeSelect ? areaTypeSelect.value : "Residencial";
      const notes = notesInput ? notesInput.value.trim() : "";

      const phone = "5511999999999"; // Substituir pelo número comercial do profissional

      let msg = `Olá, TerraVerde Jardinagem! Vim pelo site e gostaria de solicitar um orçamento:\n\n`;
      if (name) msg += `*Nome:* ${name}\n`;
      msg += `*Serviço Desejado:* ${service}\n`;
      msg += `*Tipo de Imóvel/Área:* ${areaType}\n`;
      if (notes) msg += `*Observações:* ${notes}\n`;
      msg += `\nPoderiam me passar uma estimativa de valores e disponibilidade de agenda?`;

      const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
      closeModal();
    });
  }
}

// 4. FAQ Accordion
function initFaqAccordion() {
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const questionBtn = item.querySelector(".faq-question");
    if (!questionBtn) return;

    questionBtn.addEventListener("click", () => {
      const isOpen = item.classList.contains("is-active");

      // Fecha outros itens
      faqItems.forEach((other) => {
        if (other !== item) {
          other.classList.remove("is-active");
          const btn = other.querySelector(".faq-question");
          if (btn) btn.setAttribute("aria-expanded", "false");
        }
      });

      if (isOpen) {
        item.classList.remove("is-active");
        questionBtn.setAttribute("aria-expanded", "false");
      } else {
        item.classList.add("is-active");
        questionBtn.setAttribute("aria-expanded", "true");
      }
    });
  });
}

// 5. Contadores de Estatísticas Animados
function initStatsCounter() {
  const counterElements = document.querySelectorAll(".stat-number");
  if (!counterElements.length) return;

  let hasAnimated = false;

  const animateCounters = () => {
    counterElements.forEach((el) => {
      const target = parseInt(el.getAttribute("data-target"), 10) || 0;
      const duration = 1800;
      const step = 20;
      const increment = target / (duration / step);
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          el.innerText = target.toLocaleString("pt-BR");
          clearInterval(timer);
        } else {
          el.innerText = Math.floor(current).toLocaleString("pt-BR");
        }
      }, step);
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasAnimated) {
          hasAnimated = true;
          animateCounters();
          observer.disconnect();
        }
      });
    },
    { threshold: 0.3 }
  );

  const statsSection = document.querySelector(".stats-counter-section");
  if (statsSection) {
    observer.observe(statsSection);
  }
}

// 6. Smooth Scroll para links internos
function initSmoothScroll() {
  const internalLinks = document.querySelectorAll('a[href^="#"]');

  internalLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href");
      if (targetId === "#" || !targetId) return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerHeight = document.querySelector(".main-header")?.offsetHeight || 80;
        const targetPos = targetEl.getBoundingClientRect().top + window.scrollY - headerHeight;

        window.scrollTo({
          top: targetPos,
          behavior: "smooth"
        });
      }
    });
  });
}

