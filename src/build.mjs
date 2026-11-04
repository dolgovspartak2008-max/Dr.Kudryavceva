// Сборка статических страниц: node src/build.mjs
// Шапка, подвал, иконки и форма записи общие для всех страниц.
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { SPECS, PERKS, STEPS, SERVICES } from "./content.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

// Адрес сайта после публикации (например "https://doctor-kudryavtseva.ru").
// Пока пусто — canonical-ссылки и sitemap.xml не создаются.
const SITE_URL = "";

const SITE = "Доктор Кудрявцева";
const VER = "1";

/* ---------------- Иконки ---------------- */
const TOOTH = "M7.5 3C5 3 3.5 5 3.5 7.6c0 2.3 1 3.7 1.5 5.6.6 2.4.6 7.8 2.6 7.8 1.6 0 1.6-3.3 2.1-5 .4-1.4.9-2.3 2.3-2.3s1.9.9 2.3 2.3c.5 1.7.5 5 2.1 5 2 0 2-5.4 2.6-7.8.5-1.9 1.5-3.3 1.5-5.6C20.5 5 19 3 16.5 3c-2 0-3 1-4.5 1S9.5 3 7.5 3z";
const ICONS = {
  "i-tooth": `<path d="${TOOTH}"/>`,
  "i-sparkle-tooth": `<g transform="translate(0 2) scale(.86)"><path d="${TOOTH}"/></g><path d="M19.5 1.5v4M17.5 3.5h4"/><path d="M7 7.5c.8-.9 1.8-1.2 3-.9"/>`,
  "i-root": `<path d="${TOOTH}"/><path d="M10 9.5v7M14 9.5v7"/><circle cx="12" cy="7.2" r=".6"/>`,
  "i-crown": `<path d="M5 10 6.5 4.5l3.2 2.7L12 3.5l2.3 3.7 3.2-2.7L19 10z"/><path d="M5.5 12.5c0 3.6.9 8.5 2.8 8.5 1.6 0 1.6-3.2 3.7-3.2s2.1 3.2 3.7 3.2c1.9 0 2.8-4.9 2.8-8.5"/>`,
  "i-implant": `<path d="M7.5 2.5h9a2 2 0 0 1 2 2v.8a3.2 3.2 0 0 1-3.2 3.2H8.7a3.2 3.2 0 0 1-3.2-3.2v-.8a2 2 0 0 1 2-2z"/><path d="M10 8.5v2h4v-2"/><path d="M9.6 10.5h4.8l-1 11h-2.8z"/><path d="M8.6 13h6.8M9 15.8h6M9.4 18.6h5.2"/>`,
  "i-bone": `<circle cx="6" cy="8.4" r="2.3"/><circle cx="8.4" cy="6" r="2.3"/><circle cx="15.6" cy="18" r="2.3"/><circle cx="18" cy="15.6" r="2.3"/><path d="M7.4 10.1l6.5 6.5M10.1 7.4l6.5 6.5"/>`,
  "i-extract": `<g transform="translate(0 3.5) scale(.82)"><path d="${TOOTH}"/></g><path d="M19.5 10V2.5M17 5l2.5-2.5L22 5"/>`,
  "i-microscope": `<path d="M6 18h8"/><path d="M3 22h18"/><path d="M14 22a7 7 0 1 0 0-14h-1"/><path d="M9 14h2"/><path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2z"/><path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3"/>`,
  "i-shield": `<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>`,
  "i-diamond": `<path d="M6 3h12l4 6-10 13L2 9z"/><path d="M11 3 8 9l4 13 4-13-3-6"/><path d="M2 9h20"/>`,
  "i-arrow": `<path d="M5 12h14M13 6l6 6-6 6"/>`,
  "i-phone": `<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.9.7 2.8a2 2 0 0 1-.4 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.9.6 2.8.7a2 2 0 0 1 1.7 2z"/>`,
  "i-pin": `<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>`,
  "i-clock": `<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>`,
  "i-chat": `<path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8z"/>`,
  "i-send": `<path d="M22 2 11 13"/><path d="M22 2l-7 20-4-9-9-4z"/>`,
  "i-mail": `<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>`,
  "i-calendar": `<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>`,
  "i-check": `<path d="M20 6 9 17l-5-5"/>`,
  "i-user": `<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>`,
  "i-close": `<path d="M18 6 6 18M6 6l12 12"/>`,
  "i-menu": `<path d="M4 7h16M4 12h16M4 17h10"/>`,
  "i-chev-left": `<path d="m15 18-6-6 6-6"/>`,
  "i-chev-right": `<path d="m9 18 6-6-6-6"/>`,
  "i-cap": `<path d="M22 10 12 5 2 10l10 5z"/><path d="M6 12v5c3 2 9 2 12 0v-5"/><path d="M22 10v6"/>`,
  "i-doc": `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h5"/>`,
  "i-briefcase": `<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2M2 13h20"/>`,
  "i-award": `<circle cx="12" cy="8" r="6"/><path d="M8.2 13.2 7 22l5-3 5 3-1.2-8.8"/>`,
  "i-images": `<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/>`,
  "i-eye": `<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>`,
  "i-sun": `<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>`,
  "i-target": `<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>`,
  "i-pen": `<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>`,
  "i-info": `<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>`,
};
const sprite = `<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>${Object.entries(ICONS)
  .map(([id, p]) => `<symbol id="${id}" viewBox="0 0 24 24">${p}</symbol>`).join("")}</defs></svg>`;
