// Сборка статических страниц: node src/build.mjs
// Шапка, подвал, иконки и форма записи общие для всех страниц.
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { SPECS, PERKS, STEPS, SERVICES, ABOUT } from "./content.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

// Адрес сайта (без слеша в конце). При подключении своего домена — замените и пересоберите.
const SITE_URL = "https://dr-kudryavceva.vercel.app";

const SITE = "Доктор Кудрявцева";
const VER = "2";

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

function link(p, href) { return href === "index" ? (p === "/" ? "/" : p || "./") : p + href; }

// Портреты — только масштабированные копии исходных фото, без ретуши и без генерации.
const PHOTOS = {
  front: { file: "kudryavtseva-front", max: 917, h: 1200, alt: "Анна Дмитриевна Кудрявцева, стоматолог" },
  hand:  { file: "kudryavtseva-hand",  max: 883, h: 1247, alt: "Анна Дмитриевна Кудрявцева, стоматолог" },
};
function portrait(p, { sizes, eager = false, photo = "front", alt } = {}) {
  const f = PHOTOS[photo];
  const b = `${p}assets/img/${f.file}`;
  return `<picture>
      <source type="image/webp" srcset="${b}-520.webp 520w, ${b}-860.webp 860w, ${b}-${f.max}.webp ${f.max}w" sizes="${sizes}">
      <img src="${b}-860.jpg" width="860" height="${f.h}" alt="${alt || f.alt}" ${eager ? 'fetchpriority="high" decoding="async"' : 'loading="lazy" decoding="async"'}>
    </picture>`;
}

const nameplate = () => `<figcaption class="nameplate">${ic("i-tooth")}<span><b>Кудрявцева<br>Анна Дмитриевна</b><small>Стоматолог</small></span></figcaption>`;

function header(p, active) {
  const items = NAV.map((n) => `<li><a href="${link(p, n.href)}"${n.key === active ? ' aria-current="page"' : ""}>${n.label}</a></li>`).join("");
  const mItems = NAV.map((n) => `<li><a href="${link(p, n.href)}"${n.key === active ? ' aria-current="page"' : ""}>${n.label}${ic("i-arrow")}</a></li>`).join("");
  const logo = `<a class="logo" href="${link(p, "index")}" aria-label="${SITE} — на главную">${ic("i-tooth")}<span class="logo-text"><span>Доктор</span><span>Кудрявцева</span></span></a>`;
  return `<a class="skip-link" href="#main">Перейти к содержанию</a>
<header class="site-header">
  <div class="container header-inner">
    ${logo}
    <nav class="main-nav" aria-label="Основное меню"><ul>${items}</ul></nav>
    <a class="header-phone" data-cfg="phone" href="#" hidden>${ic("i-phone")}<span data-cfg-text></span></a>
    <a class="btn btn--primary btn--sm header-cta" href="${p}contacts.html#zapis">Записаться на приём</a>
    <div class="header-actions">
      <a class="round-btn round-btn--gold" data-contact-btn href="${p}contacts.html#zapis" aria-label="Записаться на приём">${ic("i-calendar")}</a>
      <button class="round-btn burger" type="button" aria-label="Открыть меню" aria-expanded="false" aria-controls="mobile-menu">${ic("i-menu")}</button>
    </div>
  </div>
</header>
<div class="mobile-menu" id="mobile-menu" aria-hidden="true" role="dialog" aria-modal="true" aria-label="Меню">
  <div class="mobile-menu-top">
    ${logo}
    <button class="round-btn" type="button" aria-label="Закрыть меню" data-menu-close>${ic("i-close")}</button>
  </div>
  <nav aria-label="Мобильное меню"><ul>${mItems}</ul></nav>
  <div class="mobile-menu-foot">
    <a class="btn btn--primary" href="${p}contacts.html#zapis">${ic("i-calendar")}Записаться на приём</a>
    <a class="btn btn--ghost" data-cfg="phone" href="#" hidden>${ic("i-phone")}<span data-cfg-text></span></a>
    <div class="messengers">
      <a class="btn btn--ghost" data-cfg="telegram" href="#" hidden>${ic("i-send")}Telegram</a>
      <a class="btn btn--ghost" data-cfg="whatsapp" href="#" hidden>${ic("i-chat")}WhatsApp</a>
    </div>
  </div>
</div>`;
}

function footer(p) {
  return `<footer class="site-footer">
  <div class="container">
    <div class="footer-top">
      <a class="logo" href="${link(p, "index")}">${ic("i-tooth")}<span class="logo-text"><span>Доктор</span><span>Кудрявцева</span></span></a>
      <nav class="footer-nav" aria-label="Разделы сайта"><ul>${NAV.map((n) => `<li><a href="${link(p, n.href)}">${n.label}</a></li>`).join("")}</ul></nav>
      <div class="footer-contacts">
        <a class="pill-link" data-cfg="telegram" data-cfg-keep-text href="#" hidden>${ic("i-send")}<span>Telegram</span></a>
        <a class="pill-link" data-cfg="whatsapp" data-cfg-keep-text href="#" hidden>${ic("i-chat")}<span>WhatsApp</span></a>
        <a class="pill-link" data-cfg="telegramChannel" data-cfg-keep-text href="#" hidden>${ic("i-send")}<span>Telegram-канал</span></a>
      </div>
    </div>
    <div class="footer-bottom">
      <div class="footer-legal">
        <span>© <span data-year>2026</span> ${SITE}. <a href="${p}privacy.html">Политика конфиденциальности</a> · <a href="${p}consent.html">Согласие на обработку данных</a></span>
        <span data-cfg="license" data-cfg-mode="text" hidden></span>
      </div>
      <span>Имеются противопоказания. Необходима консультация специалиста.</span>
    </div>
  </div>
</footer>
`;
}

