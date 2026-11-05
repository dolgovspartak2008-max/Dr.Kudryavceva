/*
 * Клинические случаи.
 *
 * Фотографии кладутся в папку assets/img/cases/ (оригиналы без ретуши, .webp или .jpg шириной 1200–1600 px).
 *
 * Поля случая:
 *   id        — уникальный латинский идентификатор
 *   category  — restavraciya | perelechivanie | protezirovanie | implantaciya | kostnaya-plastika | udalenie
 *   title     — короткое название случая
 *   text      — описание (необязательно, только подтверждённые доктором сведения)
 *   photos    — массив фото: { src: "assets/img/cases/....webp", alt: "..." }
 *   order     — "unknown"   — порядок НЕ подтверждён: фото показываются как этапы лечения, без подписей «до/после»
 *               "confirmed" — доктор подтвердил порядок: тогда укажите before и after
 *   before    — номер фото «до» в массиве photos (с нуля), только при order: "confirmed"
 *   after     — номер фото «после», только при order: "confirmed"
 *   labels    — подписи к фото по порядку (необязательно), например ["До", "В процессе", "После"]
 *
 * Пример:
 * {
 *   id: "case-01",
 *   category: "restavraciya",
 *   title: "Реставрация жевательного зуба",
 *   text: "",
 *   photos: [
 *     { src: "assets/img/cases/case-01-1.webp", alt: "Жевательный зуб, снимок 1" },
 *     { src: "assets/img/cases/case-01-2.webp", alt: "Жевательный зуб, снимок 2" }
 *   ],
 *   order: "unknown"
 * },
 */
window.CASES = [
  {
    id: "restavraciya-01",
    category: "restavraciya",
    title: "Восстановление жевательных зубов",
    text: "Лечение в коффердаме: исходная ситуация, этап восстановления и финальный результат.",
    photos: [
      { src: "assets/img/cases/restavraciya-01-1-do.webp", alt: "Жевательные зубы до восстановления, в коффердаме" },
      { src: "assets/img/cases/restavraciya-01-2-process.webp", alt: "Жевательные зубы в процессе восстановления" },
      { src: "assets/img/cases/restavraciya-01-3-posle.webp", alt: "Жевательные зубы после восстановления, финальный результат" }
    ],
    labels: ["До", "В процессе", "После"],
    order: "confirmed",
    before: 0,
    after: 2
  }
];
