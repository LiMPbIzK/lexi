import type { Env } from '../env';
import { sendTelegramMessage } from '../lib/telegram';
import { generateCode } from '../lib/codes';
import { revokeCode } from '../lib/auth';

interface TelegramUpdate {
  message?: {
    chat?: { id?: number };
    text?: string;
  };
}

/**
 * POST /telegram/webhook
 * Recibe updates de Telegram. Solo responde al chat del propietario
 * (OWNER_CHAT_ID). El token del bot se lee del secreto TELEGRAM_BOT_TOKEN.
 */
export async function onRequestPost(context: {
  request: Request;
  env: Env;
}): Promise<Response> {
  const { request, env } = context;

  let update: TelegramUpdate;
  try {
    update = await request.json();
  } catch {
    // Telegram exige respuesta 200 ante cualquier payload
    return new Response('ok', { status: 200 });
  }

  const token = (env.TELEGRAM_BOT_TOKEN ?? '').trim();
  const rawOwner = String(env.OWNER_CHAT_ID ?? '').trim();
  const ownerChatId = parseInt(rawOwner, 10);
  if (!token || !Number.isFinite(ownerChatId)) {
    return new Response('Bot no configurado', { status: 500 });
  }

  const chatId = update.message?.chat?.id;
  const text = update.message?.text?.trim() ?? '';

  // Ignorar todo lo que no venga del propietario
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
            '/nuevo [n] [etiqueta] — genera códigos\n' +
            '/libres — códigos sin usar\n' +
            '/lista — todos los códigos\n' +
            '/revocar CODIGO — revoca un código'
        );
        break;

      case '/nuevo': {
        const nMatch = arg.match(/^(\d+)\s*(.*)$/);
        const n = nMatch ? Math.min(parseInt(nMatch[1], 10), 10) : 1;
        const label = nMatch ? nMatch[2].trim() || 'Dispositivo' : 'Dispositivo';
        const now = Date.now();
        const codes: string[] = [];
        for (let i = 0; i < n; i++) {
          const code = generateCode();
          codes.push(code);
          await env.DB.prepare(
            'INSERT OR IGNORE INTO invite_codes (code, label, created_at) VALUES (?, ?, ?)'
          )
            .bind(code, label, now)
            .run();
        }
        await sendTelegramMessage(
          token,
          chatId,
          `✅ ${n} código(s) generado(s) (${label}):\n\n${codes.map((c) => `<code>${c}</code>`).join('\n')}`
        );
        break;
      }

      case '/libres': {
        const rows = await env.DB.prepare(
          `SELECT code, label FROM invite_codes
           WHERE claimed_by IS NULL AND revoked_at IS NULL
           ORDER BY created_at DESC LIMIT 20`
        ).all<{ code: string; label: string }>();
        if (rows.results.length === 0) {
          await sendTelegramMessage(token, chatId, 'No hay códigos libres.');
        } else {
          const list = rows.results
            .map((r, i) => `${i + 1}. <code>${r.code}</code> · ${r.label}`)
            .join('\n');
          await sendTelegramMessage(token, chatId, `📦 Códigos libres:\n\n${list}`);
        }
        break;
      }

      case '/lista': {
        const rows = await env.DB.prepare(
          `SELECT code, label, created_at, claimed_by, claimed_at, revoked_at
           FROM invite_codes
           ORDER BY created_at DESC LIMIT 30`
        ).all<{
          code: string;
          label: string;
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
          const alta = new Date(r.created_at).toLocaleString('es-ES');
          let state = '🟢 Libre';
          if (r.revoked_at) state = '🔴 Revocado';
          else if (r.claimed_by) state = '🔵 Usado';
          const detail = [
            `<b>${r.code}</b> · ${r.label}`,
            `   Alta: ${alta} · ${state}`
          ];
          if (r.claimed_by) {
            detail.push(`   UUID: <code>${r.claimed_by.slice(0, 8)}…</code> · Uso: ${new Date(r.claimed_at!).toLocaleString('es-ES')}`);
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

      default:
        await sendTelegramMessage(token, chatId, 'Comando no reconocido. Usa /start para ver las opciones.');
    }
  } catch (e) {
    console.error('Bot error:', e);
    await sendTelegramMessage(token, chatId, '⚠ Error al procesar el comando.');
  }

  return new Response('ok', { status: 200 });
}
