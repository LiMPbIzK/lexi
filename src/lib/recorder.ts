// Grabación de audio con MediaRecorder (100% cliente).
// Soporta webm/opus (Chromium/Firefox) y mp4/aac (Safari) según el navegador.
// Límite de duración: 15 s por grabación (validado también en el servidor).

const MAX_DURATION_MS = 15000;

export interface RecordingResult {
  blob: Blob;
  mime: string;
  durationMs: number;
}

function bestMime(): string {
  if (typeof MediaRecorder === 'undefined') return '';
  const candidates = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/mp4',
    'audio/aac',
    'audio/mpeg'
  ];
  for (const c of candidates) {
    if (MediaRecorder.isTypeSupported(c)) return c;
  }
  return '';
}

export function canRecord(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof MediaRecorder !== 'undefined' &&
    typeof navigator.mediaDevices?.getUserMedia === 'function'
  );
}

/**
 * Graba audio hasta que se llama a stop() o se alcanza el límite (15 s).
 * Devuelve una promesa que resuelve con el blob y duración real.
 */
export async function startRecording(): Promise<{
  stop: () => Promise<RecordingResult | null>;
  cancel: () => void;
}> {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

  const mime = bestMime();
  const recorder = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);

  const chunks: Blob[] = [];
  recorder.addEventListener('dataavailable', (e) => {
    if (e.data.size > 0) chunks.push(e.data);
  });

  const startedAt = Date.now();
  let stopped = false;
  let timer: ReturnType<typeof setTimeout> | null = null;

  recorder.start();

  // límite de duración: detener automáticamente a los 15 s
  timer = setTimeout(() => {
    if (!stopped && recorder.state !== 'inactive') {
      recorder.stop();
    }
  }, MAX_DURATION_MS);

  return {
    stop: () =>
      new Promise<RecordingResult | null>((resolve) => {
        if (stopped) {
          resolve(null);
          return;
        }
        stopped = true;
        if (timer) clearTimeout(timer);

        const onStop = () => {
          stream.getTracks().forEach((t) => t.stop());
          if (chunks.length === 0) {
            resolve(null);
            return;
          }
          const durationMs = Date.now() - startedAt;
          const blob = new Blob(chunks, { type: recorder.mimeType || 'audio/webm' });
          resolve({ blob, mime: blob.type || 'audio/webm', durationMs });
        };

        if (recorder.state === 'inactive') {
          onStop();
        } else {
          recorder.addEventListener('stop', onStop, { once: true });
          recorder.stop();
        }
      }),
    cancel: () => {
      if (stopped) return;
      stopped = true;
      if (timer) clearTimeout(timer);
      try {
        if (recorder.state !== 'inactive') recorder.stop();
      } catch {
        /* ignore */
      }
      stream.getTracks().forEach((t) => t.stop());
    }
  };
}

export { MAX_DURATION_MS };
