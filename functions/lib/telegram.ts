// Helper para enviar mensajes vía la Bot API de Telegram.

export const TELEGRAM_API = 'https://api.telegram.org';

/** Envía un mensaje de texto. Devuelve true si Telegram lo aceptó. */
export async function sendTelegramMessage(
  token: string,
  chatId: number,
  text: string
): Promise<boolean> {
  try {
    const res = await fetch(`${TELEGRAM_API}/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML'
      })
    });
    return res.ok;
  } catch {
    return false;
  }
}