const ic = (id, cls = "") => `<svg class="icon ${cls}" aria-hidden="true"><use href="#${id}"></use></svg>`;

const FAVICON = "data:image/svg+xml," + encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" rx="6" fill="#fbf7f1"/><path d="${TOOTH}" fill="none" stroke="#a87842" stroke-width="1.6" stroke-linejoin="round"/></svg>`);

/* ---------------- Общие блоки ---------------- */
const NAV = [
  { href: "index", label: "Главная", key: "home" },
  { href: "services.html", label: "Услуги", key: "services" },
  { href: "about.html", label: "О докторе", key: "about" },
  { href: "cases.html", label: "Примеры работ", key: "cases" },
  { href: "contacts.html", label: "Контакты", key: "contacts" },
];

function link(p, href) { return href === "index" ? (p || "./") : p + href; }

function portrait(p, { sizes = "(max-width: 860px) 88vw, 480px", eager = false, alt = "Анна Дмитриевна Кудрявцева, стоматолог, в белом медицинском халате" } = {}) {
  return `<picture>
      <source type="image/webp" srcset="${p}assets/img/kudryavtseva-520.webp 520w, ${p}assets/img/kudryavtseva-860.webp 860w, ${p}assets/img/kudryavtseva-1086.webp 1086w" sizes="${sizes}">
      <img src="${p}assets/img/kudryavtseva-860.jpg" width="860" height="1147" alt="${alt}" ${eager ? 'fetchpriority="high" decoding="async"' : 'loading="lazy" decoding="async"'}>
    </picture>`;
}

function header(p, active) {
  const items = NAV.map((n) => `<li><a href="${link(p, n.href)}"${n.key === active ? ' aria-current="page"' : ""}>${n.label}</a></li>`).join("");
  const mItems = NAV.map((n) => `<li><a href="${link(p, n.href)}"${n.key === active ? ' aria-current="page"' : ""}>${n.label}${ic("i-arrow")}</a></li>`).join("");
  return `<a class="skip-link" href="#main">Перейти к содержанию</a>
<header class="site-header">
  <div class="container header-inner">
    <a class="logo" href="${link(p, "index")}" aria-label="${SITE} — на главную">${ic("i-tooth")}<span class="logo-text"><span>Доктор</span><span>Кудрявцева</span></span></a>
    <nav class="main-nav" aria-label="Основное меню"><ul>${items}</ul></nav>
    <a class="header-phone" data-cfg="phone" href="#" hidden>${ic("i-phone")}<span data-cfg-text></span></a>
    <a class="btn btn--primary btn--sm header-cta" href="${p}contacts.html#zapis">Записаться на приём</a>
    <button class="burger" type="button" aria-label="Открыть меню" aria-expanded="false" aria-controls="mobile-menu">${ic("i-menu")}</button>
  </div>
</header>
<div class="mobile-menu" id="mobile-menu" aria-hidden="true">
  <div class="mobile-menu-top">
    <a class="logo" href="${link(p, "index")}">${ic("i-tooth")}<span class="logo-text"><span>Доктор</span><span>Кудрявцева</span></span></a>
    <button class="burger" style="display:inline-flex" type="button" aria-label="Закрыть меню" data-menu-close>${ic("i-close")}</button>
  </div>
  <nav aria-label="Мобильное меню"><ul>${mItems}</ul></nav>
  <div class="mobile-menu-foot">
    <a class="btn btn--ghost" data-cfg="phone" href="#" hidden>${ic("i-phone")}<span data-cfg-text></span></a>
    <a class="btn btn--primary" href="${p}contacts.html#zapis">${ic("i-calendar")}Записаться на приём</a>
  </div>
</div>`;
}

