/*
 * Клинические случаи «До / После».
 *
 * Фотографии кладутся в папку assets/img/cases/ (лучше .webp или .jpg шириной 1200–1600 px).
 * Фото не ретушируются и не изменяются.
 *
 * Поля случая:
 *   id          — уникальный латинский идентификатор
 *   category    — одна из: restavraciya, perelechivanie, protezirovanie, implantaciya, kostnaya-plastika, udalenie
 *   title       — короткое название случая
 *   text        — описание (по желанию, только подтверждённые доктором сведения)
 *   photos      — массив фото: { src: "assets/img/cases/....webp", alt: "..." }
 *   order       — "confirmed"  — доктор подтвердил порядок: photos[0] = ДО, photos[1] = ПОСЛЕ
 *                 "unknown"    — порядок не подтверждён: фото показываются без подписей «до/после»
 *
 * Пример (раскомментируйте и замените на реальные файлы):
 *
 * {
 *   id: "case-01",
 *   category: "restavraciya",
 *   title: "Реставрация жевательного зуба",
 *   text: "",
 *   photos: [
 *     { src: "assets/img/cases/case-01-a.webp", alt: "Зуб до лечения" },
 *     { src: "assets/img/cases/case-01-b.webp", alt: "Зуб после реставрации" }
 *   ],
 *   order: "unknown"
 * },
 */
window.CASES = [
];
