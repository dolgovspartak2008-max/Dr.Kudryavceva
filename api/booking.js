// Серверная функция Vercel: принимает заявку с формы записи и пересылает её в Telegram.
//
// Переменные окружения (Vercel → Project → Settings → Environment Variables):
//   TELEGRAM_BOT_TOKEN — токен бота от @BotFather
//   TELEGRAM_CHAT_ID   — id чата/канала, куда приходят заявки (можно несколько через запятую)
//   BOOKING_WEBHOOK_URL — необязательно: дополнительный адрес (CRM, Make, n8n), получает JSON заявки
//
// Пока ни Telegram, ни webhook не настроены, функция отвечает 503 — и сайт честно сообщает,
// что заявка не отправлена.

const MAX = { name: 80, phone: 20, service: 120, comment: 1000, page: 200 };

function clean(v, max) {
  return String(v == null ? "" : v).replace(/[\u0000-\u001f\u007f]/g, " ").trim().slice(0, max);
}
function escHtml(s) {
  return s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
}

async function readBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") { try { return JSON.parse(req.body); } catch { return null; } }
  const chunks = [];
  for await (const ch of req) chunks.push(ch);
  try { return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}"); } catch { return null; }
}

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "method_not_allowed" });
  }

  const body = await readBody(req);
  if (!body) return res.status(400).json({ ok: false, error: "bad_json" });

  // Ловушка для ботов: скрытое поле должно быть пустым
  if (clean(body.website, 200)) return res.status(200).json({ ok: true });

  const data = {
    name: clean(body.name, MAX.name),
    phone: clean(body.phone, MAX.phone),
    service: clean(body.service, MAX.service),
    comment: clean(body.comment, MAX.comment),
    page: clean(body.page, MAX.page),
  };
  const digits = data.phone.replace(/\D/g, "");
  if (data.name.length < 2 || digits.length !== 11 || digits[0] !== "7") {
    return res.status(400).json({ ok: false, error: "validation" });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chats = String(process.env.TELEGRAM_CHAT_ID || "").split(",").map((s) => s.trim()).filter(Boolean);
  const webhook = process.env.BOOKING_WEBHOOK_URL;
  if (!(token && chats.length) && !webhook) {
    return res.status(503).json({ ok: false, error: "not_configured" });
  }

  const when = new Date().toLocaleString("ru-RU", { timeZone: "Europe/Moscow" });
  const text = [
    "<b>Новая заявка с сайта</b>",
    `Имя: ${escHtml(data.name)}`,
    `Телефон: ${escHtml("+" + digits)}`,
    data.service && `Услуга: ${escHtml(data.service)}`,
    data.comment && `Комментарий: ${escHtml(data.comment)}`,
    `Страница: ${escHtml(data.page || "/")}`,
    `Время (МСК): ${when}`,
  ].filter(Boolean).join("\n");

  let delivered = 0;
  const tasks = [];
  if (token) {
    for (const chat of chats) {
      tasks.push(
        fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: chat, text, parse_mode: "HTML", disable_web_page_preview: true }),
        }).then((r) => { if (r.ok) delivered++; else console.error("telegram", r.status); })
          .catch((e) => console.error("telegram", e.message))
      );
    }
  }
  if (webhook) {
    tasks.push(
      fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, phone: "+" + digits, createdAt: new Date().toISOString() }),
      }).then((r) => { if (r.ok) delivered++; else console.error("webhook", r.status); })
        .catch((e) => console.error("webhook", e.message))
    );
  }
  await Promise.all(tasks);

  if (!delivered) return res.status(502).json({ ok: false, error: "delivery_failed" });
  return res.status(200).json({ ok: true });
};