function footer(p) {
  return `<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-col">
        <a class="logo" href="${link(p, "index")}">${ic("i-tooth")}<span class="logo-text"><span>Доктор</span><span>Кудрявцева</span></span></a>
        <p class="muted">Анна Дмитриевна Кудрявцева — стоматолог-эндодонтист-микроскопист, ортопед, хирург-имплантолог.</p>
        <ul>
          <li><a data-cfg="phone" href="#" hidden><span data-cfg-text></span></a></li>
          <li><a data-cfg="telegram" href="#" hidden>Telegram</a></li>
          <li><a data-cfg="whatsapp" href="#" hidden>WhatsApp</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h2>Разделы</h2>
        <ul>${NAV.map((n) => `<li><a href="${link(p, n.href)}">${n.label}</a></li>`).join("")}</ul>
      </div>
      <div class="footer-col">
        <h2>Услуги</h2>
        <ul>${SERVICES.map((s) => `<li><a href="${p}services/${s.slug}.html">${s.title}</a></li>`).join("")}</ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© <span data-year>2026</span> ${SITE}. <a href="${p}privacy.html">Политика обработки персональных данных</a></span>
      <span>Имеются противопоказания. Необходима консультация специалиста.</span>
    </div>
  </div>
</footer>
<div class="mobile-cta">
  <a class="btn btn--ghost" data-cfg="phone" href="#" hidden aria-label="Позвонить">${ic("i-phone")}Позвонить</a>
  <a class="btn btn--primary" href="${p}contacts.html#zapis">${ic("i-calendar")}Записаться</a>
</div>`;
}

function serviceOptions(selected = "") {
  return `<option value="">Выберите направление</option>
      <option value="konsultaciya"${selected === "konsultaciya" ? " selected" : ""}>Консультация и диагностика</option>
      ${SERVICES.map((s) => `<option value="${s.slug}"${s.slug === selected ? " selected" : ""}>${s.title}</option>`).join("")}
      <option value="ne-znayu">Не знаю, нужна консультация</option>`;
}

function bookingForm(p, id, { dark = false, selected = "", comment = false } = {}) {
  return `<form class="form${dark ? " form--dark" : ""}" data-booking novalidate>
    <div class="form-row">
      <div class="field">
        <label for="${id}-name">Ваше имя</label>
        <div class="input-wrap">${ic("i-user")}<input id="${id}-name" name="name" type="text" autocomplete="name" placeholder="Как к вам обращаться" required></div>
        <span class="field-error" aria-live="polite"></span>
      </div>
      <div class="field">
        <label for="${id}-phone">Телефон</label>
        <div class="input-wrap">${ic("i-phone")}<input id="${id}-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="+7 (___) ___-__-__" required></div>
        <span class="field-error" aria-live="polite"></span>
      </div>
    </div>
    <div class="field">
      <label for="${id}-service">Услуга</label>
      <div class="input-wrap">${ic("i-tooth")}<select id="${id}-service" name="service">${serviceOptions(selected)}</select></div>
    </div>
    ${comment ? `<div class="field">
      <label for="${id}-comment">Комментарий <span class="muted">(необязательно)</span></label>
      <textarea id="${id}-comment" name="comment" rows="3" placeholder="Что беспокоит, удобное время для звонка"></textarea>
    </div>` : ""}
    <label class="check"><input id="${id}-consent" type="checkbox" name="consent" required><span>Согласен(а) на <a href="${p}privacy.html">обработку персональных данных</a><span class="field-error"></span></span></label>
    <div><button class="btn btn--primary" type="submit">Записаться ${ic("i-arrow")}</button></div>
    <p class="form-status" role="status" hidden></p>
  </form>`;
}

function bookingBand(p, id, selected = "") {
  return `<section class="booking" aria-labelledby="${id}-title">
  <div class="container">
    <div class="booking-card" data-reveal>
      <div class="booking-intro">
        <span class="eyebrow" style="color:var(--gold-light)">Запись</span>
        <h2 id="${id}-title">Запишитесь на приём</h2>
        <p>Оставьте имя и телефон — с вами свяжутся, чтобы подобрать удобное время консультации.</p>
      </div>
      ${bookingForm(p, id, { dark: true, selected })}
    </div>
  </div>
</section>`;
}

function serviceCard(p, s) {
  return `<a class="service-card" href="${p}services/${s.slug}.html">
      <span class="service-art">${ic(s.icon)}</span>
      <span class="service-body"><h3>${s.title}</h3><p>${s.short}</p></span>
      <span class="go">${ic("i-arrow")}</span>
    </a>`;
}

function stepsList() {
  return `<ol class="steps">${STEPS.map((s, i) => `<li class="step" data-reveal><span class="step-num">0${i + 1}</span><h3>${s.t}</h3><p>${s.d}</p></li>`).join("")}</ol>`;
}

