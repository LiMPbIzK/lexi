// Tipos de dominio compartidos (cliente).

export interface Category {
  id: string;
  user_id: string | null;
  parent_id: string | null;
  name: string;
  color: string | null;
  icon_key: string | null;
  sort_order: number;
  created_at: number;
  updated_at: number;
  deleted_at: number | null;
}

export interface Card {
  id: string;
  user_id: string | null;
  category_id: string | null;
  label: string;
  image_key: string | null;
  audio_key: string | null;
  tts_text: string | null;
  sort_order: number;
  created_at: number;
  updated_at: number;
  deleted_at: number | null;
}

export interface User {
  id: string;
  display_name: string | null;
  locale: string;
  voice_uri: string | null;
  theme: string;
  created_at: number;
  last_seen_at: number;
}

export interface RecordItem {
  id: string;
  user_id: string | null;
  card_id: string | null;
  verb: string;
  at: number;
}

// Manifest ARASAAC (public/arasaac-manifest.json)
export interface ArasaacManifestCard {
  label: string;
  id: number;
  image: string;
  keyword: string;
}

export interface ArasaacManifestCategory {
  slug: string;
  label: string;
  color: string;
  emoji: string;
  cards: ArasaacManifestCard[];
}

export interface ArasaacManifest {
  version: number;
  updated: string;
  generated: string;
  categories: ArasaacManifestCategory[];
}
