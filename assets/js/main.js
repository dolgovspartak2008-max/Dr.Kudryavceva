(function () {
  "use strict";

  var CFG = window.SITE_CONFIG || {};
  var BASE = document.body.getAttribute("data-base") || "";
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Страховка заставки: если по какой-то причине она не закрылась сама — закрываем принудительно.
  setTimeout(function () {
    var d = document.documentElement;
    if (!d.classList.contains("intro-on")) return;
    if (typeof window.__introDone === "function") window.__introDone();
    setTimeout(function () {
      d.classList.remove("intro-on", "intro-leave");
      var el = document.querySelector(".intro"); if (el && el.parentNode) el.parentNode.removeChild(el);
    }, 1000);
  }, 6500);

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
  function icon(id) { return '<svg class="icon" aria-hidden="true"><use href="#' + id + '"></use></svg>'; }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  // неразрывный пробел после коротких слов — как в статичных страницах
  function nb(s) { return String(s || "").replace(/(^|[\s\u00a0(«])([а-яёА-ЯЁ]{1,2}|без|для|при|про|под|над|что|как|или) (?=\S)/g, "$1$2\u00a0").replace(/ (—|–) /g, "\u00a0$1 "); }
  function val(key) { return String(CFG[key] || "").trim(); }

  /* ---------- Данные из config.js ---------- */
  function hrefFor(key, v) {
    if (key === "phone") return "tel:" + v.replace(/[^\d+]/g, "");
    if (key === "email") return "mailto:" + v;
    if (/^https?:\/\//.test(v)) return v;
    return "";
  }
  $$("[data-cfg]").forEach(function (el) {
    var key = el.getAttribute("data-cfg");
    var mode = el.getAttribute("data-cfg-mode") || "link";
    var v = val(key);
    if (!v) { el.hidden = true; return; }
    if (mode === "link") {
      var h = hrefFor(key, v);
      if (!h) { el.hidden = true; return; }
      el.setAttribute("href", h);
      if (/^https?:/.test(h)) { el.target = "_blank"; el.rel = "noopener"; }
      if (!el.hasAttribute("data-cfg-keep-text")) $$("[data-cfg-text]", el).forEach(function (t) { t.textContent = v; });
    } else if (mode === "text") {
      el.textContent = (el.getAttribute("data-cfg-prefix") || "") + v;
    }
    $$("[data-cfg-from]", el).forEach(function (t) {
      var fv = val(t.getAttribute("data-cfg-from"));
      if (fv) t.textContent = fv;
    });
    el.hidden = false;
  });
  $$("[data-requisites]").forEach(function (box) {
    box.hidden = !["operator", "inn", "ogrn", "legalAddress"].some(function (k) { return val(k); });
  });
  // Кнопка связи в мобильной шапке: звонок, если указан телефон, иначе — запись
  $$("[data-contact-btn]").forEach(function (b) {
    if (!val("phone")) return;
    b.setAttribute("href", hrefFor("phone", val("phone")));
    b.setAttribute("aria-label", "Позвонить: " + val("phone"));
    b.innerHTML = icon("i-phone");
  });

  function contactsHtml() {
    var parts = [];
    if (val("phone")) parts.push('по телефону <a href="' + esc(hrefFor("phone", val("phone"))) + '">' + esc(val("phone")) + "</a>");
    if (val("telegram")) parts.push('в <a href="' + esc(val("telegram")) + '" target="_blank" rel="noopener">Telegram</a>');
    if (val("whatsapp")) parts.push('в <a href="' + esc(val("whatsapp")) + '" target="_blank" rel="noopener">WhatsApp</a>');
    return parts.length ? " Свяжитесь, пожалуйста, " + parts.join(", ") + "." : " Пожалуйста, попробуйте позже.";
  }

  /* ---------- Шапка и мобильная кнопка записи ---------- */
  var header = $(".site-header");
  var mcta = $(".mobile-cta");
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle("is-scrolled", y > 8);
    if (mcta) mcta.classList.toggle("is-visible", y > 560);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  // нижняя кнопка «Записаться» не нужна, когда форма записи уже на экране
  if (mcta && "IntersectionObserver" in window) {
    var formsInView = 0;
    var fio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { formsInView += en.isIntersecting ? 1 : -1; });
      mcta.classList.toggle("is-suppressed", formsInView > 0);
    });
    $$("form[data-booking]").forEach(function (f) { fio.observe(f); });
  }

  /* ---------- Мобильное меню ---------- */
  var menu = $("#mobile-menu");
  var burger = $(".burger");
  function setMenu(open) {
    if (!menu) return;
    menu.classList.toggle("is-open", open);
    menu.setAttribute("aria-hidden", open ? "false" : "true");
    if (burger) burger.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.classList.toggle("menu-open", open);
    if (open) { var f = menu.querySelector("[data-menu-close]"); if (f) f.focus(); }
    else if (burger) burger.focus();
  }
  if (burger) burger.addEventListener("click", function () { setMenu(true); });
  $$("[data-menu-close]").forEach(function (b) { b.addEventListener("click", function () { setMenu(false); }); });
  if (menu) menu.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && menu && menu.classList.contains("is-open")) setMenu(false); });
  window.addEventListener("resize", function () { if (window.innerWidth > 980 && menu && menu.classList.contains("is-open")) setMenu(false); });

  /* ---------- Появление при прокрутке ---------- */
  var io = null;
  if (!reduceMotion && "IntersectionObserver" in window) {
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -6% 0px" });
  }
  function watchReveal(root) {
    if (!io) return;
    var vh = window.innerHeight;
    $$("[data-reveal]", root).forEach(function (el) {
      if (el.classList.contains("reveal-ready")) return;
      // анимируем только то, что ниже первого экрана — первый кадр всегда полный
      if (el.getBoundingClientRect().top > vh * 0.92) { el.classList.add("reveal-ready"); io.observe(el); }
    });
  }
  watchReveal(document);

  /* ---------- Маска телефона ---------- */
  function formatPhone(v) {
    var d = v.replace(/\D/g, "");
    if (!d) return "";
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
    inp.addEventListener("input", function (e) {
      if (e.inputType && e.inputType.indexOf("delete") === 0) return; // не мешаем стирать
      inp.value = formatPhone(inp.value);
    });
  });

  /* ---------- Предвыбор услуги (?service=slug) ---------- */
  try {
    var q = new URLSearchParams(location.search).get("service");
    if (q) $$('select[name="service"]').forEach(function (s) { if (s.querySelector('option[value="' + q + '"]')) s.value = q; });
  } catch (e) { /* noop */ }

  /* ---------- Формы записи ---------- */
  $$("form[data-booking]").forEach(function (form) {
    var status = form.querySelector(".form-status");
    var btn = form.querySelector('button[type="submit"]');
    var btnHtml = btn ? btn.innerHTML : "";

    function setErr(field, msg) {
      var wrap = field.closest(".field") || field.closest(".check");
      if (!wrap) return;
      wrap.classList.toggle("has-error", !!msg);
      var e = wrap.querySelector(".field-error");
      if (e) e.textContent = msg || "";
      field.setAttribute("aria-invalid", msg ? "true" : "false");
    }
    function show(cls, html) {
      if (!status) return;
      status.hidden = false; status.className = "form-status " + cls; status.innerHTML = html;
    }
    function busy(on) {
      if (!btn) return;
      btn.disabled = on;
      btn.innerHTML = on ? "Отправляем…" : btnHtml;
    }
    // повторная правка поля убирает ошибку
    form.addEventListener("input", function (e) { if (e.target.getAttribute("aria-invalid") === "true") setErr(e.target); });
    form.addEventListener("change", function (e) { if (e.target.getAttribute("aria-invalid") === "true") setErr(e.target); });

    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var f = form.elements;
      var name = f.name.value.trim();
      var ok = true;
      if (name.length < 2 || !/[A-Za-zА-Яа-яЁё]/.test(name)) { setErr(f.name, "Укажите, как к вам обращаться"); ok = false; } else setErr(f.name);
      if (f.service && !f.service.value) { setErr(f.service, "Выберите услугу или «Не знаю»"); ok = false; } else if (f.service) setErr(f.service);
      if (f.consent && !f.consent.checked) { setErr(f.consent, "Отметьте согласие, чтобы продолжить"); ok = false; } else if (f.consent) setErr(f.consent);
      if (!ok) { var bad = form.querySelector('[aria-invalid="true"]'); if (bad) bad.focus(); return; }
      if (f.website && f.website.value) return; // бот

      var wa = val("whatsapp");
      if (!wa) { show("is-err", "Запись через WhatsApp пока недоступна." + contactsHtml()); return; }
      var service = f.service ? f.service.options[f.service.selectedIndex].text : "";
      var comment = f.comment ? f.comment.value.trim() : "";
      var text = "Здравствуйте, Анна Дмитриевна! Хочу записаться на приём.\n" +
        "Имя: " + name + (service ? "\nУслуга: " + service : "") + (comment ? "\nКомментарий: " + comment : "");

      // Ссылка-визитка wa.me/message/… не принимает текст, поэтому текст заявки копируется в буфер обмена.
      // Если указан номер (waNumber), текст подставляется в чат автоматически.
      var num = val("waNumber").replace(/\D/g, "");
      var url = num ? "https://wa.me/" + num + "?text=" + encodeURIComponent(text) : wa;
      var win = window.open(url, "_blank");
      if (win) { try { win.opener = null; } catch (e) {} } else { location.href = url; }
      var done = function (copied) {
        show("is-ok", num
          ? "Открываем WhatsApp — отправьте подготовленное сообщение, и вам ответят, чтобы подобрать время приёма."
          : (copied ? "Открываем WhatsApp. Текст заявки скопирован — вставьте его в чат и отправьте." : "Открываем WhatsApp — напишите имя и услугу, и вам ответят, чтобы подобрать время приёма.") +
            ' Если WhatsApp не открылся, <a href="' + esc(wa) + '" target="_blank" rel="noopener">нажмите сюда</a>.');
        form.reset();
      };
      if (!num && navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); });
      } else done(false);
    });
  });

  /* ---------- Клинические случаи ---------- */
  var cases = (window.CASES || []).filter(function (c) { return c && c.photos && c.photos.length; });
  function isConfirmed(c) {
    return c.order === "confirmed" && c.photos.length >= 2 &&
      c.photos[c.before != null ? c.before : 0] && c.photos[c.after != null ? c.after : 1];
  }
  function src(ph) { return /^(https?:)?\//.test(ph.src) ? ph.src : BASE + ph.src; }

  // Все фото случая видны сразу, с подписями этапов; клик — увеличение.
  function caseLabel(c, i) {
    if (c.labels && c.labels[i]) return c.labels[i];
    if (isConfirmed(c)) {
      if (i === (c.before != null ? c.before : 0)) return "До";
      if (i === (c.after != null ? c.after : 1)) return "После";
    }
    return "";
  }
  function caseCard(c) {
    var idx = cases.indexOf(c);
    var photos = c.photos.map(function (ph, i) {
      var lbl = caseLabel(c, i);
      return '<figure class="case-photo"><button type="button" data-lb="' + idx + '" data-lb-i="' + i + '" aria-label="Увеличить фото' + (lbl ? " «" + esc(lbl) + "»" : " " + (i + 1)) + ': ' + esc(c.title) + '">' +
        '<img src="' + esc(src(ph)) + '" alt="' + esc(ph.alt || c.title) + '" loading="lazy" decoding="async"></button>' +
        (lbl ? '<figcaption>' + esc(lbl) + "</figcaption>" : "") + "</figure>";
    }).join("");
    return '<article class="case-row" data-reveal>' +
      '<div class="case-info"><span class="cat">' + esc(CATEGORIES[c.category] || "") + "</span>" +
      "<h3>" + esc(nb(c.title)) + "</h3>" + (c.text ? "<p>" + esc(nb(c.text)) + "</p>" : "") + "</div>" +
      '<div class="case-photos' + (c.photos.length === 1 ? " is-single" : "") + '" style="--n:' + c.photos.length +
      (c.ratio && /^[\d.\s\/]+$/.test(c.ratio) ? ";--ratio:" + c.ratio : "") + '">' + photos + "</div></article>";
  }

  function renderCases(root) {
    var limit = parseInt(root.getAttribute("data-limit") || "0", 10);
    var cat = root.getAttribute("data-category") || "all";
    var list = cases.filter(function (c) { return cat === "all" || c.category === cat; });
    if (limit) list = list.slice(0, limit);
    if (!list.length) {
      root.innerHTML = '<div class="cases-empty" style="grid-column:1/-1">' + icon("i-images") +
        "<h3>" + (cases.length ? "В этой категории пока нет случаев" : "Фотографии клинических случаев скоро появятся") + "</h3>" +
        "<p>" + (cases.length ? "Выберите другую категорию." : "Пока раздел пополняется, запишитесь на консультацию — доктор покажет примеры похожих случаев и расскажет о вариантах лечения.") + "</p>" +
        (cases.length ? "" : '<a class="btn btn--primary" href="' + BASE + 'contacts.html#zapis">' + icon("i-calendar") + "Записаться на приём</a>") + "</div>";
      return;
    }
    root.innerHTML = list.map(caseCard).join("");
    watchReveal(root);
  }

  // Главная: блок показывается, только если есть реальные случаи
  var homeSection = $("[data-cases-section]");
  if (homeSection) homeSection.hidden = !cases.length;

  var casesRoot = $("[data-cases]");
  if (casesRoot && (cases.length || !homeSection)) {
    var filters = $("[data-case-filters]");
    var note = $("[data-cases-note]");
    if (note) note.hidden = !cases.length;
    if (filters && cases.length) {
      var counts = { all: cases.length };
      cases.forEach(function (c) { counts[c.category] = (counts[c.category] || 0) + 1; });
      var keys = ["all"].concat(Object.keys(CATEGORIES).filter(function (k) { return counts[k]; }));
      filters.innerHTML = keys.map(function (k) {
        return '<button type="button" class="chip" data-cat="' + k + '" aria-pressed="' + (k === "all") + '">' +
          (k === "all" ? "Все работы" : CATEGORIES[k]) + ' <span class="count">' + (counts[k] || 0) + "</span></button>";
      }).join("");
      filters.hidden = keys.length < 3; // фильтр нужен, если категорий больше одной
      filters.addEventListener("click", function (e) {
        var b = e.target.closest(".chip"); if (!b) return;
        $$(".chip", filters).forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
        casesRoot.setAttribute("data-category", b.getAttribute("data-cat"));
        renderCases(casesRoot);
      });
      var hash = (location.hash || "").replace("#", "");
      var hb = CATEGORIES[hash] && filters.querySelector('[data-cat="' + hash + '"]');
      if (hb) { hb.setAttribute("aria-pressed", "true"); filters.querySelector('[data-cat="all"]').setAttribute("aria-pressed", "false"); casesRoot.setAttribute("data-category", hash); }
    }
    renderCases(casesRoot);
  }

  // Кнопки карусели
  $$("[data-carousel]").forEach(function (b) {
    b.addEventListener("click", function () {
      var track = b.closest("section").querySelector(".is-carousel");
      if (!track) return;
      var card = track.querySelector(".case-card");
      var step = card ? card.getBoundingClientRect().width + 12 : track.clientWidth * 0.8;
      track.scrollBy({ left: b.getAttribute("data-carousel") === "next" ? step : -step, behavior: reduceMotion ? "auto" : "smooth" });
    });
  });

  /* ---------- Галерея (лайтбокс) ---------- */
  var lightbox = null, lbList = [], lbIndex = 0, lbTitle = "", lbReturn = null;
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
    var sx = null, stage = el.querySelector(".lightbox-stage");
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
  function showLb(i) {
    if (!lbList.length) return;
    lbIndex = (i + lbList.length) % lbList.length;
    var ph = lbList[lbIndex], img = lightbox.querySelector("img");
    img.src = src(ph); img.alt = ph.alt || lbTitle;
    lightbox.querySelector(".lb-title").textContent = [ph.title || lbTitle, ph.label].filter(Boolean).join(" · ");
    lightbox.querySelector(".lb-count").textContent = (lbIndex + 1) + " / " + lbList.length;
    var multi = lbList.length > 1;
    lightbox.querySelector(".lb-prev").hidden = !multi;
    lightbox.querySelector(".lb-next").hidden = !multi;
  }
  function closeLb() {
    lightbox.hidden = true; document.body.classList.remove("menu-open");
    if (lbReturn) lbReturn.focus();
  }
  // Дипломы и сертификаты: все документы листаются подряд, у многостраничных — номер страницы.
  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-doc]"); if (!t) return;
    if (!lightbox) lightbox = buildLightbox();
    lbReturn = t; lbTitle = ""; lbList = []; var start = 0;
    $$("[data-doc]").forEach(function (d) {
      var pages = d.getAttribute("data-pages").split("|"), title = d.getAttribute("data-title");
      if (d === t) start = lbList.length;
      pages.forEach(function (pg, i) {
        lbList.push({ src: pg, alt: title, title: title, label: pages.length > 1 ? "стр. " + (i + 1) + " из " + pages.length : "" });
      });
    });
    lightbox.setAttribute("aria-label", "Просмотр документов");
    lightbox.hidden = false; document.body.classList.add("menu-open");
    showLb(start);
    lightbox.querySelector(".lb-close").focus();
  });

  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-lb]"); if (!t) return;
    var c = cases[parseInt(t.getAttribute("data-lb"), 10)]; if (!c) return;
    if (!lightbox) lightbox = buildLightbox();
    lbReturn = t; lbTitle = c.title; lightbox.setAttribute("aria-label", "Просмотр фотографий");
    var conf = isConfirmed(c);
    var bi = c.before != null ? c.before : 0, ai = c.after != null ? c.after : 1;
    lbList = c.photos.map(function (p, i) {
      var lbl = c.labels && c.labels[i] ? c.labels[i] : (conf ? (i === bi ? "До" : i === ai ? "После" : "") : "");
      return { src: p.src, alt: p.alt, label: caseLabel(c, i) };
    });
    lightbox.hidden = false; document.body.classList.add("menu-open");
    showLb(parseInt(t.getAttribute("data-lb-i") || "0", 10));
    lightbox.querySelector(".lb-close").focus();
  });

  $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