function crumbs(p, items) {
  const all = [{ href: link(p, "index"), label: "Главная" }, ...items];
  return `<nav class="breadcrumbs" aria-label="Хлебные крошки"><ol>${all.map((c, i) =>
    i === all.length - 1 ? `<li aria-current="page">${c.label}</li>` : `<li><a href="${c.href}">${c.label}</a></li>`).join("")}</ol></nav>`;
}

function todo(text) { return `<div class="todo">${ic("i-pen")}<span>${text}</span></div>`; }

/* ---------------- Обёртка страницы ---------------- */
function page({ path, title, description, active, body, jsonld = "", cases = false }) {
  const depth = path.split("/").length - 1;
  const p = depth ? "../".repeat(depth) : "";
  const fullTitle = title === SITE ? `${SITE} — стоматолог-эндодонтист, ортопед, имплантолог` : `${title} — ${SITE}`;
  const canon = SITE_URL ? `<link rel="canonical" href="${SITE_URL}/${path === "index.html" ? "" : path}">` : "";
  const ogImg = SITE_URL ? `<meta property="og:image" content="${SITE_URL}/assets/img/kudryavtseva-860.jpg">` : "";
  return `<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${fullTitle}</title>
<meta name="claude:viewport-fit-sides" content="cover">
<meta name="description" content="${description}">
<meta name="theme-color" content="#fbf7f1">
${canon}
<meta property="og:type" content="website">
<meta property="og:locale" content="ru_RU">
<meta property="og:site_name" content="${SITE}">
<meta property="og:title" content="${fullTitle}">
<meta property="og:description" content="${description}">
${ogImg}
<link rel="icon" href="${FAVICON}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Manrope:wght@400;500;600;700&display=swap">
<link rel="stylesheet" href="${p}assets/css/style.css?v=${VER}">
${jsonld}
</head>
<body data-base="${p}">
${sprite}
${header(p, active)}
<main id="main">
${body(p)}
</main>
${footer(p)}
<script src="${p}assets/js/config.js?v=${VER}"></script>
${cases ? `<script src="${p}assets/js/cases.js?v=${VER}"></script>` : ""}
<script src="${p}assets/js/main.js?v=${VER}"></script>
</body>
</html>
`;
}

const pages = [];

