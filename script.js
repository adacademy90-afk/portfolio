// Portfólio — interações vanilla (sem frameworks)
// Cada bloco é independente e falha de forma silenciosa caso o elemento não exista.

(function () {
    "use strict";
  
    /* ---------- ano automático no rodapé ---------- */
    var yearEl = document.getElementById("year");
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }
  
    /* ---------- header compacto ao rolar + barra de progresso ---------- */
    var header = document.getElementById("siteHeader");
    var progressBar = document.getElementById("progressBar");
  
    function onScroll() {
      var scrollTop = window.scrollY || document.documentElement.scrollTop;
  
      if (header) {
        header.classList.toggle("scrolled", scrollTop > 12);
      }
  
      if (progressBar) {
        var doc = document.documentElement;
        var total = doc.scrollHeight - doc.clientHeight;
        var pct = total > 0 ? (scrollTop / total) * 100 : 0;
        progressBar.style.width = pct + "%";
      }
    }
  
    var ticking = false;
    window.addEventListener("scroll", function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          onScroll();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
    onScroll();
  
    /* ---------- menu mobile ---------- */
    var navToggle = document.getElementById("navToggle");
    var mainNav = document.getElementById("mainNav");
  
    function setMenu(open) {
      if (!navToggle || !mainNav) return;
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
      mainNav.classList.toggle("open", open);
    }
  
    if (navToggle && mainNav) {
      navToggle.addEventListener("click", function () {
        var open = navToggle.getAttribute("aria-expanded") === "true";
        setMenu(!open);
      });
  
      mainNav.addEventListener("click", function (e) {
        if (e.target.closest("a")) setMenu(false);
      });
  
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") setMenu(false);
      });
  
      document.addEventListener("click", function (e) {
        if (!e.target.closest("#mainNav") && !e.target.closest("#navToggle")) {
          setMenu(false);
        }
      });
    }
  
    /* ---------- revelação suave ao entrar na viewport ---------- */
    var revealEls = document.querySelectorAll(".reveal");
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  
    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealEls.forEach(function (el) { el.classList.add("visible"); });
    } else {
      var revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
  
      revealEls.forEach(function (el) { revealObserver.observe(el); });
    }
  
    /* ---------- destaque do link ativo conforme a seção visível ---------- */
    var navLinks = Array.prototype.slice.call(document.querySelectorAll("[data-nav]"));
    var sections = navLinks
      .map(function (link) {
        var id = link.getAttribute("href");
        return id && id.charAt(0) === "#" ? document.querySelector(id) : null;
      })
      .filter(Boolean);
  
    function setActiveLink(id) {
      navLinks.forEach(function (link) {
        link.classList.toggle("active", link.getAttribute("href") === "#" + id);
      });
    }
  
    if ("IntersectionObserver" in window && sections.length) {
      var spyObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            setActiveLink(entry.target.id);
          }
        });
      }, { rootMargin: "-45% 0px -50% 0px" });
  
      sections.forEach(function (sec) { spyObserver.observe(sec); });
    }
  })();