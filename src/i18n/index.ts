import { en } from './locales/en';
import { ar } from './locales/ar';
import { ru } from './locales/ru';
import { hi } from './locales/hi';
import { zh } from './locales/zh';

/** Shape of every locale, derived from the English source of truth. */
export type Translations = typeof en;

export type Lang = "en" | "ar" | "ru" | "hi" | "zh";

export const translations = { en, ar, ru, hi, zh } as const;