/* ---------------- Главная ---------------- */
pages.push({
  path: "index.html",
  title: SITE,
  active: "home",
  cases: true,
  description: "Анна Дмитриевна Кудрявцева — стоматолог-эндодонтист-микроскопист, ортопед, хирург-имплантолог. Лечение под микроскопом, эстетическая реставрация, протезирование, имплантация. Запись на приём.",
  jsonld: `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Dentist",
    name: SITE,
    description: "Стоматологическая практика Анны Дмитриевны Кудрявцевой: эндодонтия под микроскопом, эстетическая реставрация, протезирование, имплантация.",
    ...(SITE_URL ? { url: SITE_URL, image: SITE_URL + "/assets/img/kudryavtseva-860.jpg" } : {}),
    employee: { "@type": "Person", name: "Анна Дмитриевна Кудрявцева", jobTitle: "Стоматолог" },
    availableService: SERVICES.map((s) => ({ "@type": "MedicalProcedure", name: s.title })),
  })}</script>`,
  body: (p) => `
<section class="hero" aria-labelledby="hero-title">
  <div class="container hero-grid">
    <div class="hero-copy hero-anim">
      <span class="eyebrow eyebrow--plain">Современная стоматология с заботой о вашем здоровье</span>
      <h1 id="hero-title"><span>Доктор</span> <em>Кудрявцева</em></h1>
      <ul class="specs">${SPECS.map((s) => `<li>${s}</li>`).join("")}</ul>
      <p class="lead">Лечение корневых каналов под микроскопом, эстетическая реставрация, протезирование и имплантация — с бережным отношением к собственным зубам.</p>
      <div class="btn-row">
        <a class="btn btn--primary" href="${p}contacts.html#zapis">${ic("i-calendar")}Записаться на приём${ic("i-arrow")}</a>
        <a class="btn btn--ghost" href="${p}services.html">Все услуги</a>
      </div>
    </div>
    <figure class="hero-figure" style="margin:0">
      <div class="arch">${portrait(p, { eager: true })}</div>
      <figcaption class="nameplate">${ic("i-tooth")}<span><b>Кудрявцева Анна Дмитриевна</b><small>Стоматолог</small></span></figcaption>
    </figure>
  </div>
</section>

<section class="section--tight" style="padding-top:0" aria-label="Преимущества">
  <div class="container">
    <ul class="perks" style="list-style:none;margin:0;padding:0">${PERKS.map((x) => `<li class="perk">${ic(x.icon)}<span>${x.text}</span></li>`).join("")}</ul>
  </div>
</section>

<section class="section" style="padding-top:clamp(24px,3vw,40px)" aria-labelledby="services-title">
  <div class="container">
    <div class="section-head">
      <div><span class="eyebrow">Услуги</span><h2 id="services-title">Направления лечения</h2></div>
      <a class="link-arrow" href="${p}services.html">Смотреть все услуги${ic("i-arrow")}</a>
    </div>
    <div class="services-grid" data-reveal>${SERVICES.map((s) => serviceCard(p, s)).join("")}</div>
  </div>
</section>

<section class="about-band section" aria-labelledby="about-title">
  <div class="container about-grid">
    <div class="about-photo" data-reveal>${portrait(p, { sizes: "(max-width: 760px) 340px, 360px" })}</div>
    <div class="about-copy" data-reveal>
      <span class="eyebrow">О докторе</span>
      <h2 id="about-title">Кудрявцева <span>Анна Дмитриевна</span></h2>
      <p class="lead">Стоматолог, специализирующийся на сложном лечении корневых каналов под микроскопом, эстетической реставрации и восстановлении зубов.</p>
      <div class="facts">
        <span class="fact">${ic("i-microscope")}Эндодонтия под микроскопом</span>
        <span class="fact">${ic("i-crown")}Ортопедия</span>
        <span class="fact">${ic("i-implant")}Хирургия и имплантология</span>
      </div>
      <div><a class="btn btn--ghost" href="${p}about.html">Подробнее о докторе${ic("i-arrow")}</a></div>
    </div>
  </div>
</section>

<section class="section" aria-labelledby="cases-title">
  <div class="container">
    <div class="section-head">
      <div><span class="eyebrow">Примеры работ</span><h2 id="cases-title">Примеры лечения</h2></div>
      <a class="link-arrow" href="${p}cases.html">Смотреть все работы${ic("i-arrow")}</a>
    </div>
    <div class="cases-grid" data-cases data-limit="3"></div>
  </div>
</section>

<section class="section section--ivory" aria-labelledby="steps-title">
  <div class="container">
    <div class="section-head"><div><span class="eyebrow">Этапы лечения</span><h2 id="steps-title">Как проходит лечение</h2></div></div>
    ${stepsList()}
  </div>
</section>

${bookingBand(p, "home")}
`,
});

/* ---------------- Услуги ---------------- */
pages.push({
  path: "services.html",
  title: "Услуги",
  active: "services",
  description: "Услуги доктора Кудрявцевой: эстетическая реставрация, перелечивание каналов под микроскопом, протезирование, имплантация, костная пластика, удаление зубов мудрости.",
  body: (p) => `
<section class="page-hero">
  <div class="container hero-anim">
    ${crumbs(p, [{ label: "Услуги" }])}
    <span class="eyebrow">Услуги</span>
    <h1>Направления лечения</h1>
    <p class="lead">Терапия и эндодонтия под микроскопом, ортопедия, хирургия и имплантология. Выберите направление, чтобы узнать, как проходит лечение.</p>
  </div>
</section>
<section class="section" style="padding-top:0">
  <div class="container service-rows">
    ${SERVICES.map((s) => `<a class="service-row" href="${p}services/${s.slug}.html" data-reveal>
      <span class="service-art">${ic(s.icon)}</span>
      <span class="service-row-body">
        <span class="eyebrow eyebrow--plain">${s.spec}</span>
        <h2>${s.title}</h2>
        <span class="muted">${s.lead}</span>
        <ul class="tags">${s.tags.map((t) => `<li>${t}</li>`).join("")}</ul>
      </span>
      <span class="btn btn--ghost btn--sm">Подробнее${ic("i-arrow")}</span>
    </a>`).join("")}
  </div>
</section>
<section class="section section--ivory">
  <div class="container">
    <div class="section-head"><div><span class="eyebrow">Этапы лечения</span><h2>Как проходит лечение</h2></div></div>
    ${stepsList()}
  </div>
</section>
${bookingBand(p, "services")}
`,
});

