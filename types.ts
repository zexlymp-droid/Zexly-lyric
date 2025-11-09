
export const EMOTIONS = [
  "Rage", "Melancholy", "Dark Confidence", "Sarcastic / Annoying", "Street Cold",
  "Hopeful", "Aggressive Hype", "Reflective Nostalgia", "Vulnerable", "Defiant",
  "Celebratory", "Anxious / Paranoid", "Romantic", "Spiritual", "Playful"
] as const;

export const LANGUAGES = ["English", "Indonesian", "Japanese"] as const;

export const GENRES = [
  "Rap", "Drill", "Pop", "Trap", "R&B", 
  "Lo-Fi", "Hyperpop", "Indie", "Rock", "EDM"
] as const;

export type Emotion = typeof EMOTIONS[number];
export type Language = typeof LANGUAGES[number];
export type Genre = typeof GENRES[number];

export interface Enhancements {
  autoEmotionLink: boolean;
  autoCadenceAdjust: boolean;
  autoBeatSync: boolean;
}

export interface FormState {
  songTitle: string;
  story: string;
  genre: Genre | '';
  structure: string[];
  bpm: number;
  emotion: Emotion[];
  language: Language;
  enhancements: Enhancements;
}

export interface GenerationResult {
  lyrics: string;
  genreStyle: string;
  avoidStyle: string;
}

export interface HistoryItem {
  id: string;
  formState: FormState;
  result: GenerationResult;
  timestamp: number;
}