function serviceOptions(selected = "") {
  return `<option value="">Выберите услугу</option>
      <option value="konsultaciya"${selected === "konsultaciya" ? " selected" : ""}>Консультация и диагностика</option>
      ${SERVICES.map((s) => `<option value="${s.slug}"${s.slug === selected ? " selected" : ""}>${s.title}</option>`).join("")}
      <option value="ne-znayu">Не знаю, нужна консультация врача</option>`;
}

function bookingForm(p, id, { dark = false, selected = "", comment = false } = {}) {
  const name = `<div class="field">
        <label for="${id}-name">Ваше имя</label>
        <div class="input-wrap">${ic("i-user")}<input id="${id}-name" name="name" type="text" autocomplete="name" placeholder="Как к вам обращаться" maxlength="80" required></div>
        <span class="field-error" aria-live="polite"></span>
      </div>`;
  const phone = `<div class="field">
        <label for="${id}-phone">Телефон</label>
        <div class="input-wrap">${ic("i-phone")}<input id="${id}-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="+7 (___) ___-__-__" required></div>
        <span class="field-error" aria-live="polite"></span>
      </div>`;
  const service = `<div class="field">
        <label for="${id}-service">Услуга</label>
        <div class="input-wrap">${ic("i-tooth")}<select id="${id}-service" name="service" required>${serviceOptions(selected)}</select></div>
        <span class="field-error" aria-live="polite"></span>
      </div>`;
  return `<form class="form${dark ? " form--dark" : ""}" data-booking novalidate>
    ${comment ? `<div class="form-grid form-grid--2">${name}${service}</div>` : `<div class="form-grid">${name}${service}</div>`}
    ${comment ? `<div class="field">
      <label for="${id}-comment">Комментарий <span class="muted">(необязательно)</span></label>
      <textarea id="${id}-comment" name="comment" rows="3" maxlength="1000" placeholder="Что беспокоит, удобные дни и время"></textarea>
    </div>` : ""}
    <div class="hp" aria-hidden="true"><label for="${id}-website">Не заполняйте это поле</label><input id="${id}-website" name="website" type="text" tabindex="-1" autocomplete="off"></div>
    <div class="form-foot">
      <label class="check"><input id="${id}-consent" type="checkbox" name="consent" required><span>Даю <a href="${p}consent.html">согласие на обработку персональных данных</a> и принимаю <a href="${p}privacy.html">политику конфиденциальности</a><span class="field-error" aria-live="polite"></span></span></label>
      <button class="btn btn--primary" type="submit">${ic("i-chat")}Записаться в WhatsApp</button>
    </div>
    <p class="form-status" role="status" aria-live="polite" hidden></p>
  </form>`;
}

function bookingBand(p, id, selected = "") {
  return `<section class="booking" id="${id}-booking" aria-labelledby="${id}-title">
  <div class="container">
    <div class="booking-card" data-reveal>
      <div class="booking-intro">
        <h2 id="${id}-title">Запишитесь на приём</h2>
        <p>Получите консультацию и индивидуальный план лечения. Заполните форму — откроется WhatsApp, где вам подберут время визита.</p>
      </div>
      ${bookingForm(p, id, { dark: true, selected })}
    </div>
  </div>
</section>`;
}

function serviceArt(p, s) {
  return `<span class="service-art${s.image ? " has-img" : ""}">${s.image ? `<img src="${p}${s.image}" alt="" loading="lazy" decoding="async">` : ic(s.icon)}</span>`;
}

function serviceCard(p, s, withText = false) {
  return `<a class="service-card" href="${p}services/${s.slug}.html">
      ${serviceArt(p, s)}
      <span class="service-body"><h3>${s.title}</h3>${withText ? `<p>${s.short}</p>` : ""}</span>
      <span class="go" aria-hidden="true">${ic("i-arrow")}</span>
    </a>`;
}

function stepsList(compact = false) {
  return `<ol class="steps${compact ? " steps--compact" : ""}">${STEPS.map((s, i) =>
    `<li class="step"><span class="step-num">0${i + 1}</span><div><h3>${s.t}</h3>${compact ? "" : `<p>${s.d}</p>`}</div></li>`).join("")}</ol>`;
}

function crumbs(p, items) {
  const all = [{ href: link(p, "index"), label: "Главная" }, ...items];
  return `<nav class="breadcrumbs" aria-label="Хлебные крошки"><ol>${all.map((c, i) =>
    i === all.length - 1 ? `<li aria-current="page">${c.label}</li>` : `<li><a href="${c.href}">${c.label}</a></li>`).join("")}</ol></nav>`;
}

function crumbsLd(items) {
  return `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [{ name: "Главная", path: "" }, ...items].map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: `${SITE_URL}/${c.path}` })),
  })}</script>`;
}