/* ---------------- Страницы услуг ---------------- */
for (const s of SERVICES) {
  pages.push({
    path: `services/${s.slug}.html`,
    title: s.title,
    active: "services",
    description: s.seo,
    jsonld: `<script type="application/ld+json">${JSON.stringify({
      "@context": "https://schema.org", "@type": "MedicalProcedure", name: s.title, description: s.lead,
    })}</script>`,
    body: (p) => `
<section class="page-hero">
  <div class="container detail-hero">
    <div class="detail-copy hero-anim">
      ${crumbs(p, [{ href: p + "services.html", label: "Услуги" }, { label: s.title }])}
      <span class="eyebrow">${s.spec}</span>
      <h1>${s.title}</h1>
      <p class="lead">${s.lead}</p>
      <div class="btn-row">
        <a class="btn btn--primary" href="#zapis-usluga">${ic("i-calendar")}Записаться на приём</a>
        <a class="btn btn--ghost" href="${p}cases.html#${s.cat}">Примеры работ</a>
      </div>
    </div>
    <span class="service-art" aria-hidden="true">${ic(s.icon)}</span>
  </div>
</section>
<section class="section" style="padding-top:0">
  <div class="container detail-layout">
    <div class="detail-main">
      <div class="detail-block" data-reveal>
        <h2>Когда это нужно</h2>
        <ul class="bullets">${s.when.map((w) => `<li>${ic("i-check")}<span>${w}</span></li>`).join("")}</ul>
      </div>
      <div class="detail-block" data-reveal>
        <h2>Как проходит лечение</h2>
        <ol class="timeline">${s.how.map(([t, d], i) => `<li><span class="n">${i + 1}</span><div><h3>${t}</h3><p>${d}</p></div></li>`).join("")}</ol>
      </div>
      <div class="note-card" data-reveal>
        <h3>Что важно знать</h3>
        <ul>${s.notes.map((n) => `<li>${n}</li>`).join("")}</ul>
      </div>
      <div class="detail-block" data-reveal>
        <h2>Стоимость</h2>
        ${todo("<b>Раздел для заполнения.</b> Цены будут добавлены после согласования с доктором. Точный объём лечения определяется на консультации.")}
      </div>
    </div>
    <aside class="aside-card" aria-label="Запись и другие услуги">
      <h3>Нужна консультация?</h3>
      <p class="muted">Врач осмотрит, при необходимости назначит снимки и объяснит варианты лечения.</p>
      <a class="btn btn--primary" href="#zapis-usluga">Записаться${ic("i-arrow")}</a>
      <span class="eyebrow eyebrow--plain" style="margin-top:8px">Другие услуги</span>
      <ul class="aside-nav">${SERVICES.filter((o) => o.slug !== s.slug).map((o) => `<li><a href="${p}services/${o.slug}.html">${o.title}${ic("i-arrow")}</a></li>`).join("")}</ul>
    </aside>
  </div>
</section>
<div id="zapis-usluga">${bookingBand(p, "svc", s.slug)}</div>
`,
  });
}

