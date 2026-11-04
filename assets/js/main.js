(function () {
  "use strict";

  var CFG = window.SITE_CONFIG || {};
  var BASE = document.body.getAttribute("data-base") || "";
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var CATEGORIES = {
    "restavraciya": "Эстетическая реставрация",
    "perelechivanie": "Перелечивание каналов",
    "protezirovanie": "Протезирование",
    "implantaciya": "Имплантация",
    "kostnaya-plastika": "Костная пластика",
    "udalenie": "Удаление зубов мудрости"
  };

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function icon(id, cls) {
    return '<svg class="icon ' + (cls || "") + '" aria-hidden="true"><use href="#' + id + '"></use></svg>';
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ---------- Контакты из config.js ---------- */
  function hrefFor(key, val) {
    if (key === "phone") return "tel:" + val.replace(/[^\d+]/g, "");
    if (key === "email") return "mailto:" + val;
    if (/^https?:\/\//.test(val)) return val;
    return "";
  }
  $$("[data-cfg]").forEach(function (el) {
    var key = el.getAttribute("data-cfg");
    var mode = el.getAttribute("data-cfg-mode") || "link";
    var val = (CFG[key] || "").trim();
    if (mode === "link") {
      if (!val) { el.hidden = true; return; }
      var h = hrefFor(key, val);
      if (h) el.setAttribute("href", h);
      if (/^https?:/.test(h)) { el.target = "_blank"; el.rel = "noopener"; }
      var t = el.querySelector("[data-cfg-text]");
      if (t) t.textContent = key === "phone" || key === "email" ? val : t.textContent;
      el.hidden = false;
    } else if (mode === "value") {
      if (!val) { el.classList.add("is-empty"); return; }
      var href = hrefFor(key, val);
      var label = el.getAttribute("data-cfg-label") || val;
      if (key === "phone" || key === "email") label = val;
      el.classList.remove("is-empty");
      el.innerHTML = href
        ? '<a href="' + esc(href) + '"' + (/^https?:/.test(href) ? ' target="_blank" rel="noopener"' : "") + ">" + esc(label) + "</a>"
        : esc(val);
    } else if (mode === "show") {
      el.hidden = !val;
    }
  });

  /* ---------- Шапка ---------- */
  var header = $(".site-header");
  var mcta = $(".mobile-cta");
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle("is-scrolled", y > 8);
    if (mcta) mcta.classList.toggle("is-visible", y > 520);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Мобильное меню ---------- */
  var menu = $("#mobile-menu");
  var burger = $(".burger");
  function setMenu(open) {
    if (!menu) return;
    menu.classList.toggle("is-open", open);
    menu.setAttribute("aria-hidden", open ? "false" : "true");
    if (burger) burger.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.classList.toggle("menu-open", open);
    if (open) { var f = menu.querySelector("a, button"); if (f) f.focus(); }
    else if (burger) burger.focus();
  }
  if (burger) burger.addEventListener("click", function () { setMenu(true); });
  $$("[data-menu-close]").forEach(function (b) { b.addEventListener("click", function () { setMenu(false); }); });
  if (menu) menu.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && menu && menu.classList.contains("is-open")) setMenu(false); });

  /* ---------- Появление блоков при прокрутке ---------- */
  if (!reduceMotion && "IntersectionObserver" in window) {
    var vh = window.innerHeight;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    $$("[data-reveal]").forEach(function (el) {
      // анимируем только то, что ниже первого экрана — первый кадр всегда полный
      if (el.getBoundingClientRect().top > vh * 0.95) {
        el.classList.add("reveal-ready");
        io.observe(el);
      }
    });
  }

  /* ---------- Маска телефона ---------- */
  function formatPhone(v) {
    var d = v.replace(/\D/g, "");
    if (d.charAt(0) === "8") d = "7" + d.slice(1);
    if (d.charAt(0) !== "7") d = "7" + d;
    d = d.slice(0, 11);
    var r = "+7";
    if (d.length > 1) r += " (" + d.slice(1, 4);
    if (d.length >= 4) r += ")";
    if (d.length > 4) r += " " + d.slice(4, 7);
    if (d.length > 7) r += "-" + d.slice(7, 9);
    if (d.length > 9) r += "-" + d.slice(9, 11);
    return r;
  }
  $$('input[type="tel"]').forEach(function (inp) {
    inp.addEventListener("focus", function () { if (!inp.value) inp.value = "+7 ("; });
    inp.addEventListener("blur", function () { if (inp.value.replace(/\D/g, "").length <= 1) inp.value = ""; });
    inp.addEventListener("input", function () {
      var pos = inp.value.length;
      inp.value = formatPhone(inp.value);
      if (pos >= inp.value.length) inp.setSelectionRange(inp.value.length, inp.value.length);
    });
  });

  /* ---------- Предвыбор услуги (?service=slug) ---------- */
  try {
    var q = new URLSearchParams(location.search).get("service");
    if (q) $$('select[name="service"]').forEach(function (s) {
      if (s.querySelector('option[value="' + q + '"]')) s.value = q;
    });
  } catch (e) { /* noop */ }

  /* ---------- Формы записи ---------- */
  $$("form[data-booking]").forEach(function (form) {
    var status = form.querySelector(".form-status");
    function setErr(field, msg) {
      var wrap = field.closest(".field") || field.closest(".check");
      if (!wrap) return;
      wrap.classList.toggle("has-error", !!msg);
      var e = wrap.querySelector(".field-error");
      if (e) e.textContent = msg || "";
      field.setAttribute("aria-invalid", msg ? "true" : "false");
    }
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var name = form.elements.name, phone = form.elements.phone, consent = form.elements.consent;
      var ok = true;
      if (!name.value.trim() || name.value.trim().length < 2) { setErr(name, "Укажите, как к вам обращаться"); ok = false; } else setErr(name);
      if (phone.value.replace(/\D/g, "").length !== 11) { setErr(phone, "Введите номер полностью: +7 и 10 цифр"); ok = false; } else setErr(phone);
      if (consent && !consent.checked) { setErr(consent, "Нужно согласие на обработку данных"); ok = false; } else if (consent) setErr(consent);
      if (!ok) { var bad = form.querySelector('[aria-invalid="true"]'); if (bad) bad.focus(); return; }

      var service = form.elements.service;
      var payload = {
        name: name.value.trim(),
        phone: phone.value,
        service: service ? service.options[service.selectedIndex].text : "",
        comment: form.elements.comment ? form.elements.comment.value.trim() : "",
        page: location.pathname
      };
      var btn = form.querySelector('button[type="submit"]');
      function done(cls, text) {
        if (status) { status.hidden = false; status.className = "form-status " + cls; status.textContent = text; }
        if (btn) btn.disabled = false;
      }
      if (btn) btn.disabled = true;

      if (!CFG.formEndpoint) {
        setTimeout(function () {
          done("is-ok", "Спасибо, " + payload.name + "! Заявка заполнена верно. Онлайн-отправка пока не подключена — сайт работает в демонстрационном режиме.");
          form.reset();
        }, 400);
        return;
      }
      fetch(CFG.formEndpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
        .then(function (r) {
          if (!r.ok) throw new Error(r.status);
          done("is-ok", "Спасибо, " + payload.name + "! Заявка отправлена. Мы свяжемся с вами, чтобы подобрать время приёма.");
          form.reset();
        })
        .catch(function () {
          done("is-err", "Не удалось отправить заявку. Проверьте подключение к интернету и попробуйте ещё раз" + (CFG.phone ? " или позвоните: " + CFG.phone : "") + ".");
        });
    });
  });

  /* ---------- Клинические случаи ---------- */
  var cases = (window.CASES || []).filter(function (c) { return c && c.photos && c.photos.length; });
  var lightbox = null, lbList = [], lbIndex = 0, lbTitle = "";

  function caseMedia(c, idx) {
    var p = c.photos;
    if (c.order === "confirmed" && p.length >= 2) {
      return '<div class="ba" style="--pos:50%">' +
        '<img src="' + esc(BASE + p[0].src) + '" alt="' + esc(p[0].alt || "До лечения") + '" loading="lazy" decoding="async">' +
        '<img class="ba-after" src="' + esc(BASE + p[1].src) + '" alt="' + esc(p[1].alt || "После лечения") + '" loading="lazy" decoding="async">' +
        '<span class="ba-handle"></span>' +
        '<span class="badge badge--before">До</span><span class="badge badge--after">После</span>' +
        '<input type="range" min="0" max="100" value="50" aria-label="Сравнение до и после: ' + esc(c.title) + '">' +
        "</div>";
    }
    var pair = p.slice(0, 2).map(function (ph, i) {
      return '<button type="button" data-lb="' + idx + '" data-lb-i="' + i + '" aria-label="Открыть фото ' + (i + 1) + '">' +
        '<img src="' + esc(BASE + ph.src) + '" alt="' + esc(ph.alt || c.title) + '" loading="lazy" decoding="async"></button>';
    }).join("");
    var warn = (c.order !== "confirmed" && p.length >= 2) ? '<span class="badge badge--warn">Порядок «до/после» уточняется</span>' : "";
    return '<div class="case-pair"' + (p.length === 1 ? ' style="grid-template-columns:1fr"' : "") + ">" + pair + "</div>" + warn;
  }

  function renderCases(root) {
    var limit = parseInt(root.getAttribute("data-limit") || "0", 10);
    var cat = root.getAttribute("data-category") || "all";
    var list = cases.filter(function (c) { return cat === "all" || c.category === cat; });
    if (limit) list = list.slice(0, limit);
    if (!list.length) {
      root.innerHTML = '<div class="empty-state">' + icon("i-images") +
        "<h3>" + (cases.length ? "В этой категории пока нет случаев" : "Клинические случаи готовятся к публикации") + "</h3>" +
        "<p>" + (cases.length
          ? "Выберите другую категорию или вернитесь ко всем работам."
          : "Здесь появятся реальные фотографии работ доктора Кудрявцевой — после того как доктор отберёт снимки и подтвердит порядок «до/после».") +
        "</p></div>";
      return;
    }
    root.innerHTML = list.map(function (c) {
      var idx = cases.indexOf(c);
      return '<article class="case-card">' +
        '<div class="case-media">' + caseMedia(c, idx) + "</div>" +
        '<div class="case-info"><span class="cat">' + esc(CATEGORIES[c.category] || "") + "</span>" +
        "<h3>" + esc(c.title) + "</h3>" + (c.text ? "<p>" + esc(c.text) + "</p>" : "") + "</div>" +
        '<button type="button" class="link-arrow case-open" data-lb="' + idx + '" data-lb-i="0">Смотреть фото' + icon("i-arrow") + "</button>" +
        "</article>";
    }).join("");
    $$(".ba input", root).forEach(function (r) {
      r.addEventListener("input", function () { r.parentNode.style.setProperty("--pos", r.value + "%"); });
    });
  }

  var casesRoot = $("[data-cases]");
  if (casesRoot) {
    var filters = $("[data-case-filters]");
    if (filters) {
      var counts = { all: cases.length };
      cases.forEach(function (c) { counts[c.category] = (counts[c.category] || 0) + 1; });
      var keys = ["all"].concat(Object.keys(CATEGORIES));
      filters.innerHTML = keys.map(function (k) {
        return '<button type="button" class="chip" data-cat="' + k + '" aria-pressed="' + (k === "all") + '">' +
          (k === "all" ? "Все работы" : CATEGORIES[k]) + ' <span class="count">' + (counts[k] || 0) + "</span></button>";
      }).join("");
      filters.addEventListener("click", function (e) {
        var b = e.target.closest(".chip"); if (!b) return;
        $$(".chip", filters).forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
        casesRoot.setAttribute("data-category", b.getAttribute("data-cat"));
        renderCases(casesRoot);
      });
      var hash = (location.hash || "").replace("#", "");
      if (CATEGORIES[hash]) {
        var hb = filters.querySelector('[data-cat="' + hash + '"]');
        if (hb) hb.click();
      }
    }
    renderCases(casesRoot);
  }

  /* ---------- Просмотр фото (лайтбокс) ---------- */
  function buildLightbox() {
    var el = document.createElement("div");
    el.className = "lightbox"; el.hidden = true;
    el.setAttribute("role", "dialog"); el.setAttribute("aria-modal", "true"); el.setAttribute("aria-label", "Просмотр фотографий");
    el.innerHTML = '<div class="lightbox-top"><p class="lb-title"></p><button type="button" class="lb-btn lb-close" aria-label="Закрыть">' + icon("i-close") + "</button></div>" +
      '<div class="lightbox-stage"><img alt=""></div>' +
      '<div class="lightbox-bottom"><button type="button" class="lb-btn lb-prev" aria-label="Предыдущее фото">' + icon("i-chev-left") + '</button><span class="lb-count"></span><button type="button" class="lb-btn lb-next" aria-label="Следующее фото">' + icon("i-chev-right") + "</button></div>";
    document.body.appendChild(el);
    el.querySelector(".lb-close").addEventListener("click", closeLb);
    el.querySelector(".lb-prev").addEventListener("click", function () { showLb(lbIndex - 1); });
    el.querySelector(".lb-next").addEventListener("click", function () { showLb(lbIndex + 1); });
    el.addEventListener("click", function (e) { if (e.target === el || e.target.classList.contains("lightbox-stage")) closeLb(); });
    var sx = null;
    var stage = el.querySelector(".lightbox-stage");
    stage.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; }, { passive: true });
    stage.addEventListener("touchend", function (e) {
      if (sx === null) return;
      var dx = e.changedTouches[0].clientX - sx; sx = null;
      if (Math.abs(dx) > 40) showLb(lbIndex + (dx < 0 ? 1 : -1));
    });
    document.addEventListener("keydown", function (e) {
      if (el.hidden) return;
      if (e.key === "Escape") closeLb();
      if (e.key === "ArrowRight") showLb(lbIndex + 1);
      if (e.key === "ArrowLeft") showLb(lbIndex - 1);
    });
    return el;
  }
  var lbReturn = null;
  function showLb(i) {
    if (!lbList.length) return;
    lbIndex = (i + lbList.length) % lbList.length;
    var ph = lbList[lbIndex];
    var img = lightbox.querySelector("img");
    img.src = BASE + ph.src; img.alt = ph.alt || lbTitle;
    lightbox.querySelector(".lb-title").textContent = lbTitle + (ph.label ? " · " + ph.label : "");
    lightbox.querySelector(".lb-count").textContent = (lbIndex + 1) + " / " + lbList.length;
    var multi = lbList.length > 1;
    lightbox.querySelector(".lb-prev").hidden = !multi;
    lightbox.querySelector(".lb-next").hidden = !multi;
  }
  function closeLb() {
    lightbox.hidden = true; document.body.classList.remove("menu-open");
    if (lbReturn) lbReturn.focus();
  }
  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-lb]"); if (!t) return;
    var c = cases[parseInt(t.getAttribute("data-lb"), 10)]; if (!c) return;
    if (!lightbox) lightbox = buildLightbox();
    lbReturn = t;
    lbTitle = c.title;
    lbList = c.photos.map(function (p, i) {
      var label = c.order === "confirmed" && c.photos.length >= 2 ? (i === 0 ? "До" : i === 1 ? "После" : "") : "";
      return { src: p.src, alt: p.alt, label: label };
    });
    lightbox.hidden = false; document.body.classList.add("menu-open");
    showLb(parseInt(t.getAttribute("data-lb-i") || "0", 10));
    lightbox.querySelector(".lb-close").focus();
  });

  /* ---------- Год в подвале ---------- */
  $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