/* ---------------- Обёртка страницы ---------------- */
function page({ path, title, description, active, body, jsonld = "", cases = false, abs = false, noindex = false }) {
  const depth = path.split("/").length - 1;
  const p = abs ? "/" : depth ? "../".repeat(depth) : "";
  const fullTitle = title === SITE ? `${SITE} — стоматолог-эндодонтист, ортопед, хирург-имплантолог` : `${title} — ${SITE}`;
  const url = `${SITE_URL}/${path === "index.html" ? "" : path}`;
  return `<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${fullTitle}</title>
<meta name="claude:viewport-fit-sides" content="cover">
<meta name="description" content="${description}">
${noindex ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${url}">`}
<meta name="theme-color" content="#fbf7f2">
<meta property="og:type" content="website">
<meta property="og:locale" content="ru_RU">
<meta property="og:site_name" content="${SITE}">
<meta property="og:title" content="${fullTitle}">
<meta property="og:description" content="${description}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${SITE_URL}/assets/img/kudryavtseva-front-860.jpg">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="${FAVICON}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,500&family=Manrope:wght@400;500;600;700&display=swap">
<link rel="stylesheet" href="${p}assets/css/style.css?v=${VER}">
${path === "index.html" ? `<link rel="preload" as="image" type="image/webp" imagesrcset="${p}assets/img/kudryavtseva-front-520.webp 520w, ${p}assets/img/kudryavtseva-front-860.webp 860w, ${p}assets/img/kudryavtseva-front-917.webp 917w" imagesizes="(max-width: 760px) 92vw, 42vw">` : ""}
${jsonld}
<script>try{if(sessionStorage.getItem("introSeen")||matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.classList.add("no-intro")}catch(e){}</script>
<style>
.intro{position:fixed;inset:0;z-index:9999;display:grid;place-items:center;align-content:center;gap:26px;background:radial-gradient(ellipse at 50% 46%,#fffaf4 0%,#f8eee4 45%,#f1e3d6 100%);transition:opacity .6s ease,visibility .6s;}
.no-intro .intro{display:none}
.intro.is-done{opacity:0;visibility:hidden}
.intro svg{width:min(46vw,190px);height:auto;overflow:visible}
.intro .i-line{fill:none;stroke:url(#iGold);stroke-width:6.5;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:100;stroke-dashoffset:100;filter:drop-shadow(0 0 2px rgba(233,200,143,.9)) drop-shadow(0 6px 10px rgba(139,98,51,.18));animation:iDraw 1.3s .15s cubic-bezier(.55,.1,.35,1) forwards}
.intro .i-spark{offset-path:path("M100 50C90 42 80 37 68 37C48 37 38 52 38 72C38 92 46 104 50 122C54 140 56 170 70 170C82 170 82 150 86 138C89 128 93 122 100 122C107 122 111 128 114 138C118 150 118 170 130 170C144 170 146 140 150 122C154 104 162 92 162 72C162 52 152 37 132 37C120 37 110 42 100 50Z");offset-distance:0%;fill:#fff;filter:drop-shadow(0 0 3px #fff) drop-shadow(0 0 7px #e9c88f);opacity:0;animation:iSpark 1.3s .15s cubic-bezier(.55,.1,.35,1) forwards}
.intro .i-fill{fill:url(#iPearl);opacity:0;animation:iFade .7s 1.3s ease forwards}
.intro .i-shine{transform:translateX(-60px) skewX(-20deg);animation:iShine .9s 1.45s ease-in-out forwards}
.intro .i-swoosh{fill:url(#iSwoosh);opacity:0;animation:iFade .6s 1.6s ease forwards}
.intro .i-ring{fill:none;stroke:url(#iRing);stroke-width:3.2;stroke-linecap:round;stroke-dasharray:100;stroke-dashoffset:100;filter:drop-shadow(0 0 3px rgba(240,210,150,.95))}
.intro .i-ring.back{opacity:.75;animation:iDraw .7s 1.05s ease-out forwards}
.intro .i-ring.front{animation:iDraw .7s 1.35s ease-out forwards}
.intro .i-star{transform-box:fill-box;transform-origin:center;transform:scale(0) rotate(-45deg);opacity:0;fill:url(#iGold);filter:drop-shadow(0 0 4px rgba(233,200,143,.9));animation:iStar .8s 1.9s cubic-bezier(.3,1.6,.5,1) forwards,iTwinkle 1.4s 2.7s ease-in-out infinite}
.intro-name{font:500 clamp(.8rem,3.6vw,1.05rem)/1.2 Manrope,system-ui,sans-serif;letter-spacing:.42em;margin-right:-.42em;text-transform:uppercase;color:#8b6233;opacity:0;transform:translateY(8px);animation:iName .7s 1.5s ease forwards}
@keyframes iDraw{to{stroke-dashoffset:0}}
@keyframes iSpark{0%{opacity:0;offset-distance:0%}8%{opacity:1}90%{opacity:1}100%{opacity:0;offset-distance:100%}}
@keyframes iFade{to{opacity:1}}
@keyframes iShine{to{transform:translateX(210px) skewX(-20deg)}}
@keyframes iStar{to{transform:scale(1) rotate(0);opacity:1}}
@keyframes iTwinkle{0%,100%{transform:scale(1)}50%{transform:scale(.8)}}
@keyframes iName{to{opacity:1;transform:none}}
</style>
</head>
<body data-base="${p}">
<div class="intro" aria-hidden="true">
  <svg viewBox="0 0 200 200">
    <defs>
      <linearGradient id="iGold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f1d49b"/><stop offset=".35" stop-color="#c8944c"/><stop offset=".65" stop-color="#9a6a2e"/><stop offset="1" stop-color="#dcb06a"/></linearGradient>
      <linearGradient id="iRing" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#d9ae68" stop-opacity=".55"/><stop offset=".45" stop-color="#fff1d2"/><stop offset=".7" stop-color="#d4a45c"/><stop offset="1" stop-color="#c8944c" stop-opacity=".7"/></linearGradient>
      <radialGradient id="iPearl" cx=".42" cy=".3" r=".8"><stop offset="0" stop-color="#fffdf9"/><stop offset=".6" stop-color="#fbf3ea" stop-opacity=".9"/><stop offset="1" stop-color="#f3e5d4" stop-opacity=".6"/></radialGradient>
      <linearGradient id="iSwoosh" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#e6cfae"/><stop offset=".5" stop-color="#ffffff"/><stop offset="1" stop-color="#ffffff" stop-opacity=".2"/></linearGradient>
      <linearGradient id="iGlow" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".9"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
      <clipPath id="iClip"><path d="M100 50C90 42 80 37 68 37C48 37 38 52 38 72C38 92 46 104 50 122C54 140 56 170 70 170C82 170 82 150 86 138C89 128 93 122 100 122C107 122 111 128 114 138C118 150 118 170 130 170C144 170 146 140 150 122C154 104 162 92 162 72C162 52 152 37 132 37C120 37 110 42 100 50Z"/></clipPath>
    </defs>
    <g transform="rotate(-9 100 112)"><path class="i-ring back" pathLength="100" d="M16 112A84 19 0 0 1 184 112"/></g>
    <path class="i-fill" d="M100 50C90 42 80 37 68 37C48 37 38 52 38 72C38 92 46 104 50 122C54 140 56 170 70 170C82 170 82 150 86 138C89 128 93 122 100 122C107 122 111 128 114 138C118 150 118 170 130 170C144 170 146 140 150 122C154 104 162 92 162 72C162 52 152 37 132 37C120 37 110 42 100 50Z"/>
    <g clip-path="url(#iClip)"><rect class="i-shine" x="0" y="20" width="34" height="170" fill="url(#iGlow)"/></g>
    <path class="i-swoosh" d="M52 80C56 56 84 43 134 46C100 50 74 58 60 82C58 86 51 86 52 80Z"/>
    <path class="i-line" pathLength="100" d="M100 50C90 42 80 37 68 37C48 37 38 52 38 72C38 92 46 104 50 122C54 140 56 170 70 170C82 170 82 150 86 138C89 128 93 122 100 122C107 122 111 128 114 138C118 150 118 170 130 170C144 170 146 140 150 122C154 104 162 92 162 72C162 52 152 37 132 37C120 37 110 42 100 50Z"/>
    <circle class="i-spark" r="3"/>
    <g transform="rotate(-9 100 112)"><path class="i-ring front" pathLength="100" d="M184 112A84 19 0 0 1 16 112"/></g>
    <path class="i-star" d="M168 6C169.5 17 171 20.5 182 22C171 23.5 169.5 27 168 38C166.5 27 165 23.5 154 22C165 20.5 166.5 17 168 6Z"/>
  </svg>
  <span class="intro-name">Доктор Кудрявцева</span>
</div>
<script>(function(){var d=document.documentElement;if(d.classList.contains("no-intro"))return;var el=document.querySelector(".intro");function done(){if(!el||el.classList.contains("is-done"))return;el.classList.add("is-done");try{sessionStorage.setItem("introSeen","1")}catch(e){}setTimeout(function(){el&&el.remove()},700)}setTimeout(done,3100);el&&el.addEventListener("click",done)})();</script>
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
  description: "Анна Дмитриевна Кудрявцева — стоматолог-эндодонтист-микроскопист, ортопед, хирург-имплантолог. Лечение под микроскопом, эстетическая реставрация, протезирование, имплантация. Онлайн-запись на приём.",
  jsonld: `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Dentist",
    name: SITE,
    url: SITE_URL,
    image: SITE_URL + "/assets/img/kudryavtseva-front-860.jpg",
    description: "Стоматологическая практика Анны Дмитриевны Кудрявцевой: эндодонтия под микроскопом, эстетическая реставрация, протезирование, имплантация.",
    employee: { "@type": "Person", name: "Анна Дмитриевна Кудрявцева", jobTitle: "Стоматолог" },
    availableService: SERVICES.map((s) => ({ "@type": "MedicalProcedure", name: s.title, url: `${SITE_URL}/services/${s.slug}.html` })),
  })}</script>`,
  body: (p) => `
<section class="hero" aria-labelledby="hero-title">
  <span class="hero-arc" aria-hidden="true"></span>
  <div class="container hero-inner">
    <div class="hero-copy hero-anim">
      <span class="eyebrow eyebrow--plain">Современная стоматология<br>с заботой о вашем здоровье</span>
      <h1 id="hero-title"><span>Доктор</span> <span>Кудрявцева</span></h1>
      <ul class="specs">${SPECS.map((s) => `<li>${s}</li>`).join("")}</ul>
      <div class="btn-row">
        <a class="btn btn--primary" href="${p}contacts.html#zapis">${ic("i-calendar")}Записаться на приём</a>
        <a class="btn btn--ghost" href="${p}services.html">Все услуги</a>
      </div>
    </div>
    <figure class="hero-photo">
      ${portrait(p, { eager: true, sizes: "(max-width: 760px) 92vw, 42vw" })}
      ${nameplate()}
    </figure>
  </div>
</section>

<div class="perks-wrap">
  <div class="container">
    <ul class="perks" aria-label="Преимущества">${PERKS.map((x) => `<li class="perk">${ic(x.icon)}<span>${x.text}</span></li>`).join("")}</ul>
  </div>
</div>

<section class="section" aria-labelledby="services-title">
  <div class="container">
    <div class="section-head">
      <div><span class="eyebrow">Услуги</span><h2 id="services-title">Направления лечения</h2></div>
      <a class="link-arrow" href="${p}services.html"><span>Смотреть все услуги</span>${ic("i-arrow")}</a>
    </div>
    <div class="services-grid" data-reveal>${SERVICES.map((s) => serviceCard(p, s)).join("")}</div>
  </div>
</section>

<section class="section section--ivory" aria-labelledby="cases-title" data-cases-section hidden>
  <div class="container">
    <div class="section-head"><div><span class="eyebrow">Примеры работ</span><h2 id="cases-title">Примеры лечения</h2></div></div>
    <div class="case-list" data-cases></div>
  </div>
</section>

<section class="about-band" aria-labelledby="about-title">
  <div class="container about-grid">
    <figure class="about-photo">${portrait(p, { photo: "hand", sizes: "(max-width: 760px) 100vw, 400px" })}</figure>
    <div class="about-copy" data-reveal>
      <span class="eyebrow">О докторе</span>
      <h2 id="about-title">Кудрявцева <span>Анна Дмитриевна</span></h2>
      <p class="lead">Ведущий стоматолог-терапевт — эндодонтист (микроскопист). Лектор: проводит курсы по сложной эндодонтии, художественной реставрации и работе с дентальным микроскопом.</p>
      <div class="facts">
        <span class="fact">${ic("i-calendar")}В профессии с 2018 года</span>
        <span class="fact">${ic("i-microscope")}Микроскоп Carl Zeiss</span>
        <span class="fact">${ic("i-award")}№1 среди терапевтов Красногорска по версии Яндекса</span>
      </div>
      <div><a class="btn btn--ghost" href="${p}about.html">Подробнее о докторе${ic("i-arrow")}</a></div>
    </div>
    <div class="about-deco" aria-hidden="true"><span class="ring">${ic("i-microscope")}</span></div>
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
  jsonld: crumbsLd([{ name: "Услуги", path: "services.html" }]),
  body: (p) => `
<section class="page-hero">
  <div class="container hero-anim">
    ${crumbs(p, [{ label: "Услуги" }])}
    <span class="eyebrow">Услуги</span>
    <h1>Направления лечения</h1>
    <p class="lead">Терапия и эндодонтия под микроскопом, ортопедия, хирургия и имплантология. Выберите направление, чтобы узнать, как проходит лечение.</p>
  </div>
</section>
<section class="section section--flush-top">
  <div class="container service-rows">
    ${SERVICES.map((s) => `<a class="service-row" href="${p}services/${s.slug}.html" data-reveal>
      ${serviceArt(p, s)}
      <span class="service-row-body">
        <span class="eyebrow eyebrow--plain">${s.spec}</span>
        <h2>${s.title}</h2>
        <span class="muted">${s.short}</span>
        <ul class="tags">${s.tags.map((t) => `<li>${t}</li>`).join("")}</ul>
      </span>
      <span class="btn btn--ghost btn--sm">Подробнее${ic("i-arrow")}</span>
    </a>`).join("")}
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
      "@context": "https://schema.org", "@type": "MedicalProcedure", name: s.title, description: s.lead, url: `${SITE_URL}/services/${s.slug}.html`,
    })}</script>${crumbsLd([{ name: "Услуги", path: "services.html" }, { name: s.title, path: `services/${s.slug}.html` }])}`,
    body: (p) => `
<section class="page-hero">
  <div class="container detail-hero">
    <div class="detail-copy hero-anim">
      ${crumbs(p, [{ href: p + "services.html", label: "Услуги" }, { label: s.title }])}
      <span class="eyebrow">${s.spec}</span>
      <h1>${s.title}</h1>
      <p class="lead">${s.lead}</p>
      <div class="btn-row">
        <a class="btn btn--primary" href="#svc-booking">${ic("i-calendar")}Записаться на приём</a>
      </div>
    </div>
    ${serviceArt(p, s).replace('<span class="service-art', '<span aria-hidden="true" class="service-art')}
  </div>
</section>
<section class="section section--flush-top">
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
    </div>
    <aside class="aside-card" aria-label="Запись и другие услуги">
      <h3>Нужна консультация?</h3>
      <p class="muted">Врач осмотрит, при необходимости назначит снимки и объяснит варианты лечения.</p>
      <a class="btn btn--primary" href="#svc-booking">Записаться${ic("i-arrow")}</a>
      <span class="eyebrow eyebrow--plain" style="margin-top:8px">Другие услуги</span>
      <ul class="aside-nav">${SERVICES.filter((o) => o.slug !== s.slug).map((o) => `<li><a href="${p}services/${o.slug}.html">${o.title}${ic("i-arrow")}</a></li>`).join("")}</ul>
    </aside>
  </div>
</section>
${bookingBand(p, "svc", s.slug)}
`,
  });
}

/* ---------------- О докторе ---------------- */
const QUAL = [
  ["education", "Образование", "i-cap"],
  ["experience", "Опыт работы", "i-briefcase"],
  ["courses", "Повышение квалификации", "i-doc"],
  ["certificates", "Сертификаты и аккредитация", "i-award"],
].filter(([k]) => ABOUT[k] && ABOUT[k].length);

pages.push({
  path: "about.html",
  title: "О докторе",
  active: "about",
  description: "Анна Дмитриевна Кудрявцева — стоматолог-эндодонтист-микроскопист, ортопед, хирург-имплантолог. Лечение под микроскопом, эстетическая реставрация, комплексный подход.",
  jsonld: `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org", "@type": "Person", name: "Анна Дмитриевна Кудрявцева", jobTitle: "Стоматолог",
    image: SITE_URL + "/assets/img/kudryavtseva-front-860.jpg", url: `${SITE_URL}/about.html`, knowsAbout: SPECS,
  })}</script>${crumbsLd([{ name: "О докторе", path: "about.html" }])}`,
  body: (p) => `
<section class="page-hero">
  <div class="container about-hero">
    <figure class="portrait-frame">
      <div class="frame">${portrait(p, { photo: "hand", eager: true, sizes: "(max-width: 760px) 84vw, 440px" })}</div>
      ${nameplate()}
    </figure>
    <div class="detail-copy hero-anim">
      ${crumbs(p, [{ label: "О докторе" }])}
      <span class="eyebrow">О докторе</span>
      <h1>Кудрявцева Анна Дмитриевна</h1>
      <ul class="specs">${SPECS.map((s) => `<li>${s}</li>`).join("")}</ul>
      <p class="lead">Ведущий стоматолог-терапевт — эндодонтист (микроскопист). Работает по специальности с 2018 года.</p>
      <div class="btn-row">
        <a class="btn btn--ghost" href="${p}services.html">Все услуги</a>
      </div>
    </div>
  </div>
</section>

<section class="section" aria-labelledby="bio-title">
  <div class="container bio">
    <div class="section-head"><div><span class="eyebrow">Обо мне</span><h2 id="bio-title">Опыт и подход к лечению</h2></div></div>
    <div class="bio-grid">
      <div class="bio-text" data-reveal>
        <p>Ведущий стоматолог-терапевт — эндодонтист (микроскопист). Работает по специальности с 2018 года. Является лектором, проводит курсы по сложной эндодонтии, художественной реставрации, а также по работе с дентальным микроскопом.</p>
        <p>Лечение проводит в коффердаме под немецким дентальным микроскопом Carl Zeiss. Выполняет художественные реставрации зубов, работает со сложной эндодонтией. Практикует лечение под седацией/наркозом. Ведёт фотопротокол всех первичных пациентов, а также до/во время/после лечения.</p>
        <p>Имеет стаж на руководящих должностях (заведующая терапевтическим отделением).</p>
      </div>
      <ul class="bio-facts" data-reveal>
        <li><b>2018</b><span>начало работы по специальности</span></li>
        <li><b>№1</b><span>в рейтинге популярных стоматологов-терапевтов г.&nbsp;Красногорска по версии Яндекса</span></li>
        <li><b>Лектор</b><span>курсы по сложной эндодонтии, художественной реставрации и работе с микроскопом</span></li>
        <li><b>Carl Zeiss</b><span>лечение в коффердаме под немецким дентальным микроскопом</span></li>
      </ul>
    </div>
  </div>
</section>

<section class="section section--ivory">
  <div class="container">
    <div class="section-head"><div><span class="eyebrow">Направления</span><h2>Три специализации</h2><p class="lead">Терапевтический, ортопедический и хирургический этапы лечения ведёт один врач.</p></div></div>
    <div class="cards-3">
      <div class="panel" data-reveal><h3>${ic("i-microscope")}Эндодонтия под микроскопом</h3><p>Лечение и перелечивание корневых каналов с увеличением, когда важна каждая деталь анатомии зуба.</p><a class="link-arrow" href="${p}services/slozhnoe-perelechivanie.html"><span>Перелечивание каналов</span>${ic("i-arrow")}</a></div>
      <div class="panel" data-reveal><h3>${ic("i-crown")}Ортопедия</h3><p>Восстановление разрушенных и отсутствующих зубов: вкладки, коронки, виниры, конструкции на имплантатах.</p><a class="link-arrow" href="${p}services/protezirovanie.html"><span>Протезирование</span>${ic("i-arrow")}</a></div>
      <div class="panel" data-reveal><h3>${ic("i-implant")}Хирургия и имплантология</h3><p>Имплантация, костная пластика и удаление зубов мудрости.</p><a class="link-arrow" href="${p}services/implantaciya.html"><span>Имплантация</span>${ic("i-arrow")}</a></div>
    </div>
  </div>
</section>

<section class="section" aria-labelledby="micro-title">
  <div class="container micro">
    <div class="detail-block" data-reveal>
      <span class="eyebrow">Технологии</span>
      <h2 id="micro-title">Лечение под микроскопом</h2>
      <p class="lead">Дентальный микроскоп даёт многократное увеличение и яркий свет по оси зрения врача. Детали, которые не видны невооружённым глазом, становятся различимы.</p>
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

<section class="section section--ivory">
  <div class="container">
    <div class="section-head"><div><span class="eyebrow">Подход</span><h2>Реставрация и комплексное лечение</h2></div></div>
    <div class="cards-3">
      <div class="panel" data-reveal><h3>${ic("i-sparkle-tooth")}Эстетическая реставрация</h3><p>Форма и цвет зуба восстанавливаются послойно, чтобы реставрация не отличалась от собственной эмали.</p><a class="link-arrow" href="${p}services/esteticheskaya-restavraciya.html"><span>Подробнее</span>${ic("i-arrow")}</a></div>
      <div class="panel" data-reveal><h3>${ic("i-shield")}Сохранение своих зубов</h3><p>Перед удалением врач оценивает, можно ли сохранить зуб с помощью лечения каналов и восстановления.</p></div>
      <div class="panel" data-reveal><h3>${ic("i-tooth")}Единый план</h3><p>Лечение, протезирование и хирургия планируются вместе, с учётом конечного результата.</p></div>
    </div>
  </div>
</section>

${QUAL.length ? `<section class="section">
  <div class="container">
    <div class="section-head"><div><span class="eyebrow">Квалификация</span><h2>Образование и опыт</h2></div></div>
    <div class="cards-3" style="grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr))">
      ${QUAL.map(([k, t, i]) => `<div class="panel" data-reveal><h3>${ic(i)}${t}</h3><ul class="qual-list">${ABOUT[k].map((r) => `<li>${r.year ? `<span class="y">${r.year}</span>` : "<span></span>"}<span class="t">${r.text}</span></li>`).join("")}</ul></div>`).join("")}
    </div>
  </div>
</section>` : ""}

${bookingBand(p, "about")}
`,
});

/* ---------------- Примеры работ ---------------- */
pages.push({
  path: "cases.html",
  title: "Примеры работ",
  active: "cases",
  cases: true,
  description: "Примеры работ доктора Кудрявцевой: реальные клинические случаи — реставрация, перелечивание каналов, протезирование, имплантация.",
  jsonld: crumbsLd([{ name: "Примеры работ", path: "cases.html" }]),
  body: (p) => `
<section class="page-hero">
  <div class="container hero-anim">
    ${crumbs(p, [{ label: "Примеры работ" }])}
    <span class="eyebrow">Клинические случаи</span>
    <h1>Примеры работ</h1>
    <p class="lead">Реальные случаи из практики доктора. Фотографии публикуются без ретуши и изменения результата лечения.</p>
  </div>
</section>
<section class="section section--flush-top">
  <div class="container">
    <div class="filters" data-case-filters role="group" aria-label="Категории работ" hidden></div>
    <div class="case-list" data-cases data-category="all" aria-live="polite"></div>
    <p class="muted" data-cases-note hidden style="margin-top:24px;font-size:.88rem;display:flex;gap:10px;align-items:flex-start">${ic("i-info")}<span>Фотографии публикуются без ретуши. Результат лечения индивидуален.</span></p>
  </div>
</section>
${bookingBand(p, "cases")}
`,
});

/* ---------------- Контакты ---------------- */
const contactItem = (key, icon, label, text = "") =>
  `<a class="contact-item" data-cfg="${key}" href="#" hidden${text ? " data-cfg-keep-text" : ""}><span class="icon-wrap">${ic(icon)}</span><span><small>${label}</small><span class="val" data-cfg-text>${text}</span></span></a>`;

pages.push({
  path: "contacts.html",
  title: "Контакты и запись",
  active: "contacts",
  description: "Запись на приём к доктору Кудрявцевой: онлайн-форма, телефон и мессенджеры.",
  jsonld: crumbsLd([{ name: "Контакты", path: "contacts.html" }]),
  body: (p) => `
<section class="page-hero">
  <div class="container hero-anim">
    ${crumbs(p, [{ label: "Контакты" }])}
    <span class="eyebrow">Контакты</span>
    <h1>Контакты и запись</h1>
    <p class="lead">Заполните форму — откроется WhatsApp с готовым сообщением. Или напишите напрямую в удобный мессенджер.</p>
  </div>
</section>
<section class="section section--flush-top">
  <div class="container contact-grid">
    <div class="contact-side">
      <div class="contact-list" data-contact-list>
        ${contactItem("phone", "i-phone", "Телефон")}
        ${contactItem("telegram", "i-send", "Telegram", "@Kudryavceva_Anna")}
        ${contactItem("whatsapp", "i-chat", "WhatsApp", "Написать в WhatsApp")}
        ${contactItem("telegramChannel", "i-send", "Telegram-канал", "@Dr_Vesnushka")}
        ${contactItem("email", "i-mail", "Почта")}
        <div class="contact-item" data-cfg="address" data-cfg-mode="show" hidden><span class="icon-wrap">${ic("i-pin")}</span><span><small>Адрес</small><span class="val" data-cfg-from="address"></span><a class="link-arrow" data-cfg="mapUrl" href="#" hidden><span>Открыть на карте</span>${ic("i-arrow")}</a></span></div>
        <div class="contact-item" data-cfg="hours" data-cfg-mode="show" hidden><span class="icon-wrap">${ic("i-clock")}</span><span><small>Часы приёма</small><span class="val" data-cfg-from="hours"></span></span></div>
      </div>
      <div class="panel">
        <h3>${ic("i-calendar")}Как проходит запись</h3>
        <ol class="how-book" style="list-style:none">
          <li><span class="step-num">1</span><span>Вы заполняете форму на сайте — открывается WhatsApp, или пишете в удобный мессенджер сами.</span></li>
          <li><span class="step-num">2</span><span>Вам отвечают и подбирают удобное время консультации.</span></li>
          <li><span class="step-num">3</span><span>На приёме врач проводит диагностику и предлагает план лечения.</span></li>
        </ol>
      </div>
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

/* ---------------- Юридические документы ---------------- */
const requisites = `<div class="requisites" data-requisites hidden>
  <b>Сведения об операторе</b>
  <span data-cfg="operator" data-cfg-mode="text" hidden></span>
  <span data-cfg="inn" data-cfg-mode="text" data-cfg-prefix="ИНН " hidden></span>
  <span data-cfg="ogrn" data-cfg-mode="text" data-cfg-prefix="ОГРН/ОГРНИП " hidden></span>
  <span data-cfg="legalAddress" data-cfg-mode="text" data-cfg-prefix="Адрес: " hidden></span>
  <span data-cfg="email" data-cfg-mode="text" data-cfg-prefix="E-mail для обращений: " hidden></span>
  <span data-cfg="license" data-cfg-mode="text" hidden></span>
</div>`;

pages.push({
  path: "privacy.html",
  title: "Политика конфиденциальности",
  active: "",
  description: "Политика обработки персональных данных пользователей сайта «Доктор Кудрявцева».",
  body: (p) => `
<section class="page-hero">
  <div class="container hero-anim">
    ${crumbs(p, [{ label: "Политика конфиденциальности" }])}
    <h1>Политика обработки персональных данных</h1>
  </div>
</section>
<section class="section section--flush-top">
  <div class="container prose">
    ${requisites}
    <h2>1. Общие положения</h2>
    <p>Настоящая политика определяет порядок обработки и защиты персональных данных пользователей сайта «${SITE}» (далее — Сайт) в соответствии с Федеральным законом от 27.07.2006 № 152-ФЗ «О персональных данных». Оператором персональных данных является лицо, сведения о котором указаны на этой странице (далее — Оператор).</p>
    <h2>2. Какие данные обрабатываются</h2>
    <ul>
      <li>имя (как к пользователю обращаться);</li>
      <li>номер телефона;</li>
      <li>выбранная услуга и комментарий, если пользователь его оставил;</li>
      <li>технические данные, которые браузер передаёт автоматически при посещении Сайта (IP-адрес, сведения о браузере).</li>
    </ul>
    <p>Через форму Сайта не запрашиваются сведения о состоянии здоровья. Пожалуйста, не указывайте их в комментарии — подробности обсуждаются на приёме.</p>
    <h2>3. Цели обработки</h2>
    <ul>
      <li>связь с пользователем по его заявке и запись на консультацию;</li>
      <li>ответы на обращения пользователя.</li>
    </ul>
    <h2>4. Правовые основания</h2>
    <p>Обработка осуществляется на основании согласия пользователя, которое он даёт, отмечая соответствующее поле в форме записи.</p>
    <h2>5. Порядок и сроки обработки</h2>
    <p>Данные обрабатываются с использованием средств автоматизации и без них: сбор, запись, хранение, использование, удаление. Данные хранятся не дольше, чем этого требуют цели обработки, либо до отзыва согласия. Оператор не передаёт данные третьим лицам, за исключением случаев, предусмотренных законодательством РФ, и сервисов, необходимых для доставки заявки Оператору.</p>
    <h2>6. Права пользователя</h2>
    <p>Пользователь вправе получить сведения об обработке своих данных, потребовать их уточнения, блокирования или удаления, а также отозвать согласие, направив Оператору обращение по контактам, указанным на Сайте.</p>
    <h2>7. Защита данных</h2>
    <p>Оператор принимает правовые, организационные и технические меры для защиты персональных данных от неправомерного доступа, изменения, раскрытия или уничтожения.</p>
    <h2>8. Изменение политики</h2>
    <p>Оператор может обновлять настоящую политику. Актуальная версия всегда доступна на этой странице.</p>
  </div>
</section>
`,
});

pages.push({
  path: "consent.html",
  title: "Согласие на обработку персональных данных",
  active: "",
  description: "Согласие пользователя на обработку персональных данных при записи через сайт «Доктор Кудрявцева».",
  body: (p) => `
<section class="page-hero">
  <div class="container hero-anim">
    ${crumbs(p, [{ label: "Согласие на обработку данных" }])}
    <h1>Согласие на обработку персональных данных</h1>
  </div>
</section>
<section class="section section--flush-top">
  <div class="container prose">
    ${requisites}
    <p>Отправляя форму записи на сайте «${SITE}», я свободно, своей волей и в своём интересе даю согласие Оператору, сведения о котором указаны на этой странице, на обработку моих персональных данных: имени, номера телефона, выбранной услуги и комментария.</p>
    <p>Цель обработки — связь со мной по моей заявке и запись на консультацию.</p>
    <p>Согласие распространяется на сбор, запись, систематизацию, хранение, уточнение, использование и удаление данных с использованием средств автоматизации и без них.</p>
    <p>Согласие действует до достижения цели обработки или до его отзыва. Я могу отозвать согласие, направив Оператору обращение по контактам, указанным на сайте.</p>
    <p>С <a href="${p}privacy.html">политикой обработки персональных данных</a> ознакомлен(а).</p>
  </div>
</section>
`,
});

/* ---------------- 404 ---------------- */
pages.push({
  path: "404.html",
  title: "Страница не найдена",
  active: "",
  abs: true,
  noindex: true,
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

writeFileSync(join(ROOT, "robots.txt"), `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);
const today = new Date().toISOString().slice(0, 10);
const urls = pages.filter((x) => !x.noindex).map((x) =>
  `  <url><loc>${SITE_URL}/${x.path === "index.html" ? "" : x.path}</loc><lastmod>${today}</lastmod></url>`).join("\n");
writeFileSync(join(ROOT, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
console.log("Готово:", pages.map((x) => x.path).join(", "));