/* ---------------- О докторе ---------------- */
pages.push({
  path: "about.html",
  title: "О докторе",
  active: "about",
  description: "Анна Дмитриевна Кудрявцева — стоматолог-эндодонтист-микроскопист, ортопед, хирург-имплантолог. Лечение зубов под микроскопом.",
  jsonld: `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org", "@type": "Person", name: "Анна Дмитриевна Кудрявцева", jobTitle: "Стоматолог", knowsAbout: SPECS,
  })}</script>`,
  body: (p) => `
<section class="page-hero">
  <div class="container about-hero">
    <figure class="hero-figure" style="margin:0">
      <div class="arch">${portrait(p, { eager: true, sizes: "(max-width: 860px) 86vw, 420px" })}</div>
      <figcaption class="nameplate">${ic("i-tooth")}<span><b>Кудрявцева Анна Дмитриевна</b><small>Стоматолог</small></span></figcaption>
    </figure>
    <div class="detail-copy hero-anim">
      ${crumbs(p, [{ label: "О докторе" }])}
      <span class="eyebrow">О докторе</span>
      <h1>Кудрявцева Анна Дмитриевна</h1>
      <ul class="specs">${SPECS.map((s) => `<li>${s}</li>`).join("")}</ul>
      <p class="lead">Специализируется на сложном лечении корневых каналов под микроскопом, эстетической реставрации и восстановлении зубов.</p>
      <div class="btn-row"><a class="btn btn--primary" href="${p}contacts.html#zapis">${ic("i-calendar")}Записаться на приём</a></div>
    </div>
  </div>
</section>

<section class="section section--ivory">
  <div class="container">
    <div class="section-head"><div><span class="eyebrow">Специализации</span><h2>Три направления в одних руках</h2><p class="lead">Когда терапевтический, ортопедический и хирургический этапы ведёт один врач, план лечения остаётся цельным.</p></div></div>
    <div class="two-col" style="grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr))">
      <div class="panel" data-reveal><h3>${ic("i-microscope")}Эндодонтия</h3><p class="muted">Лечение и перелечивание корневых каналов под микроскопом, эстетическая реставрация зубов.</p><a class="link-arrow" href="${p}services/slozhnoe-perelechivanie.html">Перелечивание каналов${ic("i-arrow")}</a></div>
      <div class="panel" data-reveal><h3>${ic("i-crown")}Ортопедия</h3><p class="muted">Восстановление разрушенных и отсутствующих зубов: вкладки, коронки, виниры, конструкции на имплантатах.</p><a class="link-arrow" href="${p}services/protezirovanie.html">Протезирование${ic("i-arrow")}</a></div>
      <div class="panel" data-reveal><h3>${ic("i-implant")}Хирургия и имплантология</h3><p class="muted">Имплантация, костная пластика, удаление зубов мудрости.</p><a class="link-arrow" href="${p}services/implantaciya.html">Имплантация${ic("i-arrow")}</a></div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-head"><div><span class="eyebrow">Квалификация</span><h2>Образование и опыт</h2></div></div>
    <div class="two-col">
      <div class="panel" data-reveal><h3>${ic("i-cap")}Образование</h3>${todo("<b>Для заполнения:</b> учебное заведение, специальность, год окончания; ординатура/интернатура.")}</div>
      <div class="panel" data-reveal><h3>${ic("i-briefcase")}Опыт работы</h3>${todo("<b>Для заполнения:</b> стаж и места работы — после подтверждения доктором.")}</div>
      <div class="panel" data-reveal><h3>${ic("i-doc")}Повышение квалификации</h3>${todo("<b>Для заполнения:</b> курсы, обучение и даты прохождения.")}</div>
      <div class="panel" data-reveal><h3>${ic("i-award")}Сертификаты и аккредитация</h3>${todo("<b>Для заполнения:</b> сведения о действующих сертификатах/аккредитации специалиста.")}</div>
    </div>
  </div>
</section>

<section class="section section--ivory" aria-labelledby="micro-title">
  <div class="container micro">
    <div class="detail-block" data-reveal>
      <span class="eyebrow">Технологии</span>
      <h2 id="micro-title">Лечение под микроскопом</h2>
      <p class="lead">Дентальный микроскоп даёт многократное увеличение и яркий свет прямо по оси зрения врача. Детали, которые не видны невооружённым глазом, становятся различимы.</p>
      <ul class="micro-list">
        <li><span class="icon-wrap">${ic("i-eye")}</span><span><b>Видно больше</b><span>Можно найти дополнительные и узкие каналы, трещины, края старых пломб.</span></span></li>
        <li><span class="icon-wrap">${ic("i-sun")}</span><span><b>Свет без теней</b><span>Освещение направлено туда же, куда смотрит врач, — даже в глубине канала.</span></span></li>
        <li><span class="icon-wrap">${ic("i-shield")}</span><span><b>Бережно к тканям</b><span>Точная работа позволяет убирать только поражённые ткани и сохранять здоровые.</span></span></li>
        <li><span class="icon-wrap">${ic("i-target")}</span><span><b>Контроль каждого этапа</b><span>Качество обработки и пломбирования проверяется визуально по ходу лечения.</span></span></li>
      </ul>
    </div>
    <div class="micro-visual" aria-hidden="true">${ic("i-microscope")}</div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-head"><div><span class="eyebrow">Этапы лечения</span><h2>Как проходит лечение</h2></div></div>
    ${stepsList()}
  </div>
</section>
${bookingBand(p, "about")}
`,
});

/* ---------------- Примеры работ ---------------- */
pages.push({
  path: "cases.html",
  title: "Примеры работ",
  active: "cases",
  cases: true,
  description: "Примеры работ доктора Кудрявцевой: реальные клинические случаи «до и после» — реставрация, перелечивание каналов, протезирование, имплантация.",
  body: (p) => `
<section class="page-hero">
  <div class="container hero-anim">
    ${crumbs(p, [{ label: "Примеры работ" }])}
    <span class="eyebrow">До / После</span>
    <h1>Примеры работ</h1>
    <p class="lead">Реальные клинические случаи из практики доктора. Фотографии публикуются без ретуши результата.</p>
  </div>
</section>
<section class="section" style="padding-top:0">
  <div class="container">
    <div class="filters" data-case-filters role="group" aria-label="Категории работ"></div>
    <div class="cases-grid" data-cases data-category="all" aria-live="polite"></div>
    <p class="muted" style="margin-top:24px;font-size:.84rem;display:flex;gap:10px;align-items:flex-start">${ic("i-info")}<span>Подписи «До» и «После» ставятся только после подтверждения доктором. Для случаев, где порядок не подтверждён, фото показываются без этих подписей. Результат лечения индивидуален.</span></p>
  </div>
</section>
${bookingBand(p, "cases")}
`,
});

