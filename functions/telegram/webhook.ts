import type { Env } from '../env';
import { sendTelegramMessage, sendTelegramMessageWithKeyboard, answerCallbackQuery } from '../lib/telegram';
import { generateCode } from '../lib/codes';
import { revokeCode } from '../lib/auth';

interface TelegramUpdate {
  message?: {
    chat?: { id?: number };
    text?: string;
  };
  callback_query?: {
    id?: string;
    message?: { chat?: { id?: number } };
    data?: string;
  };
}

/**
 * POST /telegram/webhook
 * Recibe updates de Telegram (mensajes y callbacks de botones).
 * Solo responde al chat del propietario (OWNER_CHAT_ID).
 */
/**
 * Formatea una fecha epoch (ms) en el huso horario del propietario.
 * En Workers no se hereda el TZ local: se fuerza el timeZone configurable
 * (TIME_ZONE, default Europe/Madrid) para que las horas sean las locales.
 */
function formatTime(ts: number, timeZone: string): string {
  return new Date(ts).toLocaleString('es-ES', { timeZone });
}

export async function onRequestPost(context: {
  request: Request;
  env: Env;
}): Promise<Response> {
  const { request, env } = context;

  let update: TelegramUpdate;
  try {
    update = await request.json();
  } catch {
    return new Response('ok', { status: 200 });
  }

  const token = (env.TELEGRAM_BOT_TOKEN ?? '').trim();
  const rawOwner = String(env.OWNER_CHAT_ID ?? '').trim();
  const ownerChatId = parseInt(rawOwner, 10);
  const timeZone = (env.TIME_ZONE ?? 'Europe/Madrid').trim();
  if (!token || !Number.isFinite(ownerChatId)) {
    return new Response('Bot no configurado', { status: 500 });
  }

  // ---- Callback de botón inline (confirmación de /borrar_todos) ----
  if (update.callback_query) {
    const cq = update.callback_query;
    const chatId = cq.message?.chat?.id;
    if (chatId !== ownerChatId || !cq.id) {
      return new Response('ok', { status: 200 });
    }
    await answerCallbackQuery(token, cq.id);

    if (cq.data === 'borrar_todos_confirm') {
      try {
        const res = await env.DB.prepare('DELETE FROM invite_codes').run();
        await sendTelegramMessage(
          token,
          chatId,
          `🗑️ Se eliminaron todos los códigos de invitación (${res.meta.changes}).`
        );
      } catch (e) {
        console.error('borrar todos error:', e);
        await sendTelegramMessage(token, chatId, '⚠ Error al borrar los códigos.');
      }
    } else {
      await sendTelegramMessage(token, chatId, 'Operación cancelada.');
    }
    return new Response('ok', { status: 200 });
  }

  // ---- Mensajes de texto ----
  const chatId = update.message?.chat?.id;
  const text = update.message?.text?.trim() ?? '';

  if (!chatId || chatId !== ownerChatId) {
    return new Response('ok', { status: 200 });
  }

  if (!text) return new Response('ok', { status: 200 });

  const [command, ...args] = text.split(/\s+/);
  const arg = args.join(' ').trim();

  try {
    switch (command) {
      case '/start':
        await sendTelegramMessage(
          token,
          chatId,
          '🤖 <b>LeXi — Gestor de códigos</b>\n\n' +
            '/nuevo [n] "etiqueta" "usuario" — genera códigos (usuario obligatorio)\n' +
            '/libres — códigos sin usar\n' +
            '/lista — todos los códigos\n' +
            '/revocar CODIGO — revoca un código\n' +
            '/borrar_todos — elimina TODOS los códigos (pide confirmación)'
        );
        break;

      case '/nuevo': {
        // Formato: /nuevo [n] "etiqueta" "usuario"   o   /nuevo [n] etiqueta usuario
        const quoted = arg.match(/^(\d+)?\s*(?:"([^"]*)"|(\S+))\s+(?:"([^"]*)"|(\S+))$/);
        const n = quoted && quoted[1] ? Math.min(parseInt(quoted[1], 10), 10) : 1;
        const label = quoted ? (quoted[2] ?? quoted[3] ?? 'Dispositivo') : 'Dispositivo';
        const user = quoted ? (quoted[4] ?? quoted[5] ?? '') : '';

        if (!user) {
          await sendTelegramMessage(
            token,
            chatId,
            '⚠ El <b>usuario</b> es obligatorio.\nUso: /nuevo 1 "Tablet casa García" "Marta"'
          );
          break;
        }

        const now = Date.now();
        const codes: string[] = [];
        for (let i = 0; i < n; i++) {
          const code = generateCode();
          codes.push(code);
          await env.DB.prepare(
            'INSERT OR IGNORE INTO invite_codes (code, label, user, created_at) VALUES (?, ?, ?, ?)'
          )
            .bind(code, label, user, now)
            .run();
        }
        await sendTelegramMessage(
          token,
          chatId,
          `✅ ${n} código(s) generado(s) — ${label} (${user}):\n\n${codes.map((c) => `<code>${c}</code>`).join('\n')}`
        );
        break;
      }

      case '/libres': {
        const rows = await env.DB.prepare(
          `SELECT code, label, user FROM invite_codes
           WHERE claimed_by IS NULL AND revoked_at IS NULL
           ORDER BY created_at DESC LIMIT 20`
        ).all<{ code: string; label: string; user: string }>();
        if (rows.results.length === 0) {
          await sendTelegramMessage(token, chatId, 'No hay códigos libres.');
        } else {
          const list = rows.results
            .map((r, i) => `${i + 1}. <code>${r.code}</code> · ${r.label}${r.user ? ` (${r.user})` : ''}`)
            .join('\n');
          await sendTelegramMessage(token, chatId, `📦 Códigos libres:\n\n${list}`);
        }
        break;
      }

      case '/lista': {
        const rows = await env.DB.prepare(
          `SELECT code, label, user, created_at, claimed_by, claimed_at, revoked_at
           FROM invite_codes
           ORDER BY created_at DESC LIMIT 30`
        ).all<{
          code: string;
          label: string;
          user: string;
          created_at: number;
          claimed_by: string | null;
          claimed_at: number | null;
          revoked_at: number | null;
        }>();

        if (rows.results.length === 0) {
          await sendTelegramMessage(token, chatId, 'Todavía no hay códigos.');
          break;
        }

        const lines = rows.results.map((r) => {
          const alta = formatTime(r.created_at, timeZone);
          let state = '🟢 Libre';
          if (r.revoked_at) state = '🔴 Revocado';
          else if (r.claimed_by) state = '🔵 Usado';
          const detail = [
            `<b>${r.code}</b> · ${r.label}${r.user ? ` · 👤 ${r.user}` : ''}`,
            `   Alta: ${alta} · ${state}`
          ];
          if (r.claimed_by) {
            detail.push(`   UUID: <code>${r.claimed_by.slice(0, 8)}…</code> · Uso: ${formatTime(r.claimed_at!, timeZone)}`);
          }
          return detail.join('\n');
        });

        await sendTelegramMessage(token, chatId, `📋 Códigos (${lines.length}):\n\n${lines.join('\n')}`);
        break;
      }

      case '/revocar': {
        if (!arg) {
          await sendTelegramMessage(token, chatId, 'Uso: /revocar LEXI-XXXX-XXXX');
          break;
        }
        const ok = await revokeCode(env, arg);
        await sendTelegramMessage(
          token,
          chatId,
          ok ? `✅ Código ${arg.toUpperCase()} revocado.` : `⚠ No se encontró un código ${arg.toUpperCase()} no revocado.`
        );
        break;
      }

      case '/borrar_todos': {
        await sendTelegramMessageWithKeyboard(
          token,
          chatId,
          '⚠️ ¿Seguro que quieres eliminar <b>TODOS</b> los códigos de invitación? Esta acción no se puede deshacer.',
          [[
            { text: '✅ Sí, borrar todo', callback_data: 'borrar_todos_confirm' },
            { text: '❌ Cancelar', callback_data: 'borrar_todos_cancel' }
          ]]
        );
        break;
      }

      default:
        await sendTelegramMessage(token, chatId, 'Comando no reconocido. Usa /start para ver las opciones.');
    }
  } catch (e) {
    console.error('Bot error:', e);
    await sendTelegramMessage(token, chatId, '⚠ Error al procesar el comando.');
  }

  return new Response('ok', { status: 200 });
}
