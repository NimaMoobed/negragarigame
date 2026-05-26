// storage.ts — wrapper روی Capacitor Preferences با fallback به localStorage
// Capacitor Preferences در محیط وب (مرورگر) داخل localStorage ذخیره می‌کند، پس
// در عمل هم در اپ و هم در dev server کار می‌کند.

import { Preferences } from '@capacitor/preferences';

export async function getValue(key: string): Promise<string | null> {
  try {
    const { value } = await Preferences.get({ key });
    return value;
  } catch {
    return localStorage.getItem(key);
  }
}

export async function setValue(key: string, value: string): Promise<void> {
  try {
    await Preferences.set({ key, value });
  } catch {
    localStorage.setItem(key, value);
  }
}

export async function removeValue(key: string): Promise<void> {
  try {
    await Preferences.remove({ key });
  } catch {
    localStorage.removeItem(key);
  }
}

// Convenience: JSON-typed get/set
export async function getJson<T>(key: string): Promise<T | null> {
  const raw = await getValue(key);
  if (raw == null) return null;
  try { return JSON.parse(raw) as T; } catch { return null; }
}

export async function setJson(key: string, value: unknown): Promise<void> {
  await setValue(key, JSON.stringify(value));
}