/* ---------------- Контакты ---------------- */
const contactItem = (icon, label, key, fallback) =>
  `<div class="contact-item"><span class="icon-wrap">${ic(icon)}</span><div><small>${label}</small><div class="val is-empty" data-cfg="${key}" data-cfg-mode="value"${key === "telegram" ? ' data-cfg-label="Написать в Telegram"' : key === "whatsapp" ? ' data-cfg-label="Написать в WhatsApp"' : ""}>${fallback}</div></div></div>`;

pages.push({
  path: "contacts.html",
  title: "Контакты и запись",
  active: "contacts",
  description: "Запись на приём к доктору Кудрявцевой: онлайн-форма, телефон, мессенджеры и адрес.",
  body: (p) => `
<section class="page-hero">
  <div class="container hero-anim">
    ${crumbs(p, [{ label: "Контакты" }])}
    <span class="eyebrow">Контакты</span>
    <h1>Контакты и запись</h1>
    <p class="lead">Оставьте заявку — с вами свяжутся, чтобы подобрать удобное время. Или свяжитесь напрямую по телефону и в мессенджерах.</p>
  </div>
</section>
<section class="section" style="padding-top:0">
  <div class="container contact-grid">
    <div class="contact-list">
      ${contactItem("i-phone", "Телефон", "phone", "Номер будет добавлен")}
      ${contactItem("i-send", "Telegram", "telegram", "Ссылка будет добавлена")}
      ${contactItem("i-chat", "WhatsApp", "whatsapp", "Ссылка будет добавлена")}
      ${contactItem("i-pin", "Адрес", "address", "Адрес будет добавлен")}
      ${contactItem("i-clock", "Часы приёма", "hours", "График будет добавлен")}
      <a class="btn btn--ghost" data-cfg="mapUrl" href="#" hidden>${ic("i-pin")}Открыть на карте</a>
    </div>
    <div class="form-card" id="zapis">
      <div class="detail-block" style="gap:8px">
        <span class="eyebrow">Онлайн-запись</span>
        <h2>Записаться на приём</h2>
      </div>
      ${bookingForm(p, "contact", { comment: true })}
    </div>
  </div>
</section>
`,
});

/* ---------------- Политика ---------------- */
pages.push({
  path: "privacy.html",
  title: "Политика обработки персональных данных",
  active: "",
  description: "Политика обработки персональных данных сайта доктора Кудрявцевой.",
  body: (p) => `
<section class="page-hero">
  <div class="container hero-anim">
    ${crumbs(p, [{ label: "Политика обработки данных" }])}
    <h1>Политика обработки персональных данных</h1>
  </div>
</section>
<section class="section" style="padding-top:0">
  <div class="container prose">
    ${todo("<b>Раздел для заполнения.</b> Текст политики составляется с учётом требований 152-ФЗ «О персональных данных» и должен содержать сведения об операторе (ФИО/наименование, ИНН, адрес), цели и состав обрабатываемых данных, сроки хранения и порядок отзыва согласия. Рекомендуем согласовать текст с юристом.")}
    <h2>Какие данные собирает форма записи</h2>
    <p>Имя, номер телефона, выбранная услуга и комментарий — только для того, чтобы связаться с вами и записать на приём.</p>
  </div>
</section>
`,
});

/* ---------------- 404 ---------------- */
pages.push({
  path: "404.html",
  title: "Страница не найдена",
  active: "",
  description: "Страница не найдена.",
  body: (p) => `
<section class="page-hero" style="min-height:50vh">
  <div class="container hero-anim">
    <span class="eyebrow">Ошибка 404</span>
    <h1>Такой страницы нет</h1>
    <p class="lead">Возможно, ссылка устарела. Перейдите на главную или выберите услугу.</p>
    <div class="btn-row"><a class="btn btn--primary" href="/">На главную</a><a class="btn btn--ghost" href="/services.html">Все услуги</a></div>
  </div>
</section>
`,
});

/* ---------------- Запись файлов ---------------- */
for (const pg of pages) {
  const out = join(ROOT, pg.path);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, page(pg));
}

const robots = `User-agent: *\nAllow: /\n${SITE_URL ? `Sitemap: ${SITE_URL}/sitemap.xml\n` : ""}`;
writeFileSync(join(ROOT, "robots.txt"), robots);
if (SITE_URL) {
  const urls = pages.filter((x) => x.path !== "404.html").map((x) =>
    `  <url><loc>${SITE_URL}/${x.path === "index.html" ? "" : x.path}</loc></url>`).join("\n");
  writeFileSync(join(ROOT, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
}
console.log("Готово:", pages.map((x) => x.path).join(", "));
