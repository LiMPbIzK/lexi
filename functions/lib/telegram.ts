// Helper para enviar mensajes vía la Bot API de Telegram.

export const TELEGRAM_API = 'https://api.telegram.org';

/** Envía un mensaje de texto. Devuelve true si Telegram lo aceptó. */
export async function sendTelegramMessage(
  token: string,
  chatId: number,
  text: string
): Promise<boolean> {
  return sendTelegramMessageRaw(token, chatId, text, undefined);
}

/** Envía un mensaje con botones de teclado en línea (inline keyboard). */
export async function sendTelegramMessageWithKeyboard(
  token: string,
  chatId: number,
  text: string,
  buttons: { text: string; callback_data: string }[][]
): Promise<boolean> {
  return sendTelegramMessageRaw(token, chatId, text, buttons);
}

async function sendTelegramMessageRaw(
  token: string,
  chatId: number,
  text: string,
  buttons?: { text: string; callback_data: string }[][]
): Promise<boolean> {
  try {
    const body: Record<string, unknown> = {
      chat_id: chatId,
      text,
      parse_mode: 'HTML'
    };
    if (buttons) {
      body.reply_markup = { inline_keyboard: buttons };
    }
    const res = await fetch(`${TELEGRAM_API}/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    return res.ok;
  } catch {
    return false;
  }
}

/** Confirma un callback_query (quita el "cargando" del botón). */
export async function answerCallbackQuery(token: string, callbackQueryId: string): Promise<boolean> {
  try {
    const res = await fetch(`${TELEGRAM_API}/bot${token}/answerCallbackQuery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ callback_query_id: callbackQueryId })
    });
    return res.ok;
  } catch {
    return false;
  }
}
